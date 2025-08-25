'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_trn_schools', {
      trn_school_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      principal_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      school_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      school_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      established_year: {
        type: Sequelize.INTEGER, // YEAR type is not directly supported, use INTEGER or STRING
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      image_path: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_active: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: false,
        defaultValue: 'Y'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_trn_schools');
  }
};
