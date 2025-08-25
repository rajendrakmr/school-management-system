const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const School = require('../School');
const User = require('../User');

const formatDMY = (date) => {
  if (!date) return null;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const parseDMY = (value) => {
  if (!value) return null;
  const [day, month, year] = value.split("/").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const SessionModel = sequelize.define(
  'Session',
  {
    mst_session_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    code: { type: DataTypes.STRING(10), allowNull: true },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('start_date');
        return formatDMY(rawValue); // return dd/MM/yyyy
      },
      set(value) {
        this.setDataValue('start_date', parseDMY(value)); // accept dd/MM/yyyy
      }
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('end_date');
        return formatDMY(rawValue);
      },
      set(value) {
        this.setDataValue('end_date', parseDMY(value));
      }
    },

    is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
    trn_school_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: School, key: 'trn_school_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: User, key: 'trn_user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: User, key: 'trn_user_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'erp_mst_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

SessionModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
SessionModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
SessionModel.belongsTo(School, { as: 'branch', foreignKey: 'trn_school_id' });

module.exports = SessionModel;
