const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const UserModel = require('../UserModel');

const DiscountModel = sequelize.define(
    'DiscountModel',
    {
        mst_discount_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        code: { type: DataTypes.STRING(20), allowNull: false, unique: true }, // coupon code
        name: { type: DataTypes.STRING(100), allowNull: false },
        discount_type: { type: DataTypes.ENUM('Flat', 'Percentage'), allowNull: false },
        discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        applicable_plans: { type: DataTypes.JSON, allowNull: true },
        start_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.literal('CURRENT_TIMESTAMP') },
        end_date: { type: DataTypes.DATE, allowNull: true },
        usage_limit: { type: DataTypes.INTEGER, allowNull: true },
        is_active: { type: DataTypes.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_discounts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);

module.exports = DiscountModel;
