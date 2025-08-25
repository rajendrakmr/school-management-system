const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SchoolModel = require('../SchoolModel');
const User = require('../User'); 

const MediumModel = sequelize.define(
    'MediumModel',
    {
        mst_medium_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        name: { type: DataTypes.STRING(50), allowNull: false, },
        code: { type: DataTypes.STRING(10), allowNull: true, },
         
        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y', },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: SchoolModel, key: 'trn_school_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_mediums',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);
 
 
MediumModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
MediumModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
MediumModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = MediumModel;
