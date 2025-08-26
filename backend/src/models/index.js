const sequelize = require('../config/db');

// Import all models without defining associations inside the model files
const User = require('./UserModel');
const SchoolModel = require('./SchoolModel');
const SubjectModel = require('./academic/SubjectModel');
const ClassModel = require('./academic/ClassModel');
const ClassSectionModel = require('./academic/ClassSectionModel');
const SectionModel = require('./academic/SectionModel');
const ClassSubjectModel = require('./academic/ClassSubject');
const SessionModel = require('./academic/SessionModel');
const Module = require('./ModuleModel');
const Permission = require('./PermissionModel');

// ----------------- Define Associations -----------------

// Module & Permission
Module.hasMany(Permission, { foreignKey: 'mst_module_id', as: 'permissions' });
Permission.belongsTo(Module, { foreignKey: 'mst_module_id', as: 'module' });

// Class & ClassSection
ClassModel.hasMany(ClassSectionModel, { foreignKey: 'mst_class_id', as: 'ClassSectionModels' });
ClassSectionModel.belongsTo(ClassModel, { foreignKey: 'mst_class_id', as: 'class' });

// Section & ClassSection
SectionModel.hasMany(ClassSectionModel, { foreignKey: 'mst_section_id', as: 'ClassSectionModels' });
ClassSectionModel.belongsTo(SectionModel, { foreignKey: 'mst_section_id', as: 'section' });

// ClassSubject
ClassSubjectModel.belongsTo(SubjectModel, { as: 'subject', foreignKey: 'mst_subject_id' });
ClassSubjectModel.belongsTo(ClassModel, { as: 'class', foreignKey: 'mst_class_id' });
ClassSubjectModel.belongsTo(SessionModel, { as: 'session', foreignKey: 'mst_session_id' });
ClassSubjectModel.belongsTo(User, { as: 'CreatedBy', foreignKey: 'created_by' });
ClassSubjectModel.belongsTo(User, { as: 'UpdatedBy', foreignKey: 'updated_by' });
ClassSubjectModel.belongsTo(SchoolModel, { as: 'branch', foreignKey: 'trn_school_id' });

SchoolModel.hasMany(User, { foreignKey: 'trn_school_id', as: 'users1' });
User.belongsTo(SchoolModel, { foreignKey: 'trn_school_id', as: 'school1' });

// ----------------- Export all models and sequelize -----------------
module.exports = {
    sequelize,
    User,
    SchoolModel,
    SubjectModel,
    ClassModel,
    ClassSectionModel,
    SectionModel,
    ClassSubjectModel,
    SessionModel,
    Module,
    Permission
};
