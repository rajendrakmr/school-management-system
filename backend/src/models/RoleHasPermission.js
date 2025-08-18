const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./Role');
const Permission = require('./Permission');

const RoleHasPermission = sequelize.define(
  'erp_mst_role_has_permissions',
  {
    mst_role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,  // <-- composite PK
      references: { model: Role, key: 'mst_role_id' }
    },
    mst_permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,  // <-- composite PK
      references: { model: Permission, key: 'mst_permission_id' }
    }
  },
  {
    timestamps: false,
    freezeTableName: true,  // prevents Sequelize from pluralizing
    // DO NOT let Sequelize auto-add `id`
  }
);

module.exports = RoleHasPermission;
