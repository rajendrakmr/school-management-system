'use strict';
const { Op } = require("sequelize");

const menuJson = [
  {
    name: 'Dashboard',
    path: '/',
    has_child: "N",
    font_icon: "",
    order_no: 1,
  },
  {
    name: 'Access Control',
    path: '/rbac',
    has_child: "Y",
    font_icon: "",
    order_no: 2,
    children: [
      { name: 'Roles', path: '/roles' },
      { name: 'Permissions', path: '/permissions' },
      { name: 'Role Permissions', path: '/role-permissions' },
      { name: 'Access Policies', path: '/access-policies' }
    ]
  },
  {
    name: 'Schools',
    path: '/schools',
    has_child: "Y",
    font_icon: "",
    order_no: 3,
    children: [
      { name: 'School Details', path: '/schools' },
      { name: 'School Inquiries', path: '/schools-inquiry' }
    ]
  },
  {
    name: 'Academics',
    path: '/academics',
    has_child: "Y",
    font_icon: "",
    order_no: 4,
    children: [
      { name: 'Medium', path: '/medium' },
      { name: 'Section', path: '/section' },
      { name: 'Subject', path: '/subject' },
      { name: 'Semester', path: '/semester' },
      { name: 'Stream', path: '/stream' },
      { name: 'Shift', path: '/shift' },
      { name: 'Class', path: '/class' }
    ]
  }
];

/**
 * Utility function to get permissions
 */
function getAllPermissions(menuNames) {
  let menusToCheck;
  if (menuNames.includes("*")) {
    menusToCheck = menuJson; // all menus
  } else {
    menusToCheck = menuJson.filter(m => menuNames.includes(m.name));
  }

  return menusToCheck.flatMap(menu =>
    menu.has_child === "Y"
      ? menu.children.map(c => c.name)
      : [menu.name]
  );
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Insert modules
    const modulesToInsert = menuJson.map(menu => ({
      module_name: menu.name,
      has_child: menu.has_child,
      font_icon: menu.font_icon || "",
      order_no: menu.order_no,
      is_active: 'Y',
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('erp_mst_modules', modulesToInsert);

    // Step 2: Fetch inserted module IDs
    const modules = await queryInterface.sequelize.query(
      `SELECT mst_module_id, module_name FROM erp_mst_modules`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Step 3: Insert child permissions
    const permissions = [];

    menuJson.forEach(menu => {
      const module = modules.find(m => m.module_name.toLowerCase() === menu.name.toLowerCase());
      if (!module) return;

      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((child, index) => {
          permissions.push({
            order_no: index + 1,
            mst_module_id: module.mst_module_id,
            permission_name: `${child.name}`,
            path_url: child.path,
            is_active: 'Y',
            created_at: new Date(),
            updated_at: new Date()
          });
        });
      } else {
        // top-level menu permission
        permissions.push({
          order_no: menu.order_no,
          mst_module_id: module.mst_module_id,
          permission_name: `${menu.name}`,
          path_url: menu.path,
          is_active: 'Y',
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    });

    if (permissions.length > 0) {
      await queryInterface.bulkInsert('erp_mst_permissions', permissions);
    }

    // Step 4: Assign permissions to roles dynamically
    const allPermissions = await queryInterface.sequelize.query(
      `SELECT mst_permission_id, permission_name FROM erp_mst_permissions`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const permMap = {};
    allPermissions.forEach(p => permMap[p.permission_name] = p.mst_permission_id);

    // Example role assignments:
    const rolePermissions = [
      { mst_role_id: 1, permissionNames: getAllPermissions(["*"]) }, // Super Admin: all permissions
      { mst_role_id: 4, permissionNames: getAllPermissions(["Academics"]) }, // Admin: limited
    ];

    const timestampedRolePermissions = [];
    rolePermissions.forEach(rp => {
      rp.permissionNames.forEach(name => {
        if (permMap[name]) {
          timestampedRolePermissions.push({
            mst_role_id: rp.mst_role_id,
            mst_permission_id: permMap[name],
            can_view: "Y",
            can_edit: "Y",
            can_delete: "Y",
            can_update: "Y",
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      });
    });

    if (timestampedRolePermissions.length > 0) {
      await queryInterface.bulkInsert('erp_mst_role_has_permissions', timestampedRolePermissions);
    }
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Delete role-permissions
    await queryInterface.bulkDelete('erp_mst_role_has_permissions', null, {});

    // Step 2: Delete permissions
    const permissionNames = [];
    menuJson.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => permissionNames.push(`${child.name}`));
      } else {
        permissionNames.push(`${menu.name}`);
      }
    });

    await queryInterface.bulkDelete('erp_mst_permissions', {
      permission_name: { [Op.in]: permissionNames }
    }, {});

    // Step 3: Delete modules
    const moduleNames = menuJson.map(menu => menu.name);
    await queryInterface.bulkDelete('erp_mst_modules', {
      module_name: { [Op.in]: moduleNames }
    }, {});
  }
};
