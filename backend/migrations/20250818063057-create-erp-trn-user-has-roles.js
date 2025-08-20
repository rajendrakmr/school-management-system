'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('erp_trn_user_has_roles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      trn_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'erp_trn_users',
          key: 'trn_user_id'
        },
        onDelete: 'CASCADE'
      },
      mst_role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'erp_mst_roles',
          key: 'mst_role_id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Agar chaho, unique constraint add kar sakte ho specific combination ke liye
    // await queryInterface.addConstraint('erp_trn_user_has_roles', {
    //   fields: ['trn_user_id', 'mst_role_id'],
    //   type: 'unique',
    //   name: 'uniq_user_role'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('erp_trn_user_has_roles');
  }
};
