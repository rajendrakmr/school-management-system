'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_plans', {
      mst_plan_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, },
      name: { type: Sequelize.STRING(50), allowNull: false, },
      code: { type: Sequelize.STRING(10), allowNull: false, },
      description: { type: Sequelize.STRING(255), allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, },
      currency: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'USD', },
      max_student: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0, },
      max_teacher: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0, },
      billing_cycle: { type: Sequelize.ENUM('monthly', 'quarterly', 'yearly'), allowNull: false, defaultValue: 'monthly', },
      feature: { type: Sequelize.STRING(255), allowNull: true, },
      is_active: { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y', },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_plans');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_plans_is_active";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_plans_billing_cycle";');
    }
  },
};
