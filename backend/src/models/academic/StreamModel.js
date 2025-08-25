const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SchoolModel = require('../SchoolModel');
const User = require('../User');
const SessionModel = require('./SessionModel'); 
const ClassModel = require('./ClassModel');
 
const StreamModel = sequelize.define(
    'StreamModel',
    {
        mst_stream_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_session_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_sessions', key: 'mst_session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }, 
        mst_class_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_streams', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },

        name: { type: DataTypes.STRING(50), allowNull: false },
        code: { type: DataTypes.STRING(10), allowNull: true }, 

        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_streams',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);
// StreamModel.hasMany(ClassSectionModel, {
//   foreignKey: 'mst_class_id',
//   as: 'classSection'
// });

// StreamModel.belongsTo(MediumModel, { as: 'medium', foreignKey: 'mst_medium_id' });
StreamModel.belongsTo(ClassModel, { as: 'class', foreignKey: 'mst_class_id' });
StreamModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
StreamModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
StreamModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
StreamModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = StreamModel;
