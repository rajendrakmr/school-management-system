'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_discounts', {
      mst_discount_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING(20), allowNull: false, unique: true }, // coupon code
      name: { type: Sequelize.STRING(100), allowNull: false },
      discount_type: { type: Sequelize.ENUM('Flat', 'Percentage'), allowNull: false },
      discount_value: { type: Sequelize.DECIMAL(10,2), allowNull: false }, 
      applicable_plans: { type: Sequelize.JSON, allowNull: true }, 
      start_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      end_date: { type: Sequelize.DATE, allowNull: true },
      usage_limit: { type: Sequelize.INTEGER, allowNull: true },  
      is_active: { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' }, 
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_discounts');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_discounts_discount_type";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_discounts_is_active";');
    }
  }
};
