"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Example role-permission mappings
    const rolePermissions = [ 
      { mst_role_id: 1, mst_permission_id: 1 },
      { mst_role_id: 1, mst_permission_id: 2 },
      { mst_role_id: 1, mst_permission_id: 3 },
      { mst_role_id: 1, mst_permission_id: 4 },

      // Admin - limited management
      { mst_role_id: 2, mst_permission_id: 1 },
      { mst_role_id: 2, mst_permission_id: 3 },

      // Developer - editing access
      { mst_role_id: 3, mst_permission_id: 2 },
      { mst_role_id: 3, mst_permission_id: 4 },
       
    ];

    const timestampedRolePermissions = rolePermissions.map((rp) => ({
      ...rp,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (timestampedRolePermissions.length > 0) {
      await queryInterface.bulkInsert(
        "erp_mst_role_has_permissions",
        timestampedRolePermissions
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("erp_mst_role_has_permissions", null, {});
  },
};
