const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SchoolModel = require('../SchoolModel');
const User = require('../UserModel');
const SessionModel = require('./SessionModel');

const ShiftModel = sequelize.define(
    'ShiftModel',
    {
        mst_shift_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        name: { type: DataTypes.STRING(50), allowNull: false },
        start_time: { type: DataTypes.TIME, allowNull: true },
        end_time: { type: DataTypes.TIME, allowNull: true }, 
        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y', },
        mst_session_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: SessionModel, key: 'mst_session_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: SchoolModel, key: 'trn_school_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_shifts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);

ShiftModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
ShiftModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
ShiftModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
ShiftModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = ShiftModel;
