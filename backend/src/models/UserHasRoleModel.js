const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./UserModel');
const Role = require('./RoleModel');

const UserHasRoleModel = sequelize.define('erp_trn_user_has_roles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  trn_user_id: { 
    type: DataTypes.INTEGER, 
    references: { model: User, key: 'trn_user_id' }
  },
  mst_role_id: { 
    type: DataTypes.INTEGER, 
    references: { model: Role, key: 'mst_role_id' }
  }
}, { 
  timestamps: false,
  freezeTableName: true
});

module.exports = UserHasRoleModel;
