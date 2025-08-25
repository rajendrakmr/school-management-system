'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('erp_mst_class_subjects', {
      mst_class_subject_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trn_school_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_class_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_stream_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_mst_streams', key: 'mst_stream_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      mst_subject_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'erp_mst_subjects', key: 'mst_subject_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      
      name: { type: Sequelize.STRING(50), allowNull: false }, 
      code: { type: Sequelize.STRING(10), allowNull: true },   
      is_optional: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'N' },   
      max_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 100 },
      practical_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      theory_marks: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },

      is_active: { type: Sequelize.ENUM('Y', 'N'), defaultValue: 'Y' },
      created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }, 
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('erp_mst_class_subjects');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_class_subjects_is_active";');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_erp_mst_class_subjects_is_optional";');
    }
  }
};
