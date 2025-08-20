const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // your Sequelize instance
const School = require('./School');
const Medium = require('./Medium');
const User = require('./User');

const Subject = sequelize.define('Subject', {
  mst_subject_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  mst_medium_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Medium,
      key: 'mst_medium_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('theory', 'practical'),
    defaultValue: 'theory'
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'erp_mst_subjects',
  timestamps: false,
  freezeTableName: true
});

// Optional: define associations
Subject.belongsTo(School, { foreignKey: 'trn_school_id', as: 'school' });
Subject.belongsTo(Medium, { foreignKey: 'mst_medium_id', as: 'medium' });
Subject.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = Subject;
