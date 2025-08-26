const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  
const SchoolModel = sequelize.define('SchoolModel', {
    trn_school_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    school_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    principal_name: { type: DataTypes.STRING, allowNull: true },
    school_code: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    established_year: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: true },
    image_path: { type: DataTypes.STRING, allowNull: true },
    is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true},
        updated_by: { type: DataTypes.INTEGER, allowNull: true},
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_trn_schools',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    })
 
module.exports = SchoolModel;
