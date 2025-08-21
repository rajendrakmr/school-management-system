'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('erp_mst_permissions', {
      mst_permission_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mst_module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'erp_mst_modules', // reference table
          key: 'mst_module_id',      // reference column
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // ya 'CASCADE', apne requirement ke hisab se
      },
      permission_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      order_no: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      path_url: {
        type: Sequelize.STRING(30),
        allowNull: true,
        unique: true,
      },
      is_active: {
        type: Sequelize.ENUM('Y', 'N'),
        defaultValue: 'Y',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('erp_mst_permissions');
  },
};
