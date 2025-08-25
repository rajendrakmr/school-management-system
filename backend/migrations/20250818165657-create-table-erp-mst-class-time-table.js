'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_trn_class_timetables', {
      trn_class_timetable_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      mst_session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_class_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_section_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sections', key: 'mst_section_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_subject_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_subjects', key: 'mst_subject_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_period_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_periods', key: 'mst_period_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_teacher_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },



      day_of_week: {
        type: Sequelize.ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'),
        allowNull: false
      }, 
      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_trn_class_timetables');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_trn_class_timetables_day_of_week";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_trn_class_timetables_is_active";');
    }
  }
};
