'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('erp_mst_modules', [
      {module_name: 'Dashboard',description: 'Manage users and profiles',has_child: 'N',is_active: 'Y'},
      {module_name: 'Access Management',description: 'Manage permissions and roles',has_child: 'Y',is_active: 'Y'},
      {module_name: 'Schools',description: 'View and generate reports',has_child: 'N',is_active: 'Y'},
       {module_name: 'Academics',description: 'View and generate reports',has_child: 'N',is_active: 'Y'}
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('erp_mst_modules', null, {});
  }
};
