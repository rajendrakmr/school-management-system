const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const School = require('../School');
const User = require('../User');

const PeriodModel = sequelize.define(
    'PeriodModel',
    {
        mst_period_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        name: { type: DataTypes.STRING(50), allowNull: false },
        start_time: { type: DataTypes.TIME, allowNull: true },
        end_time: { type: DataTypes.TIME, allowNull: true }, 
        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y', },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: School, key: 'trn_school_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_periods',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);


PeriodModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
PeriodModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
PeriodModel.belongsTo(School, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = PeriodModel;
