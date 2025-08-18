const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('erp_trn_users', {
  trn_user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});


module.exports = User;
