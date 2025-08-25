'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_periods', {
      mst_period_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      
      name: { type: Sequelize.STRING(50), allowNull: false }, 
      start_time: { type: Sequelize.TIME, allowNull: true },
      end_time: { type: Sequelize.TIME, allowNull: true },

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_periods');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_periods_is_active";');
    }
  }

};
