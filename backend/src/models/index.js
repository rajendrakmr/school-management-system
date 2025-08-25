const Module = require('./Module');
const Permission = require('./Permission');

// Associations
Module.hasMany(Permission, { foreignKey: 'mst_module_id', as: 'permissions' });
Permission.belongsTo(Module, { foreignKey: 'mst_module_id', as: 'module' });



 
const ClassSectionModel = require('./academic/ClassSectionModel');
const ClassModel = require('./academic/ClassModel');

 
const sequelize = require('../config/db');
const SectionModel = require('./academic/SectionModel'); 
 
ClassModel.hasMany(ClassSectionModel, { foreignKey: 'mst_class_id', as: 'ClassSectionModels' });
ClassSectionModel.belongsTo(ClassModel, { foreignKey: 'mst_class_id', as: 'class' });

SectionModel.hasMany(ClassSectionModel, { foreignKey: 'mst_section_id', as: 'ClassSectionModels' });
ClassSectionModel.belongsTo(SectionModel, { foreignKey: 'mst_section_id', as: 'section' });

// module.exports = { sequelize, ClassModel, SectionModel, ClassSectionModel };


module.exports = {  sequelize,Module, Permission, ClassModel, SectionModel, ClassSectionModel };
