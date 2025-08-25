'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_shifts', {
      mst_shift_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      
      name: { type: Sequelize.STRING(50), allowNull: false }, 
      start_time: { type: Sequelize.TIME, allowNull: true },   // e.g. "09:00:00"
      end_time: { type: Sequelize.TIME, allowNull: true },     // e.g. "12:30:00"

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_shifts');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_shifts_is_active";');
    }
  }
};
