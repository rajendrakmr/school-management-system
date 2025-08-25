'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('trn_student_promotions', {
      trn_promotion_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      student_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_students', key: 'mst_student_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      from_session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      to_session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      from_class_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      to_class_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      promoted_on: { type: Sequelize.DATEONLY, allowNull: true },

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // await queryInterface.addConstraint('trn_student_promotions', {
    //   fields: ['student_id', 'from_session_id', 'to_session_id'],
    //   type: 'unique',
    //   name: 'unique_student_promotion'
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('trn_student_promotions');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_trn_student_promotions_is_active";');
    }
  }
};
