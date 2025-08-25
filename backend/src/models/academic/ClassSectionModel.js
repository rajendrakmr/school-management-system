const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 
 
const ClassSectionModel = sequelize.define(
    'ClassSectionModel',
    {
        mst_class_section_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        trn_school_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_schools', key: 'trn_school_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_section_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_sections', key: 'mst_section_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        mst_class_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'erp_mst_classes', key: 'mst_class_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        

        is_active: { type: DataTypes.ENUM('Y', 'N'), defaultValue: 'Y' },
        created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        updated_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'erp_trn_users', key: 'trn_user_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        tableName: 'erp_mst_class_sections',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
    }
);

// Class.hasMany(ClassSection, {
//   foreignKey: 'mst_class_id',
//   as: 'classSections'
// });


// ClassSectionModel.belongsTo(ClassModel, { foreignKey: 'mst_class_id' });
// ClassSectionModel.belongsTo(ClassModel, { foreignKey: 'mst_class_id', as: 'class' });

// ClassSectionModel.belongsTo(SectionModel, { foreignKey: 'mst_section_id', as: 'section' });
 

// Section.hasMany(ClassSection, {
//   foreignKey: 'mst_section_id',
//   as: 'classSections'
// });

// ClassSectionModel.belongsTo(MediumModel, { as: 'medium', foreignKey: 'mst_medium_id' });
// ClassSectionModel.belongsTo(ShiftModel, { as: 'shift', foreignKey: 'mst_shift_id' });
// ClassSectionModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
// ClassSectionModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
// ClassSectionModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
// ClassSectionModel.belongsTo(School, { as: 'branch', foreignKey: 'trn_school_id' });
module.exports = ClassSectionModel;
