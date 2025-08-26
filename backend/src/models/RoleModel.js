const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoleModel = sequelize.define(
  'erp_mst_roles',
  {
    mst_role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_description: { type: DataTypes.STRING },
    is_default: {
      type: DataTypes.ENUM('Y', 'N'),
      allowNull: false,
      defaultValue: 'Y',
    },
    is_active: {
      type: DataTypes.ENUM('Y', 'N'),
      allowNull: false,
      defaultValue: 'Y',
    },
  },
  {
    timestamps: false,
    freezeTableName: true,   
    indexes: []              
  }
);

module.exports = RoleModel;
