"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mst_table_columns", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      column_key: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      column_label: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      column_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.ENUM("Y", "N"),
        defaultValue: "Y",
      },
      is_admin_only: {
        type: Sequelize.ENUM("Y", "N"),
        defaultValue: "N",
      },
      page_size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("mst_table_columns");
  },
};
