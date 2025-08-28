const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const UserModel = require('../UserModel');

const PlanModel = sequelize.define(
    'PlanModel',
    {
        mst_plan_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(50), allowNull: false },
        code: { type: DataTypes.STRING(10), allowNull: false },
        description: { type: DataTypes.STRING(255), allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
        max_student: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        trial_days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        max_teacher: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
        billing_cycle: { type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'), allowNull: false, defaultValue: 'monthly' },
        feature: { type: DataTypes.STRING(255), allowNull: true },
        is_active: { type: DataTypes.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_plans',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);
PlanModel.belongsTo(UserModel, { as: 'CreatedBy', foreignKey: 'created_by' });
PlanModel.belongsTo(UserModel, { as: 'UpdatedBy', foreignKey: 'updated_by' });
module.exports = PlanModel;
