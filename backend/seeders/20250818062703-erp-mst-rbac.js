'use strict';
const { Op } = require("sequelize");

const menuJson = [
  { name: 'Dashboard', path: '/', has_child: "N", font_icon: "faTachometerAlt", order_no: 1 },
  {
    name: 'Schools', path: '/schools', has_child: "Y", font_icon: "faChalkboard", order_no: 1, children: [
      { name: 'School Manage', path: '/schools/school-manage' },
      { name: 'School Inquiries', path: '/schools/school-inquiry' },
    ]
  },
  {
    name: "Subscription",
    path: "/subscription",
    has_child: "Y",
    font_icon: "faCreditCard",
    order_no: 2,
    children: [
      { name: "Plans", path: "/subscription/plans" },
      { name: "Subscribers", path: "/subscription/users" },
      { name: "Payments", path: "/subscription/payments" },
      { name: "Renewals", path: "/subscription/renewals" },
      { name: "Discounts / Coupons", path: "/subscription/discounts" },
      { name: "Reports", path: "/subscription/reports" },
      { name: "Settings", path: "/subscription/settings" }
    ]
  }
,


{
  name: 'Student Management', path: '/students', has_child: "Y", font_icon: "faUserGraduate", order_no: 2, children: [
    { name: 'Student List', path: '/students/list' },
    { name: 'Add Student', path: '/students/add' },
    { name: 'Edit Student', path: '/students/edit' },
    { name: 'Guardians / Parents', path: '/students/guardians' },
    { name: 'Documents', path: '/students/documents' },
    { name: 'Academic Info', path: '/students/academics' },
    { name: 'Attendance', path: '/students/attendance' },
    { name: 'Biometric Attendance', path: '/students/attendance/biometric' },
    { name: 'Reports', path: '/students/reports' },
    { name: 'Notifications', path: '/students/notifications' }
  ]
},

{ name: 'Admission Queries', path: '/admin/admission-queries', has_child: "N", font_icon: "faQuestionCircle", order_no: 3 },
{
  name: 'Transport Management', path: '/transport', has_child: "Y", font_icon: "faBus", order_no: 4, children: [
    { name: 'Routes', path: '/transport/routes' },
    { name: 'Vehicles', path: '/transport/vehicles' },
    { name: 'Route Allocation', path: '/transport/allocation' },
    { name: 'Attendance', path: '/transport/attendance' },
    { name: 'Biometric Attendance', path: '/transport/attendance/biometric' },
    { name: 'Fuel & Maintenance', path: '/transport/maintenance' },
    { name: 'Notifications', path: '/transport/notifications' }
  ]
},
{
  name: 'Hostel Management', path: '/hostel', has_child: "Y", font_icon: "faBuilding", order_no: 5, children: [
    { name: 'Hostels', path: '/hostel/hostels' },
    { name: 'Rooms', path: '/hostel/rooms' },
    { name: 'Room Allocation', path: '/hostel/allocation' },
    { name: 'Warden & Staff', path: '/hostel/staff' },
    { name: 'Attendance', path: '/hostel/attendance' },
    { name: 'Mess Management', path: '/hostel/mess' },
    { name: 'Hostel Fees', path: '/hostel/fees' },
    { name: 'Notifications', path: '/hostel/notifications' }
  ]
},
{
  name: 'Academics', path: '/academics', has_child: "Y", font_icon: "faBook", order_no: 6, children: [
    { name: 'Academic Session', path: '/academics/sessions' },
    { name: 'Medium', path: '/academics/mediums' },
    { name: 'Department', path: '/academics/departments' },
    { name: 'Class', path: '/academics/classes' },
    { name: 'Section', path: '/academics/sections' },
    { name: 'Stream', path: '/academics/streams' },
    { name: 'Subject', path: '/academics/subjects' },
    { name: 'Class Subject', path: '/academics/class-subjects' },
    { name: 'Period', path: '/academics/periods' },
    { name: 'Grade', path: '/academics/grades' },
    { name: 'Shift', path: '/academics/shifts' },
    { name: 'Semester', path: '/academics/semesters' },
    { name: 'Exam', path: '/academics/exams' },
    { name: 'Exam Subject', path: '/academics/exam-subjects' }
  ]
},
{
  name: 'Attendance', path: '/attendance', has_child: "Y", font_icon: "faCalendarCheck", order_no: 7, children: [
    { name: 'Student Attendance', path: '/attendance/students' },
    { name: 'Teacher Attendance', path: '/attendance/teachers' },
    { name: 'Staff Attendance', path: '/attendance/staff' },
    { name: 'Exam Attendance', path: '/attendance/exams' },
    { name: 'Biometric Attendance', path: '/attendance/biometric' }
  ]
},
{
  name: 'Leave Management', path: '/leave', has_child: "Y", font_icon: "faPlaneDeparture", order_no: 8, children: [
    { name: 'Leave Category', path: '/leave/category' },
    { name: 'Apply Leave', path: '/leave/apply' },
    { name: 'Leave Applications', path: '/leave/applications' }
  ]
},
{
  name: 'Account & Finance', path: '/account', has_child: "Y", font_icon: "faWallet", order_no: 9, children: [
    { name: 'Student Fees', path: '/account/student-fees' },
    { name: 'Staff Salaries', path: '/account/staff-salaries' },
    { name: 'Expenses', path: '/account/expenses' },
    { name: 'Invoices', path: '/account/invoices' },
    { name: 'Fee Reports', path: '/account/fee-reports' },
    { name: 'Financial Reports', path: '/account/financial-reports' },
    { name: 'Notifications', path: '/account/notifications' }
  ]
},
{
  name: 'Fees Management', path: '/fees', has_child: "Y", font_icon: "faCreditCard", order_no: 10, children: [
    { name: 'Fee Categories', path: '/fees/categories' },
    { name: 'Collect Fees', path: '/fees/collect' },
    { name: 'Fee Receipts', path: '/fees/receipts' },
    { name: 'Due Management', path: '/fees/dues' },
    { name: 'Discounts & Concessions', path: '/fees/discounts' },
    { name: 'Fee Reports', path: '/fees/reports' },
    { name: 'Notifications', path: '/fees/notifications' }
  ]
},
{
  name: 'Payroll Management', path: '/payroll', has_child: "Y", font_icon: "faMoneyBill", order_no: 11, children: [
    { name: 'Staff Salary', path: '/payroll/staff-salary' },
    { name: 'Allowances', path: '/payroll/allowances' },
    { name: 'Deductions', path: '/payroll/deductions' },
    { name: 'Generate Payslip', path: '/payroll/payslips' },
    { name: 'Salary Reports', path: '/payroll/reports' },
    { name: 'Notifications', path: '/payroll/notifications' }
  ]
},
{
  name: 'Library Management', path: '/library', has_child: "Y", font_icon: "faBook", order_no: 12, children: [
    { name: 'Books', path: '/library/books' },
    { name: 'Categories', path: '/library/categories' },
    { name: 'Members', path: '/library/members' },
    { name: 'Issue / Return', path: '/library/transactions' },
    { name: 'Fines', path: '/library/fines' },
    { name: 'Inventory Reports', path: '/library/reports' },
    { name: 'Notifications', path: '/library/notifications' }
  ]
},
{
  name: 'Inventory Management', path: '/inventory', has_child: "Y", font_icon: "faArchive", order_no: 13, children: [
    { name: 'Items', path: '/inventory/items' },
    { name: 'Categories', path: '/inventory/categories' },
    { name: 'Stock In', path: '/inventory/stock-in' },
    { name: 'Stock Out', path: '/inventory/stock-out' },
    { name: 'Suppliers', path: '/inventory/suppliers' },
    { name: 'Inventory Reports', path: '/inventory/reports' },
    { name: 'Notifications', path: '/inventory/notifications' }
  ]
},
{
  name: 'Announcements', path: '/announcements', has_child: "Y", font_icon: "faBullhorn", order_no: 14, children: [
    { name: 'Holidays', path: '/announcements/holidays' },
    { name: 'Events', path: '/announcements/events' },
    { name: 'Notices', path: '/announcements/notices' },
    { name: 'Notifications', path: '/announcements/notifications' }
  ]
},
{
  name: 'Reports', path: '/reports', has_child: "Y", font_icon: "faChartLine", order_no: 15, children: [
    { name: 'Student Reports', path: '/reports/students' },
    { name: 'Fees Reports', path: '/reports/fees' },
    { name: 'Payroll Reports', path: '/reports/payroll' },
    { name: 'Inventory Reports', path: '/reports/inventory' },
    { name: 'Library Reports', path: '/reports/library' },
    { name: 'Transport Reports', path: '/reports/transport' },
    { name: 'Hostel Reports', path: '/reports/hostel' },
    { name: 'Custom Reports', path: '/reports/custom' },
    { name: 'Notifications', path: '/reports/notifications' }
  ]
},
{
  name: 'Admin', path: '/admin', has_child: "Y", font_icon: "faCogs", order_no: 16, children: [
    { name: 'Visitor Book', path: '/admin/visitors' },
    { name: 'Complaints', path: '/admin/complaints' },
    { name: 'Postal Receive', path: '/admin/postal-receive' },
    { name: 'Postal Dispatch', path: '/admin/postal-dispatch' },
    { name: 'Phone Call Log', path: '/admin/phone-calls' },
    { name: 'Admin Setup', path: '/admin/setup' },
    { name: 'ID Cards', path: '/admin/id-cards' },
    { name: 'Generate ID Card', path: '/admin/id-cards/generate' },
    { name: 'Certificates', path: '/admin/certificates' },
    { name: 'Generate Certificate', path: '/admin/certificates/generate' }
  ]
},
{
  name: 'Access Control', path: '/access-control', has_child: "Y", font_icon: "faLock", order_no: 17, children: [
    { name: 'Roles', path: '/access-control/roles' },
    { name: 'Permissions', path: '/access-control/permissions' },
    { name: 'Role Permissions', path: '/access-control/role-permissions' },
    { name: 'Access Policies', path: '/access-control/policies' }
  ]
}
];

