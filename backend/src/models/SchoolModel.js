const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your db config
const User = require('./User'); // make sure SchoolModel model exists

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
    is_active: { type: DataTypes.STRING, defaultValue: 'Y' },
}, {
    tableName: 'erp_trn_schools',
    timestamps: false
});
// SchoolModel.hasMany(User, { foreignKey: 'trn_school_id', as: 'users' });

module.exports = SchoolModel;
