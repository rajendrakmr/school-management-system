const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SchoolModel = require('../SchoolModel');
const User = require('../UserModel');
const SessionModel = require('./SessionModel');
 
const SectionModel = sequelize.define(
    'SectionModel',
    {
        mst_section_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_session_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        name: { type: DataTypes.STRING(50), allowNull: false },
        code: { type: DataTypes.STRING(10), allowNull: true },
        capacity: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },


        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_sections',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);

// SectionModel.hasMany(ClassSectionModel, { foreignKey: 'mst_section_id', as: 'classSections' });


SectionModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
SectionModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
SectionModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
SectionModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = SectionModel;
