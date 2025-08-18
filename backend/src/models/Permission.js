const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // aapka sequelize instance
const Module = require('./Module'); // assume aapka Module model yahan hai

const Permission = sequelize.define('Permission', {
  mst_permission_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  permission_name: {
    type: DataTypes.STRING(50),
    allowNull: false, 
  },
  permission_description: {
    type: DataTypes.STRING(255),
    allowNull: true
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
      model: Module,            // foreign key target
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

// // Optional association (Sequelize relationship)
// Module.hasMany(Permission, { foreignKey: 'mst_module_id', as: 'permissions' });
// // Permission.belongsTo(Module, { foreignKey: 'mst_module_id', as: 'module' });
// Permission.belongsTo(Module, { foreignKey: 'mst_module_id', as: 'module' });

module.exports = Permission;
