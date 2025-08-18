const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Role = require('./Role');

const UserHasRole = sequelize.define('erp_trn_user_has_roles', {
  trn_user_id: { 
    type: DataTypes.INTEGER, 
    references: { model: User, key: 'trn_user_id' }, 
    primaryKey: true 
  },
  mst_role_id: { 
    type: DataTypes.INTEGER, 
    references: { model: Role, key: 'mst_role_id' }, 
    primaryKey: true 
  }
}, { 
  timestamps: false,
  freezeTableName: true 
});

module.exports = UserHasRole;
