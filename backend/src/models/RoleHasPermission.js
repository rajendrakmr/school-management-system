const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class RoleHasPermission extends Model {}

RoleHasPermission.init({
  mst_role_id: { type: DataTypes.INTEGER, primaryKey: true },
  mst_permission_id: { type: DataTypes.INTEGER, primaryKey: true },
  can_view: { type: DataTypes.ENUM('Y','N'), defaultValue: 'N' },
  can_create: { type: DataTypes.ENUM('Y','N'), defaultValue: 'N' },
  can_update: { type: DataTypes.ENUM('Y','N'), defaultValue: 'N' },
  can_delete: { type: DataTypes.ENUM('Y','N'), defaultValue: 'N' },
  can_edit: { type: DataTypes.ENUM('Y','N'), defaultValue: 'N' }
}, {
  sequelize,
  tableName: 'erp_mst_role_has_permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  id: false
});

module.exports = RoleHasPermission;
