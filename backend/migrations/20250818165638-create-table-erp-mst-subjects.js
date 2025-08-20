'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_subjects', {
      mst_subject_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      mst_medium_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'erp_mst_mediums',
          key: 'mst_medium_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      trn_school_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'erp_trn_schools',
          key: 'trn_school_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      image_path: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('theory', 'practical'),
        defaultValue: 'theory'
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
    await queryInterface.dropTable('erp_mst_subjects');
  }
};
