const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./Role');
const Permission = require('./Permission');

const RoleHasPermission = sequelize.define(
  'erp_mst_role_has_permissions',
  {
    mst_role_id: {
      type: DataTypes.INTEGER,
      // primaryKey: true,  
      references: { model: Role, key: 'mst_role_id' }
    },
    mst_permission_id: {
      type: DataTypes.INTEGER,
      // primaryKey: true, 
      references: { model: Permission, key: 'mst_permission_id' }
    }
  },
  {
    timestamps: false,
    freezeTableName: true,  
  }
);

module.exports = RoleHasPermission;
