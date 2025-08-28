const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const UserModel = require('../UserModel');
const PlanModel = require('./PlanModel');
const SubscriberModel = require('./SubscriberModel');

const PaymentModel = sequelize.define(
    'PaymentModel',
    {
        trn_payment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        payment_method: { type: DataTypes.ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'PayPal', 'Stripe', 'Cash'), allowNull: false },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        payment_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.literal('CURRENT_TIMESTAMP') },
        invoice_number: { type: DataTypes.STRING(50), allowNull: true, unique: true },
        notes: { type: DataTypes.TEXT, allowNull: true },
        payment_status: { type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'), allowNull: false, defaultValue: 'Pending' },

        mst_subscriber_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: SubscriberModel, key: 'mst_subscriber_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        mst_plan_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: PlanModel, key: 'mst_plan_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_trn_payments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);

module.exports = PaymentModel;
