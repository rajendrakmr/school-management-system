'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_trn_payments', {
      trn_payment_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      mst_subscriber_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_subscribers', key: 'mst_subscriber_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_plan_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_plans', key: 'mst_plan_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      payment_method: { type: Sequelize.ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'PayPal', 'Stripe', 'Cash'), allowNull: false },
      amount: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      payment_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      invoice_number: { type: Sequelize.STRING(50), allowNull: true, unique: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      payment_status: { type: Sequelize.ENUM('Pending', 'Paid', 'Failed', 'Refunded'), allowNull: false, defaultValue: 'Pending' },

      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_trn_payments');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_trn_payments_payment_method";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_trn_payments_payment_status";');
    }
  }
};
