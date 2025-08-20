const Module = require('./Module');
const Permission = require('./Permission');

// Associations
Module.hasMany(Permission, { foreignKey: 'mst_module_id', as: 'permissions' });
Permission.belongsTo(Module, { foreignKey: 'mst_module_id', as: 'module' });



module.exports = { Module, Permission };
