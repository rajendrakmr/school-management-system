'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_subscribers', {
      mst_subscriber_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      admin_name: { type: Sequelize.STRING(50), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      organization_name: { type: Sequelize.STRING(100), allowNull: true },
      phone_no: { type: Sequelize.STRING(15), allowNull: true },
      subscription_start: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      subscription_end: { type: Sequelize.DATE, allowNull: true },
      is_active: { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' },

      mst_plan_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_mst_plans', key: 'mst_plan_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_subscribers');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_subscribers_is_active";');
    }
  }
};
