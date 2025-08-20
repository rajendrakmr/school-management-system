// import { faBuildingUser, faPlaneDeparture, faReceipt, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
// import { ReactNode } from 'react';
// import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
// interface NavItem {
//   name: string;
//   path: string;
//   icon?: IconDefinition;
//   isParent?: boolean;
//   children?: NavItem[],
// }

// const _nav: NavItem[] = [
//   {
//     name: 'Dashboard',
//     path: '/',
//     icon: faReceipt,
//     isParent:true
//   },
//   {
//     name: 'Dashboard',
//     path: '/backend',
//     icon: faReceipt,
//     isParent:true
//   },
// {
//   name: 'Leave',
//   path: '/leave',
//   icon: faPlaneDeparture,
//   children: [
//     {
//       name: 'Leave type',
//       path: '/leave/types',
//     },
//     {
//       name: 'Holidays',
//       path: '/holidays',
//     },
//     {
//       name: 'Leave Application',
//       path: '/leaves',
//     },
//   ],
// },
//   {
//     name: 'Department',
//     path: '/departmet',
//     icon: faBuildingUser,
//     children: [
//       {
//         name: 'Department',
//         path: '/department',
//       } 
//     ],
//   },
//   {
//     name: 'Employee',
//     path: '/employees',
//     icon: faUsers,
//     children: [
//       {
//         name: 'Employee',
//         path: '/employees',
//       } 
//     ],
//   },
//   // Add other navigation items here
// ];

// export default _nav;
import {
  faBuildingUser,
  faPlaneDeparture,
  faReceipt,
  faUserGraduate,
  faUsers,
  faBook,
  faBus,
  faChalkboardTeacher,
  faFileAlt,
  faUniversity,
  faMoneyBillWave,
  faCalendarAlt,
  faClipboardList,
  faCogs,
  faBell,
  faChartLine,
  faSchool,
  faBoxOpen,
  faFingerprint,
  faBank
} from '@fortawesome/free-solid-svg-icons';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavItem {
  name: string;
  path: string;
  icon?: IconDefinition;
  isParent?: boolean;
  children?: NavItem[];
}

