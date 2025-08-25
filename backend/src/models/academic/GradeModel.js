const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SchoolModel = require('../SchoolModel');
const User = require('../User');

const GradeModel = sequelize.define(
    'GradeModel',
    {
        mst_grade_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        name: { type: DataTypes.STRING(50), allowNull: false },
        min_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },   // e.g. 33.00
        max_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },   // e.g. 100.00


        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y', },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: SchoolModel, key: 'trn_school_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_grades',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);


GradeModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
GradeModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
GradeModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = GradeModel;
