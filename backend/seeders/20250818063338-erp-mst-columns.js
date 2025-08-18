"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = [
      { key_type: "medium", column_key: "name", column_label: "Name" },
      { key_type: "medium", column_key: "code", column_label: "Code" },
      { key_type: "medium", column_key: "is_active", column_label: "Status" },
      { key_type: "medium", column_key: "action", column_label: "Action" },
      { key_type: "medium", column_key: "page_size", column_label: "Page Size" },

      { key_type: "rolehas", column_key: "role_name", column_label: "Role Name" },
      { key_type: "rolehas", column_key: "permissions", column_label: "Permissions" },
      { key_type: "rolehas", column_key: "action", column_label: "Action" },
      { key_type: "rolehas", column_key: "page_size", column_label: "Page Size" },

      { key_type: "roles", column_key: "role_name", column_label: "Role Name" },
      { key_type: "roles", column_key: "role_description", column_label: "Description" },
      { key_type: "roles", column_key: "is_active", column_label: "Status" },
      { key_type: "roles", column_key: "action", column_label: "Action" },
      { key_type: "roles", column_key: "page_size", column_label: "Page Size" },

      { key_type: "permissions", column_key: "module_name", column_label: "Module" },
      { key_type: "permissions", column_key: "permission_name", column_label: "Name" },
      { key_type: "permissions", column_key: "permission_description", column_label: "Description" },
      { key_type: "permissions", column_key: "path_url", column_label: "Url" },
      { key_type: "permissions", column_key: "is_active", column_label: "Status" },
      { key_type: "permissions", column_key: "action", column_label: "Action" },
      { key_type: "permissions", column_key: "page_size", column_label: "Page Size" },

      { key_type: "schools", column_key: "image_path", column_label: "Logo" },
      { key_type: "schools", column_key: "name", column_label: "School Name" },
      { key_type: "schools", column_key: "code", column_label: "School Code" },
      { key_type: "schools", column_key: "principal_name", column_label: "Principal Name" },
      { key_type: "schools", column_key: "phone", column_label: "Phone No" },
      { key_type: "schools", column_key: "email", column_label: "Email ID" },
      { key_type: "schools", column_key: "type", column_label: "School Type" },
      { key_type: "schools", column_key: "established_year", column_label: "Established Year" },
      { key_type: "schools", column_key: "state", column_label: "State" },
      { key_type: "schools", column_key: "City", column_label: "City" },
      { key_type: "schools", column_key: "country", column_label: "Country" },
      { key_type: "schools", column_key: "is_active", column_label: "Status" },
      { key_type: "schools", column_key: "action", column_label: "Action" },
      { key_type: "schools", column_key: "page_size", column_label: "Page Size" },


      { key_type: "schools-inquiry", column_key: "school_name", column_label: "School Name" },
      { key_type: "schools-inquiry", column_key: "school_email", column_label: "School Email" },
      { key_type: "schools-inquiry", column_key: "inquiry_date", column_label: "Date" },
      { key_type: "schools-inquiry", column_key: "is_active", column_label: "Application Status" },
      { key_type: "schools-inquiry", column_key: "action", column_label: "Action" },
      { key_type: "schools-inquiry", column_key: "page_size", column_label: "Page Size" },
    ];

    // Existing columns fetch
    const existingColumns = await queryInterface.sequelize.query(
      `SELECT key_type, column_key FROM mst_table_columns`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Filter only new columns
    const newColumns = columns.filter(
      (col) =>
        !existingColumns.some(
          (exist) =>
            exist.key_type === col.key_type && exist.column_key === col.column_key
        )
    );

    // Add timestamps and default page_size
    const timestampedColumns = newColumns.map((col, index) => ({
      ...col,
      column_order: index + 1,
      is_active: "Y",
      is_default: 1,
      page_size: 10,
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (timestampedColumns.length > 0) {
      await queryInterface.bulkInsert("mst_table_columns", timestampedColumns);
    }
  },

  async down(queryInterface, Sequelize) {
    const keysToDelete = [
      "roles", "permissions", "schools"
    ];
    await queryInterface.bulkDelete("mst_table_columns", {
      key_type: keysToDelete
    }, {});
  },
};
