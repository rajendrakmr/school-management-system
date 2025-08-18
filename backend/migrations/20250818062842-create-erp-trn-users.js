"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("erp_trn_users", {
      trn_user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      }, 
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    await queryInterface.dropTable("erp_trn_users");
  },
};
