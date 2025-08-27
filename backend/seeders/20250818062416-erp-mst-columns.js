"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = [


      { key_type: "discounts", column_key: "name", column_label: "Name", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "code", column_label: "Coupon Code", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "discount_type", column_label: "Discount Type", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "discount_value", column_label: "Discount Amount", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "plans", column_label: "Applicable Plan", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "start_date", column_label: "Start From", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "end_date", column_label: "Last Date", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "usage_limit", column_label: "Usage Limit", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "is_active", column_label: "Status", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "action", column_label: "Action", is_admin_only: "Y" },
      { key_type: "discounts", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },

      { key_type: "payments", column_key: "payment_method", column_label: "Payment Method", is_admin_only: "Y" },
      { key_type: "payments", column_key: "amount", column_label: "Amount", is_admin_only: "Y" },
      { key_type: "payments", column_key: "payment_date", column_label: "Payment Date", is_admin_only: "Y" },
      { key_type: "payments", column_key: "invoice_number", column_label: "Invoice Number", is_admin_only: "Y" },
      { key_type: "payments", column_key: "notes", column_label: "Notes", is_admin_only: "Y" },
      { key_type: "payments", column_key: "payment_status", column_label: "Payment Status", is_admin_only: "Y" },
      { key_type: "payments", column_key: "action", column_label: "Action", is_admin_only: "Y" },
      { key_type: "payments", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },

      { key_type: "subscribers", column_key: "branch", column_label: "School", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "plan", column_label: "Plan", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "admin_name", column_label: "Admin Name", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "admin_email", column_label: "Admin Email", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "subscription_start", column_label: "Subscription Start From", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "subscription_end", column_label: "Subscription End", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "payment_status", column_label: "Payment Status", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "status", column_label: "Status", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "action", column_label: "Action", is_admin_only: "Y" },
      { key_type: "subscribers", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },

      { key_type: "plans", column_key: "name", column_label: "Name", is_admin_only: "Y" },
      { key_type: "plans", column_key: "code", column_label: "Code", is_admin_only: "Y" },
      { key_type: "plans", column_key: "description", column_label: "About Plan", is_admin_only: "Y" },
      { key_type: "plans", column_key: "currency", column_label: "Currency", is_admin_only: "Y" },
      { key_type: "plans", column_key: "max_students", column_label: "Maximum Students", is_admin_only: "Y" },
      { key_type: "plans", column_key: "max_teachers", column_label: "Maximum Teachers", is_admin_only: "Y" },
      { key_type: "plans", column_key: "trial_days", column_label: "Trial Days", is_admin_only: "Y" },
      { key_type: "plans", column_key: "features", column_label: "Features", is_admin_only: "Y" },
      { key_type: "plans", column_key: "is_active", column_label: "Status", is_admin_only: "Y" },
      { key_type: "plans", column_key: "action", column_label: "Action", is_admin_only: "Y" },
      { key_type: "plans", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },

      { key_type: "sessions", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "sessions", column_key: "name", column_label: "Name" },
      { key_type: "sessions", column_key: "start_date", column_label: "From" },
      { key_type: "sessions", column_key: "end_date", column_label: "To" },
      { key_type: "sessions", column_key: "code", column_label: "Code" },
      { key_type: "sessions", column_key: "is_active", column_label: "Status" },
      { key_type: "sessions", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },
      { key_type: "sessions", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },
      { key_type: "sessions", column_key: "action", column_label: "Action" },
      { key_type: "sessions", column_key: "created_at", column_label: "Created Time", is_active: "N" },
      { key_type: "sessions", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },
      { key_type: "sessions", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },

      { key_type: "mediums", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "mediums", column_key: "name", column_label: "Name" },
      { key_type: "mediums", column_key: "code", column_label: "Code" },
      { key_type: "mediums", column_key: "is_active", column_label: "Status" },
      { key_type: "mediums", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },
      { key_type: "mediums", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },
      { key_type: "mediums", column_key: "action", column_label: "Action" },
      { key_type: "mediums", column_key: "created_at", column_label: "Created Time", is_active: "N" },
      { key_type: "mediums", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },
      { key_type: "mediums", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },



      { key_type: "departments", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "departments", column_key: "name", column_label: "Name" },
      { key_type: "departments", column_key: "code", column_label: "Code" },
      { key_type: "departments", column_key: "is_active", column_label: "Status" },
      { key_type: "departments", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },
      { key_type: "departments", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },
      { key_type: "departments", column_key: "action", column_label: "Action" },
      { key_type: "departments", column_key: "created_at", column_label: "Created Time", is_active: "N" },
      { key_type: "departments", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },
      { key_type: "departments", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },


      { key_type: "subjects", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "subjects", column_key: "max_marks", column_label: "Max Marks", is_active: "N", is_admin_only: "Y" },
      { key_type: "subjects", column_key: "theory_marks", column_label: "Theory Marks", is_active: "N", is_admin_only: "Y" },
      { key_type: "subjects", column_key: "practical_marks", column_label: "Practical Marks", is_active: "N", is_admin_only: "Y" },
      { key_type: "subjects", column_key: "department", column_label: "Department" },
      { key_type: "subjects", column_key: "name", column_label: "Name" },
      { key_type: "subjects", column_key: "code", column_label: "Code" },
      { key_type: "subjects", column_key: "is_active", column_label: "Status" },
      { key_type: "subjects", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },
      { key_type: "subjects", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },
      { key_type: "subjects", column_key: "action", column_label: "Action" },
      { key_type: "subjects", column_key: "created_at", column_label: "Created Time", is_active: "N" },
      { key_type: "subjects", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },
      { key_type: "subjects", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },

      { key_type: "periods", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "periods", column_key: "name", column_label: "Name" },
      { key_type: "periods", column_key: "start_time", column_label: "Start Time" },
      { key_type: "periods", column_key: "end_time", column_label: "End Time" },
      { key_type: "periods", column_key: "is_active", column_label: "Status" },
      { key_type: "periods", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "periods", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "periods", column_key: "action", column_label: "Action" },  //comom
      { key_type: "periods", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "periods", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "periods", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom



      { key_type: "semesters", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "semesters", column_key: "name", column_label: "Name" },
      { key_type: "semesters", column_key: "start_month", column_label: "Start Month" },
      { key_type: "semesters", column_key: "end_month", column_label: "End Month" },
      { key_type: "semesters", column_key: "is_active", column_label: "Status" },
      { key_type: "semesters", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "semesters", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "semesters", column_key: "action", column_label: "Action" },  //comom
      { key_type: "semesters", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "semesters", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "semesters", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom

      { key_type: "grades", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "grades", column_key: "name", column_label: "Name" },
      { key_type: "grades", column_key: "min_percentage", column_label: "Min Percentage" },
      { key_type: "grades", column_key: "max_percentage", column_label: "Max Percentage" },
      { key_type: "grades", column_key: "is_active", column_label: "Status" },
      { key_type: "grades", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "grades", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "grades", column_key: "action", column_label: "Action" },  //comom
      { key_type: "grades", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "grades", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "grades", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom

      { key_type: "shifts", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "shifts", column_key: "session", column_label: "Session" },
      { key_type: "shifts", column_key: "name", column_label: "Name" },
      { key_type: "shifts", column_key: "start_time", column_label: "Start Time" },
      { key_type: "shifts", column_key: "end_time", column_label: "End Time" },
      { key_type: "shifts", column_key: "is_active", column_label: "Status" },
      { key_type: "shifts", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "shifts", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "shifts", column_key: "action", column_label: "Action" },  //comom
      { key_type: "shifts", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "shifts", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "shifts", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom


      { key_type: "classes", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "classes", column_key: "session", column_label: "Session" },
      { key_type: "classes", column_key: "medium", column_label: "Medium" },
      { key_type: "classes", column_key: "shift", column_label: "Shift Time" },
      { key_type: "classes", column_key: "name", column_label: "Name" },
      { key_type: "classes", column_key: "code", column_label: "Code" },
      { key_type: "classes", column_key: "is_active", column_label: "Status" },
      { key_type: "classes", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "classes", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "classes", column_key: "action", column_label: "Action" },  //comom
      { key_type: "classes", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "classes", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "classes", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom

      { key_type: "sections", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "sections", column_key: "session", column_label: "Session" },
      { key_type: "sections", column_key: "class", column_label: "Class" },
      { key_type: "sections", column_key: "name", column_label: "Name" },
      { key_type: "sections", column_key: "code", column_label: "Code" },
      { key_type: "sections", column_key: "capacity", column_label: "Capacity" },
      { key_type: "sections", column_key: "is_active", column_label: "Status" },
      { key_type: "sections", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "sections", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "sections", column_key: "action", column_label: "Action" },  //comom
      { key_type: "sections", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "sections", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "sections", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom


      { key_type: "streams", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "streams", column_key: "session", column_label: "Session" },
      { key_type: "streams", column_key: "class", column_label: "Class" },
      { key_type: "streams", column_key: "name", column_label: "Name" },
      { key_type: "streams", column_key: "code", column_label: "Code" },
      { key_type: "streams", column_key: "is_active", column_label: "Status" },
      { key_type: "streams", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "streams", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "streams", column_key: "action", column_label: "Action" },  //comom
      { key_type: "streams", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "streams", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "streams", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom


      { key_type: "class-subjects", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "class-subjects", column_key: "session", column_label: "Session" },
      { key_type: "class-subjects", column_key: "class", column_label: "Class" },
      { key_type: "class-subjects", column_key: "subject", column_label: "Subject" },
      { key_type: "class-subjects", column_key: "stream", column_label: "Class" },
      { key_type: "class-subjects", column_key: "name", column_label: "Name" },
      { key_type: "class-subjects", column_key: "code", column_label: "Code" },
      { key_type: "class-subjects", column_key: "is_optional", column_label: "Code" },
      { key_type: "class-subjects", column_key: "max_marks", column_label: "Max Marks" },
      { key_type: "class-subjects", column_key: "practical_marks", column_label: "Practical Marks" },
      { key_type: "class-subjects", column_key: "theory_marks", column_label: "Theory Marks" },
      { key_type: "class-subjects", column_key: "is_active", column_label: "Status" },
      { key_type: "class-subjects", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "class-subjects", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "class-subjects", column_key: "action", column_label: "Action" },  //comom
      { key_type: "class-subjects", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "class-subjects", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "class-subjects", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //



      { key_type: "exams", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "exams", column_key: "session", column_label: "Session" },
      { key_type: "exams", column_key: "name", column_label: "Name" },
      { key_type: "exams", column_key: "code", column_label: "Code" },
      { key_type: "exams", column_key: "exam_type", column_label: "Exam Type" },
      { key_type: "exams", column_key: "start_date", column_label: "Exam Start Date" },
      { key_type: "exams", column_key: "end_date", column_label: "Exam End Date" },
      { key_type: "exams", column_key: "is_active", column_label: "Status" },
      { key_type: "exams", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "exams", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "exams", column_key: "action", column_label: "Action" },  //comom
      { key_type: "exams", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "exams", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "exams", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom

      { key_type: "exam-subjects", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "exam-subjects", column_key: "class", column_label: "Name" },
      { key_type: "exam-subjects", column_key: "exam", column_label: "Exam Name" },
      { key_type: "exam-subjects", column_key: "stream", column_label: "Stream" },
      { key_type: "exam-subjects", column_key: "subject", column_label: "Subject" },
      { key_type: "exam-subjects", column_key: "max_marks", column_label: "Max Marks" },
      { key_type: "exam-subjects", column_key: "passing_marks", column_label: "Passing Marks" },
      { key_type: "exam-subjects", column_key: "is_active", column_label: "Status" },
      { key_type: "exam-subjects", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "exam-subjects", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "exam-subjects", column_key: "action", column_label: "Action" },  //comom
      { key_type: "exam-subjects", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "exam-subjects", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "exam-subjects", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom


      { key_type: "category", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "category", column_key: "name", column_label: "Category Name" },
      { key_type: "category", column_key: "code", column_label: "Category Code" },
      { key_type: "category", column_key: "is_active", column_label: "Status" },
      { key_type: "category", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "category", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "category", column_key: "action", column_label: "Action" },  //comom
      { key_type: "category", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "category", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "category", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom



      { key_type: "genders", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "genders", column_key: "name", column_label: "Gender" },
      { key_type: "genders", column_key: "code", column_label: "Code" },
      { key_type: "genders", column_key: "is_active", column_label: "Status" },
      { key_type: "genders", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "genders", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "genders", column_key: "action", column_label: "Action" },  //comom
      { key_type: "genders", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "genders", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "genders", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom


      { key_type: "students", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "students", column_key: "session", column_label: "Session", is_admin_only: "Y" },
      { key_type: "students", column_key: "addmission_no", column_label: "Admission No" },
      { key_type: "students", column_key: "name", column_label: "Student Name" },
      { key_type: "students", column_key: "dob", column_label: "DOB" },
      { key_type: "students", column_key: "mobile_no", column_label: "Mobile No" },
      { key_type: "students", column_key: "category", column_label: "Category" },
      { key_type: "students", column_key: "gender", column_label: "Gender" },
      { key_type: "students", column_key: "is_active", column_label: "Status" },
      { key_type: "students", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "students", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "students", column_key: "action", column_label: "Action" },  //comom
      { key_type: "students", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "students", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "students", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom


      { key_type: "student-promotions", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "student-promotions", column_key: "session", column_label: "Session", is_admin_only: "Y" },
      { key_type: "student-promotions", column_key: "student_name", column_label: "Student Name" },
      { key_type: "student-promotions", column_key: "addmission_no", column_label: "Admission No" },
      { key_type: "student-promotions", column_key: "class", column_label: "Class" },
      { key_type: "student-promotions", column_key: "roll_no", column_label: "Roll No" },
      { key_type: "student-promotions", column_key: "is_active", column_label: "Status" },
      { key_type: "student-promotions", column_key: "created_by", column_label: "Created By", is_admin_only: "Y" },  //comom
      { key_type: "student-promotions", column_key: "updated_by", column_label: "Updated By", is_admin_only: "Y" },  //comom
      { key_type: "student-promotions", column_key: "action", column_label: "Action" },  //comom
      { key_type: "student-promotions", column_key: "created_at", column_label: "Created Time", is_active: "N" },  //comom
      { key_type: "student-promotions", column_key: "updated_at", column_label: "Updated Time", is_active: "N" },  //comom
      { key_type: "student-promotions", column_key: "page_size", column_label: "Page Size", is_admin_only: "Y" },  //comom














      { key_type: "policies", column_key: "first_name", column_label: "Name" },
      { key_type: "policies", column_key: "email", column_label: "Email" },
      { key_type: "policies", column_key: "role_names", column_label: "Roles" },
      { key_type: "policies", column_key: "is_active", column_label: "Status", is_active: "N" },
      { key_type: "policies", column_key: "action", column_label: "Action" },
      { key_type: "policies", column_key: "page_size", column_label: "Page Size" },








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
      { key_type: "permissions", column_key: "permission_description", column_label: "Description", is_active: "N" },
      { key_type: "permissions", column_key: "path_url", column_label: "Url" },
      { key_type: "permissions", column_key: "is_active", column_label: "Status" },
      { key_type: "permissions", column_key: "action", column_label: "Action" },
      { key_type: "permissions", column_key: "page_size", column_label: "Page Size" },

      { key_type: "schools", column_key: "branch", column_label: "Branch", is_active: "N", is_admin_only: "Y" },
      { key_type: "schools", column_key: "image_path", column_label: "Logo", is_active: "N", },
      { key_type: "schools", column_key: "school_name", column_label: "School Name" },
      { key_type: "schools", column_key: "school_code", column_label: "School Code" },
      { key_type: "schools", column_key: "principal_name", column_label: "Principal Name", is_active: "N" },
      { key_type: "schools", column_key: "phone", column_label: "Phone No", is_active: "N" },
      { key_type: "schools", column_key: "email", column_label: "Email ID", is_active: "N" },
      { key_type: "schools", column_key: "type", column_label: "School Type" },
      { key_type: "schools", column_key: "established_year", column_label: "Established Year", is_active: "N" },
      { key_type: "schools", column_key: "state", column_label: "State", is_active: "N" },
      { key_type: "schools", column_key: "City", column_label: "City", is_active: "N" },
      { key_type: "schools", column_key: "country", column_label: "Country", is_active: "N" },
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
      is_admin_only: col?.is_admin_only ? col.is_admin_only : "N",
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
