"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = [
      { key_type: "policies", column_key: "first_name", column_label: "Name" },
      { key_type: "policies", column_key: "email", column_label: "Email" },
      { key_type: "policies", column_key: "role_names", column_label: "Roles" },
      { key_type: "policies", column_key: "is_active", column_label: "Status" ,is_active:"N"},
      { key_type: "policies", column_key: "action", column_label: "Action" },
      { key_type: "policies", column_key: "page_size", column_label: "Page Size" },



      { key_type: "mediums", column_key: "name", column_label: "Name" },
      { key_type: "mediums", column_key: "code", column_label: "Code",is_active:"N"},
      { key_type: "mediums", column_key: "is_active", column_label: "Status" },
      { key_type: "mediums", column_key: "action", column_label: "Action" },
      { key_type: "mediums", column_key: "page_size", column_label: "Page Size" },

      { key_type: "subjects", column_key: "name", column_label: "Name" },
      { key_type: "subjects", column_key: "code", column_label: "Subject Code" },
      { key_type: "subjects", column_key: "medium_name", column_label: "Medium" },
      { key_type: "subjects", column_key: "type", column_label: "Type" },
      { key_type: "subjects", column_key: "image_path", column_label: "Image" },
      { key_type: "subjects", column_key: "is_active", column_label: "Status" },
      { key_type: "subjects", column_key: "action", column_label: "Action" },
      { key_type: "subjects", column_key: "page_size", column_label: "Page Size" },

      { key_type: "semesters", column_key: "name", column_label: "Name" },
      { key_type: "semesters", column_key: "start_month", column_label: "Start Month" },
      { key_type: "semesters", column_key: "end_month", column_label: "End Month" },
      { key_type: "semesters", column_key: "is_active", column_label: "Status" },
      { key_type: "semesters", column_key: "action", column_label: "Action" },
      { key_type: "semesters", column_key: "page_size", column_label: "Page Size" },

      { key_type: "streams", column_key: "name", column_label: "Name" },
      { key_type: "streams", column_key: "code", column_label: "Code" ,is_active:"N"},
      { key_type: "streams", column_key: "is_active", column_label: "Status" },
      { key_type: "streams", column_key: "action", column_label: "Action" },
      { key_type: "streams", column_key: "page_size", column_label: "Page Size" },

      { key_type: "sections", column_key: "name", column_label: "Name" },
      { key_type: "sections", column_key: "is_active", column_label: "Status" },
      { key_type: "sections", column_key: "action", column_label: "Action" },
      { key_type: "sections", column_key: "page_size", column_label: "Page Size" },

      { key_type: "shifts", column_key: "name", column_label: "Name" },
      { key_type: "shifts", column_key: "from_time", column_label: "Start Time" },
      { key_type: "shifts", column_key: "to_time", column_label: "End Time" },
      { key_type: "shifts", column_key: "is_active", column_label: "Status" },
      { key_type: "shifts", column_key: "action", column_label: "Action" },
      { key_type: "shifts", column_key: "page_size", column_label: "Page Size" },


      { key_type: "classes", column_key: "name", column_label: "Name" },
      { key_type: "classes", column_key: "medium", column_label: "Medium" },
      { key_type: "classes", column_key: "stream", column_label: "Stream" },
      { key_type: "classes", column_key: "shift", column_label: "Shift" ,is_active:"N"},
      { key_type: "classes", column_key: "section", column_label: "Section",is_active:"N"},
      { key_type: "classes", column_key: "semester", column_label: "Section",is_active:"N"},
      { key_type: "classes", column_key: "action", column_label: "Action" },
      { key_type: "classes", column_key: "page_size", column_label: "Page Size" },



      { key_type: "rolehas", column_key: "role_name", column_label: "Role Name" },
      { key_type: "rolehas", column_key: "permissions", column_label: "Permissions" },
      { key_type: "rolehas", column_key: "action", column_label: "Action" },
      { key_type: "rolehas", column_key: "page_size", column_label: "Page Size" },

      { key_type: "roles", column_key: "role_name", column_label: "Role Name" },
      { key_type: "roles", column_key: "role_description", column_label: "Description" },
      { key_type: "roles", column_key: "is_default", column_label: "Default" },
      { key_type: "roles", column_key: "is_active", column_label: "Status" },
      { key_type: "roles", column_key: "action", column_label: "Action" },
      { key_type: "roles", column_key: "page_size", column_label: "Page Size" },

      { key_type: "permissions", column_key: "module_name", column_label: "Module" },
      { key_type: "permissions", column_key: "permission_name", column_label: "Name" },
      { key_type: "permissions", column_key: "permission_description", column_label: "Description" ,is_active:"N"},
      { key_type: "permissions", column_key: "path_url", column_label: "Url" },
      { key_type: "permissions", column_key: "is_active", column_label: "Status" },
      { key_type: "permissions", column_key: "action", column_label: "Action" },
      { key_type: "permissions", column_key: "page_size", column_label: "Page Size" },

      { key_type: "schools", column_key: "image_path", column_label: "Logo" },
      { key_type: "schools", column_key: "school_name", column_label: "School Name" },
      { key_type: "schools", column_key: "school_code", column_label: "School Code" },
      { key_type: "schools", column_key: "principal_name", column_label: "Principal Name",is_active:"N"},
      { key_type: "schools", column_key: "phone", column_label: "Phone No",is_active:"N"},
      { key_type: "schools", column_key: "email", column_label: "Email ID",is_active:"N"},
      { key_type: "schools", column_key: "type", column_label: "School Type"},
      { key_type: "schools", column_key: "established_year", column_label: "Established Year" ,is_active:"N"},
      { key_type: "schools", column_key: "state", column_label: "State" ,is_active:"N"},
      { key_type: "schools", column_key: "City", column_label: "City",is_active:"N"},
      { key_type: "schools", column_key: "country", column_label: "Country" ,is_active:"N"},
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
      is_active: col?.is_active ? col.is_active : "Y",
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
