"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      { role_name: "Root User", tag: "root-user", role_description: "Full system access" },
      { role_name: "Admin", tag: "admin", role_description: "Administrator role with full access" },
      { role_name: "Developer", tag: "developer", role_description: "Administrator role with full access" },
      { role_name: "Viewer", tag: "viewer", role_description: "Read-only access" },
      { role_name: "School Admin", tag: "school-admin", role_description: "Manages school-specific settings and users" },
    ];

    // Check for existing roles to avoid duplicates
    const existingRoles = await queryInterface.sequelize.query(
      `SELECT role_name FROM erp_mst_roles`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const newRoles = roles.filter(
      (role) => !existingRoles.some((exist) => exist.role_name === role.role_name)
    );

    const timestampedRoles = newRoles.map((role) => ({
      ...role,
      is_active: "Y",
      is_default: "Y",
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (timestampedRoles.length > 0) {
      await queryInterface.bulkInsert("erp_mst_roles", timestampedRoles);
    }
  },

  async down(queryInterface, Sequelize) {
    const roleNamesToDelete = ["Root User", "Admin", "Developer", "Viewer", "School Admin"];
    await queryInterface.bulkDelete("erp_mst_roles", {
      role_name: roleNamesToDelete
    }, {});
  },
};
