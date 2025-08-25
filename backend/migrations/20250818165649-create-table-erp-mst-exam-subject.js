
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_trn_exam_subjects', {
      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_exam_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_exams', key: 'mst_exam_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_class_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_stream_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_mst_streams', key: 'mst_stream_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_subject_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_subjects', key: 'mst_subject_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },


      max_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 100 },
      passing_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 33 },

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_trn_exam_subjects');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_trn_exam_subjects_is_active";');
    }
  }
};

