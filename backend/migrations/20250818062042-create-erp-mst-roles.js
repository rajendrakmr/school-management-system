"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("erp_mst_roles", {
      mst_role_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      role_description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.ENUM("Y", "N"),
        defaultValue: "Y",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("erp_mst_roles");
  },
};
