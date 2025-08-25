const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SchoolModel = require('../SchoolModel');
const User = require('../User');
const SessionModel = require('./SessionModel');
const MediumModel = require('./MediumModel');
const ShiftModel = require('./ShiftModel');
const ClassSectionModel = require('./ClassSectionModel');
const ClassSubjectModel = require('./ClassSubject');

const ClassModel = sequelize.define(
    'ClassModel',
    {
        mst_class_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_session_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_medium_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_mediums', key: 'mst_medium_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_shift_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_shift_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

        name: { type: DataTypes.STRING(50), allowNull: false },
        code: { type: DataTypes.STRING(10), allowNull: true },
        order_no: { type: DataTypes.INTEGER, allowNull: true },

        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_classes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);
ClassModel.hasMany(ClassSubjectModel, {
  foreignKey: 'mst_class_id', 
});

ClassModel.belongsTo(MediumModel, { as: 'medium', foreignKey: 'mst_medium_id' });
ClassModel.belongsTo(ShiftModel, { as: 'shift', foreignKey: 'mst_shift_id' });
ClassModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
ClassModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
ClassModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
ClassModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = ClassModel;
