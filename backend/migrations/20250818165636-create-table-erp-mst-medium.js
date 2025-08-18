'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_medium', {
      mst_medium_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      trn_school_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'erp_trn_schools',
          key: 'trn_school_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_default: {
        type: Sequelize.ENUM('Y', 'N'),
        defaultValue: 'N'
      },
      is_active: {
        type: Sequelize.ENUM('Y', 'N'),
        defaultValue: 'Y'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_medium');
  }
};
