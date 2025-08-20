const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const School = require('./School');

const User = sequelize.define('erp_trn_users', {
  trn_user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trn_school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: School,
            key: 'trn_school_id'
        }, 
        onDelete: 'CASCADE'
    },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.STRING, defaultValue: 'Y' }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});


 // add this

User.belongsTo(School, { foreignKey: 'trn_user_id', as: 'school' });


module.exports = User;
