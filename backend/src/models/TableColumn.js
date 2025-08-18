const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TableColumn = sequelize.define(
  'mst_table_columns',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    column_key: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    column_label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    column_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.ENUM('Y', 'N'),
      allowNull: false,
      defaultValue: 'Y',
    },
     is_default: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    page_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // kyunki hum created_at/updated_at handle kar rahe
  }
);

module.exports = TableColumn;
