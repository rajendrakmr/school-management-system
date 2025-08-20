const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const School = require('./School'); // make sure School model exists
const User = require('./User');

const Medium = sequelize.define('Medium', {
  mst_medium_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  trn_school_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: School,
      key: 'trn_school_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  is_active: {
    type: DataTypes.ENUM('Y', 'N'),
    defaultValue: 'Y'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'trn_user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'trn_user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'erp_mst_mediums',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true
});

// Associations
Medium.belongsTo(School, { foreignKey: 'trn_school_id', as: 'school' });
School.hasMany(Medium, { foreignKey: 'trn_school_id', as: 'mediums' });

module.exports = Medium;
