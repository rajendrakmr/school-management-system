'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("erp_mst_role_has_permissions", {
      mst_role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "erp_mst_roles",
          key: "mst_role_id",
        },
        onDelete: "CASCADE",
      },
      mst_permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "erp_mst_permissions",
          key: "mst_permission_id",
        },
        onDelete: "CASCADE",
      },
      can_view: {
        type: Sequelize.ENUM('Y','N'),
        defaultValue: 'N',
        allowNull: false,
      },
      can_create: {
        type: Sequelize.ENUM('Y','N'),
        defaultValue: 'N',
        allowNull: false,
      },
      can_update: {
        type: Sequelize.ENUM('Y','N'),
        defaultValue: 'N',
        allowNull: false,
      },
      can_delete: {
        type: Sequelize.ENUM('Y','N'),
        defaultValue: 'N',
        allowNull: false,
      },
      can_edit: {
        type: Sequelize.ENUM('Y','N'),
        defaultValue: 'N',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // composite primary key
    await queryInterface.addConstraint("erp_mst_role_has_permissions", {
      fields: ["mst_role_id", "mst_permission_id"],
      type: "primary key",
      name: "pk_role_permission",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("erp_mst_role_has_permissions");
  },
};
