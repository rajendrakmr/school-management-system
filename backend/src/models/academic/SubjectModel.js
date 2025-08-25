const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const School = require('../School');
const User = require('../User');
const DepartmentModel = require('./DepartmentModel');
const MediumModel = require('./MediumModel');

const SubjectModel = sequelize.define(
    'SubjectModel',
    {
        mst_subject_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        name: { type: DataTypes.STRING(50), allowNull: false, },
        code: { type: DataTypes.STRING(10), allowNull: true, },
        max_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 100 },
        practical_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
        theory_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }, 
        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y', },
        mst_department_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: School, key: 'mst_department_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: School, key: 'trn_school_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'trn_user_id', }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_subjects',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);


// SubjectModel.belongsTo(MediumModel, { as: 'medium', foreignKey: 'mst_medium_id' });
SubjectModel.belongsTo(DepartmentModel, { as: 'department', foreignKey: 'mst_department_id' });
SubjectModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
SubjectModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
SubjectModel.belongsTo(School, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = SubjectModel;
