const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // aapka sequelize instance
const ModuleModel = require('./ModuleModel'); // assume aapka Module model yahan hai

const PermissionModel = sequelize.define('PermissionModel', {
  mst_permission_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  permission_name: {
    type: DataTypes.STRING(50),
    allowNull: false, 
  }, 
  path_url: {
    type: DataTypes.STRING(30),
    allowNull: true, 
  },
  is_active: {
    type: DataTypes.ENUM('Y', 'N'),
    defaultValue: 'Y'
  },
  mst_module_id: {              // ← naya column
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ModuleModel,            // foreign key target
      key: 'mst_module_id'
    },
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'erp_mst_permissions',
  timestamps: true,
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
 
module.exports = PermissionModel;
