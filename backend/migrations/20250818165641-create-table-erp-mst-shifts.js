'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_shifts', {
      mst_shift_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      }, 
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      from_time: { 
        type: Sequelize.TIME,
        allowNull: true
      },
      to_time: {  
        type: Sequelize.TIME,
        allowNull: true
      },
      is_active: {
        type: Sequelize.ENUM('Y', 'N'),
        defaultValue: 'Y'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'erp_trn_users',
          key: 'trn_user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'erp_trn_users',
          key: 'trn_user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('erp_mst_shifts');
  }
};
