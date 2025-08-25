const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
 
const ClassSubjectModel = sequelize.define(
    'ClassSubjectModel',
    {
        mst_class_subject_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_session_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_class_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_stream_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_mst_streams', key: 'mst_stream_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_subject_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_subjects', key: 'mst_subject_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

        name: { type: DataTypes.STRING(50), allowNull: false },
        code: { type: DataTypes.STRING(10), allowNull: true },
        is_optional: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'N' },
        max_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 100 },
        practical_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
        theory_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },


        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_class_subjects',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);
 
// ClassSubjectModel.belongsTo(SubjectModel, { as: 'subject', foreignKey: 'mst_subject_id' });
// ClassSubjectModel.belongsTo(ClassModel, { as: 'class', foreignKey: 'mst_class_id' });
// ClassSubjectModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
// ClassSubjectModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
// ClassSubjectModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
// ClassSubjectModel.belongsTo(School, { as: 'branch', foreignKey: 'trn_school_id' }); 
module.exports = ClassSubjectModel;
