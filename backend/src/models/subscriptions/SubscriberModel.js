const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const UserModel = require('../UserModel');
const PlanModel = require('./PlanModel');
const SchoolModel = require('../SchoolModel');
const formatDMY = (date) => {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

const parseDMY = (value) => {
    if (!value) return null;
    const [day, month, year] = value.split("/").map(Number);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};
const SubscriberModel = sequelize.define(
    'SubscriberModel',
    {
        mst_subscriber_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        admin_name: { type: DataTypes.STRING(50), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        organization_name: { type: DataTypes.STRING(100), allowNull: true },
        phone_no: { type: DataTypes.STRING(15), allowNull: true },
        // subscription_start: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        // subscription_end: { type: DataTypes.DATE, allowNull: true },
        subscription_start: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('subscription_start');
                return formatDMY(rawValue); // return dd/MM/yyyy
            },
            set(value) {
                this.setDataValue('subscription_start', parseDMY(value)); // accept dd/MM/yyyy
            }
        },

        subscription_end: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('subscription_end');
                return formatDMY(rawValue);
            },
            set(value) {
                this.setDataValue('subscription_end', parseDMY(value));
            }
        },
        is_active: { type: DataTypes.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: SchoolModel, key: 'trn_school_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        mst_plan_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: PlanModel, key: 'mst_plan_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: UserModel, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_subscribers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);

SubscriberModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
SubscriberModel.belongsTo(PlanModel, { as: 'Plan', foreignKey: 'mst_plan_id' });
SubscriberModel.belongsTo(UserModel, { as: 'CreatedBy', foreignKey: 'created_by' });
SubscriberModel.belongsTo(UserModel, { as: 'UpdatedBy', foreignKey: 'updated_by' });
module.exports = SubscriberModel;
