'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_sessions', {
      mst_session_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      name: { type: Sequelize.STRING(50), allowNull: false },
      code: { type: Sequelize.STRING(10), allowNull: true },
      start_date: { type: Sequelize.DATEONLY, allowNull: true },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_sessions');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_sessions_is_active";');
    }
  }

};
