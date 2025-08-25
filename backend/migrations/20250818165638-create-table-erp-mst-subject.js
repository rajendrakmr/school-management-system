'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_subjects', {
      mst_subject_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trn_school_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_department_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_departments', key: 'mst_department_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
     
      name: { type: Sequelize.STRING(50), allowNull: false },
      code: { type: Sequelize.STRING(10), allowNull: true },
      max_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 100 },
      practical_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      theory_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      subject_type: { type: Sequelize.ENUM('core', 'elective', 'optional'), defaultValue: 'core' },
      subject_type: { type: Sequelize.ENUM('core', 'elective', 'optional'), defaultValue: 'core' },
      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_subjects');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_subjects_is_active";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_subjects_subject_type";');
    }
  }
};
