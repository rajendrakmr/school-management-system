"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sample permissions
    const permissions = [
      {
        mst_module_id: 1,
        permission_name: "View Dashboard",
        permission_description: "Allows viewing the dashboard",
        path_url: "/dashboard",
      },
      {
        mst_module_id: 2,
        permission_name: "View Roles",
        permission_description: "Allows viewing user list",
        path_url: "/roles",
      },
      {
        mst_module_id: 2,
        permission_name: "View Permissions",
        permission_description: "Allows viewing user list",
        path_url: "/permissions",
      },
      {
        mst_module_id: 2,
        permission_name: "View Role Permssions",
        permission_description: "Allows viewing user list",
        path_url: "/role-permissions",
      },
      {
        mst_module_id: 2,
        permission_name: "View Access Policies",
        permission_description: "Allows viewing user list",
        path_url: "/access-policies",
      },
    ];


    const existingPermissions = await queryInterface.sequelize.query(
      `SELECT permission_name FROM erp_mst_permissions`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const newPermissions = permissions.filter(
      (perm) => !existingPermissions.some((exist) => exist.permission_name === perm.permission_name)
    );

    const timestampedPermissions = newPermissions.map((perm) => ({
      ...perm,
      is_active: "Y",
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (timestampedPermissions.length > 0) {
      await queryInterface.bulkInsert("erp_mst_permissions", timestampedPermissions);
    }
  },

  async down(queryInterface, Sequelize) {
    const permissionNamesToDelete = [
      "View Dashboard",
      "View Roles",
      "View Permissions",
      "View Role Permssions",
      "View Access Policies",
    ];

    await queryInterface.bulkDelete("erp_mst_permissions", {
      permission_name: permissionNamesToDelete,
    }, {});
  },
};
