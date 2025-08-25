
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_students', {
      mst_student_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_category_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_categories', key: 'mst_category_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_gender_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_genders', key: 'mst_gender_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

      admission_no: { type: Sequelize.STRING(20), allowNull: false },
      password: { type: Sequelize.STRING(255), allowNull: false },   // store hash here
      name: { type: Sequelize.STRING(100), allowNull: false },
      mobile_no: { type: Sequelize.STRING(12), allowNull: true },
      dob: { type: Sequelize.DATE, allowNull: true },

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

   
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_students');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_students_is_active";');
    }
  }
};