const _nav: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: faChartLine,
    isParent: true
  },
  {
    name: 'Access Permission',
    path: '/rbac',
    icon: faFingerprint,
    children: [
      { name: 'Roles', path: '/roles' },
      { name: 'Permissions', path: '/permissions' },
      { name: 'Role Permissions', path: '/role-permissions' },
      { name: 'Access Policies', path: '/access-policies' }

    ],
  },
  {
    name: 'Schools',
    path: '/schools',
    icon: faSchool,
    children: [
      { name: 'School Details', path: '/schools' },
      { name: 'School Inquiries', path: '/schools-inquiry' },
    ],
  },
  {
    name: 'Academics',
    path: '/academics',
    icon: faBank,
    children: [
      { name: 'Medium', path: '/medium' },
      { name: 'Section', path: '/section' },
      { name: 'Subject', path: '/subject' },
      { name: 'Semester', path: '/semester' },
      { name: 'Stream', path: '/stream' },
      { name: 'Shift', path: '/shift' },
      { name: 'Class', path: '/class' },
    ],
  }


  // {
  //   name: 'Students',
  //   path: '/students',
  //   icon: faUserGraduate,
  //   children: [
  //     { name: 'Student List', path: '/students' },
  //     { name: 'Admissions', path: '/students/admissions' },
  //     { name: 'Attendance', path: '/students/attendance' },
  //     { name: 'Report Cards', path: '/students/reports' },
  //     { name: 'ID Cards', path: '/students/id-cards' },
  //   ],
  // },
  // {
  //   name: 'Leave',
  //   path: '/leave',
  //   icon: faPlaneDeparture,
  //   children: [
  //     {
  //       name: 'Leave type',
  //       path: '/leave/types',
  //     },
  //     {
  //       name: 'Holidays',
  //       path: '/holidays',
  //     },
  //     {
  //       name: 'Leave Application',
  //       path: '/leaves',
  //     },
  //   ],
  // },
  // {
  //   name: 'Teachers',
  //   path: '/teachers',
  //   icon: faChalkboardTeacher,
  //   children: [
  //     { name: 'Teacher List', path: '/teachers' },
  //     { name: 'Attendance', path: '/teachers/attendance' },
  //     { name: 'Payroll', path: '/teachers/payroll' },
  //     { name: 'Class Assignments', path: '/teachers/assignments' },
  //   ],
  // },
  // {
  //   name: 'Fees',
  //   path: '/fees',
  //   icon: faMoneyBillWave,
  //   children: [
  //     { name: 'Fee Collection', path: '/fees/collection' },
  //     { name: 'Receipts', path: '/fees/receipts' },
  //     { name: 'Pending Dues', path: '/fees/pending' },
  //     { name: 'Scholarships', path: '/fees/scholarships' },
  //   ],
  // },
  // {
  //   name: 'Exams',
  //   path: '/exams',
  //   icon: faFileAlt,
  //   children: [
  //     { name: 'Exam Schedule', path: '/exams/schedule' },
  //     { name: 'Results', path: '/exams/results' },
  //     { name: 'Grading Patterns', path: '/exams/grading' },
  //   ],
  // },
  // {
  //   name: 'Library',
  //   path: '/library',
  //   icon: faBook,
  //   children: [
  //     { name: 'Books', path: '/library/books' },
  //     { name: 'Issued Books', path: '/library/issued' },
  //     { name: 'Library Members', path: '/library/members' },
  //   ],
  // },
  // {
  //   name: 'Transport',
  //   path: '/transport',
  //   icon: faBus,
  //   children: [
  //     { name: 'Bus Routes', path: '/transport/routes' },
  //     { name: 'Live Tracking', path: '/transport/tracking' },
  //     { name: 'Drivers', path: '/transport/drivers' },
  //   ],
  // },
  // {
  //   name: 'Departments',
  //   path: '/departments',
  //   icon: faBuildingUser,
  //   children: [
  //     { name: 'Department List', path: '/departments' },
  //     { name: 'Class Timetable', path: '/departments/timetable' },
  //     { name: 'Subjects', path: '/departments/subjects' },
  //   ],
  // },
  // {
  //   name: 'Employees',
  //   path: '/employees',
  //   icon: faUsers,
  //   children: [
  //     { name: 'Employee List', path: '/employees' },
  //     { name: 'Leave Management', path: '/employees/leaves' },
  //     { name: 'Attendance', path: '/employees/attendance' },
  //   ],
  // },
  // {
  //   name: 'Events & Calendar',
  //   path: '/events',
  //   icon: faCalendarAlt,
  //   children: [
  //     { name: 'Academic Calendar', path: '/events/calendar' },
  //     { name: 'Events', path: '/events' },
  //     { name: 'Holidays', path: '/events/holidays' },
  //   ],
  // },
  // {
  //   name: 'Communication',
  //   path: '/communication',
  //   icon: faBell,
  //   children: [
  //     { name: 'Notices', path: '/communication/notices' },
  //     { name: 'Messages', path: '/communication/messages' },
  //     { name: 'Announcements', path: '/communication/announcements' },
  //   ],
  // },
  // {
  //   name: 'Packages',
  //   path: '/packages',
  //   icon: faBoxOpen,
  //   children: [
  //     { name: 'Plan List', path: '/packages' },
  //     { name: 'Create Plan', path: '/packages/create' },
  //     { name: 'Subscriptions', path: '/packages/subscriptions' },
  //   ],
  // },
  // {
  //   name: 'Administration',
  //   path: '/administration',
  //   icon: faUniversity,
  //   children: [
  //     { name: 'Settings', path: '/administration/settings' },
  //     { name: 'Roles & Permissions', path: '/administration/roles' },
  //     { name: 'Audit Logs', path: '/administration/logs' },
  //   ],
  // },
  // {
  //   name: 'Reports',
  //   path: '/reports',
  //   icon: faClipboardList,
  //   children: [
  //     { name: 'Student Reports', path: '/reports/students' },
  //     { name: 'Fee Reports', path: '/reports/fees' },
  //     { name: 'Attendance Reports', path: '/reports/attendance' },
  //     { name: 'Exam Reports', path: '/reports/exams' },
  //   ],
  // },
  // {
  //   name: 'System',
  //   path: '/system',
  //   icon: faCogs,
  //   children: [
  //     { name: 'Backup & Restore', path: '/system/backup' },
  //     { name: 'Integrations', path: '/system/integrations' },
  //     { name: 'API Access', path: '/system/api' },
  //   ],
  // }
];

export default _nav;