/**
 * Utility function to get permissions
 */
function getAllPermissions(menuNames) {
  let menusToCheck;
  if (menuNames.includes("*")) {
    menusToCheck = menuJson; // all menus
  } else {
    menusToCheck = menuJson.filter(m => menuNames.includes(m.name));
  }

  return menusToCheck.flatMap(menu =>
    menu.has_child === "Y"
      ? menu.children.map(c => c.name)
      : [menu.name]
  );
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert modules
    const modulesToInsert = menuJson.map(menu => ({
      module_name: menu.name,
      has_child: menu.has_child,
      font_icon: menu.font_icon || "",
      order_no: menu.order_no,
      is_active: 'Y',
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('erp_mst_modules', modulesToInsert, { ignoreDuplicates: true });

    // Fetch inserted module IDs
    const modules = await queryInterface.sequelize.query(
      `SELECT mst_module_id, module_name FROM erp_mst_modules`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Insert child permissions
    const permissions = [];
    menuJson.forEach(menu => {
      const module = modules.find(m => m.module_name.toLowerCase() === menu.name.toLowerCase());
      if (!module) return;

      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((child, index) => {
          permissions.push({
            order_no: index + 1,
            mst_module_id: module.mst_module_id,
            permission_name: `${child.name}`,
            path_url: child.path,
            is_active: 'Y',
            created_at: new Date(),
            updated_at: new Date()
          });
        });
      } else {
        permissions.push({
          order_no: menu.order_no,
          mst_module_id: module.mst_module_id,
          permission_name: `${menu.name}`,
          path_url: menu.path,
          is_active: 'Y',
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    });

    if (permissions.length > 0) {
      await queryInterface.bulkInsert('erp_mst_permissions', permissions, { ignoreDuplicates: true });
    }

    // Assign permissions to roles
    const allPermissions = await queryInterface.sequelize.query(
      `SELECT mst_permission_id, permission_name FROM erp_mst_permissions`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const permMap = {};
    allPermissions.forEach(p => permMap[p.permission_name] = p.mst_permission_id);

    const rolePermissions = [
      { mst_role_id: 1, permissionNames: getAllPermissions(["*"]) }, // Super Admin: all
      { mst_role_id: 4, permissionNames: getAllPermissions(["Academics"]) } // Admin limited
    ];

    const timestampedRolePermissions = [];
    rolePermissions.forEach(rp => {
      rp.permissionNames.forEach(name => {
        if (permMap[name]) {
          timestampedRolePermissions.push({
            mst_role_id: rp.mst_role_id,
            mst_permission_id: permMap[name],
            can_view: "Y",
            can_edit: "Y",
            can_delete: "Y",
            can_update: "Y",
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      });
    });

    if (timestampedRolePermissions.length > 0) {
      await queryInterface.bulkInsert('erp_mst_role_has_permissions', timestampedRolePermissions, { ignoreDuplicates: true });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('erp_mst_role_has_permissions', null, {});

    const permissionNames = [];
    menuJson.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => permissionNames.push(`${child.name}`));
      } else {
        permissionNames.push(`${menu.name}`);
      }
    });

    await queryInterface.bulkDelete('erp_mst_permissions', {
      permission_name: { [Op.in]: permissionNames }
    }, {});

    const moduleNames = menuJson.map(menu => menu.name);
    await queryInterface.bulkDelete('erp_mst_modules', {
      module_name: { [Op.in]: moduleNames }
    }, {});
  }
};
