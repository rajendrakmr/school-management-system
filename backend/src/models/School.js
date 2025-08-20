const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your db config
const User = require('./User'); // make sure School model exists

const School = sequelize.define('School', {
    trn_school_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    school_name: { type: DataTypes.STRING, allowNull: false },
    school_code: { type: DataTypes.STRING, allowNull: false },  
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    established_year: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: true },
    image_path: { type: DataTypes.STRING, allowNull: true },
    is_active: { type: DataTypes.STRING, defaultValue: 'Y' },
}, {
    tableName: 'erp_trn_schools',
    timestamps: false
});

 
module.exports = School;
