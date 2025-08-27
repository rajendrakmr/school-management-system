import React, { lazy, ReactNode, LazyExoticComponent, ComponentType } from 'react';
import { faReceipt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface BaseNavItem {
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  name: string;
  url: string;
  id: string;
  icon?: ReactNode;
  badge?: {
    color: string;
    text: string;
  };
}

interface NavGroup extends BaseNavItem {
  items: BaseNavItem[];
}
type NavItem = BaseNavItem | NavGroup;



const routes: NavItem[] = [
  {
    component: lazy(() => import('@/pages/Dashboard')),
    name: 'Dashboard',
    url: '/',
    id: 'menu_item1',
  },
  { name: 'Dashboard', url: '/academics/sessions', id: 'sessions', component: lazy(() => import('@/pages/academic/sessions/Index')), },
  { name: 'Dashboard', url: '/academics/mediums', id: 'mediums', component: lazy(() => import('@/pages/academic/mediums/Index')), },
  { name: 'Dashboard', url: '/academics/departments', id: 'departments', component: lazy(() => import('@/pages/academic/departments/Index')), },
  { name: 'Dashboard', url: '/academics/subjects', id: 'subjects', component: lazy(() => import('@/pages/academic/subjects/Index')), },
  { name: 'Dashboard', url: '/academics/periods', id: 'periods', component: lazy(() => import('@/pages/academic/periods/Index')), },
  { name: 'Dashboard', url: '/academics/semesters', id: 'semesters', component: lazy(() => import('@/pages/academic/sessions/Index')), },
  { name: 'Dashboard', url: '/academics/grades', id: 'grades', component: lazy(() => import('@/pages/academic/grades/Index')), },
  { name: 'Dashboard', url: '/academics/shifts', id: 'shifts', component: lazy(() => import('@/pages/academic/shifts/Index')), },
  { name: 'Dashboard', url: '/academics/sections', id: 'sections', component: lazy(() => import('@/pages/academic/sections/Index')), },
  { name: 'Dashboard', url: '/academics/classes', id: 'classes', component: lazy(() => import('@/pages/academic/classes/Index')), },
  { name: 'Dashboard', url: '/academics/streams', id: 'streams', component: lazy(() => import('@/pages/academic/streams/Index')), },
  { name: 'Dashboard', url: '/academics/class-subjects', id: 'class-subjects', component: lazy(() => import('@/pages/academic/class-subjects/Index')), },

  { name: 'Dashboard', url: '/access-control/role-permissio', id: 'permissions', component: lazy(() => import('@/pages/rbac/hasPermissions/Index')), },
  { name: 'Dashboard', url: '/access-control/permissions', id: 'permissions', component: lazy(() => import('@/pages/rbac/permissions/Index')), },
  { name: 'Dashboard', url: '/access-control/roles', id: 'roles', component: lazy(() => import('@/pages/rbac/roles/Index')), },
  { name: 'Dashboard', url: '/access-control/policies', id: 'access-policies', component: lazy(() => import('@/pages/rbac/accessPolicy/Index')), },
  { name: 'Dashboard', url: '/schools/school-manage', id: 'schools-manage', component: lazy(() => import('@/pages/academic/schoolsInquiries/Index')), },
  { name: 'Dashboard', url: '/schools/school-inquiry', id: 'schools-inquiry', component: lazy(() => import('@/pages/academic/schools/Index')), },
  { name: 'Dashboard', url: '/semester', id: 'semesters', component: lazy(() => import('@/pages/academic/semesters/Index')), },
  { name: 'Page Setting', url: '/columns', id: 'column', component: lazy(() => import('@/pages/settings/columns/Index')), },
  { name: 'Packages', url: '/packages', id: 'packages', component: lazy(() => import('@/pages/settings/packages/Index')), },


  { name: 'Packages', url: '/subscription/plans', id: 'subscription/plans', component: lazy(() => import('@/pages/subscriptions/plans/Index')), },
  { name: 'Packages', url: '/subscription/users', id: 'subscription/users', component: lazy(() => import('@/pages/subscriptions/subscriber/Index')), },
  { name: 'Packages', url: '/subscription/payments', id: 'subscription/payments', component: lazy(() => import('@/pages/subscriptions/payment/Index')), },
  { name: 'Packages', url: '/subscription/discounts', id: 'subscription/discounts', component: lazy(() => import('@/pages/subscriptions/discount/Index')), },
  { name: 'Packages', url: '/subscription/renewals', id: 'subscription/renewals', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/subscription/reports', id: 'subscription/reports', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/subscription/settings', id: 'subscription/settings', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/hostels', id: 'hostel/hostels', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/rooms', id: 'hostel/rooms', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/allocation', id: 'hostel/allocation', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/staff', id: 'hostel/staff', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/mess', id: 'hostel/mess', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/fees', id: 'hostel/fees', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/transport/routes', id: 'transport/routes', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/transport/vehicles', id: 'transport/vehicles', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/transport/allocation', id: 'transport/allocation', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/transport/maintenance', id: 'transport/maintenance', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/staff', id: 'hostel/staff', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/attendance/students', id: 'attendance/students', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/attendance/teachers', id: 'attendance/teachers', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/attendance/staff', id: 'attendance/staff', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/attendance/exams', id: 'attendance/exams', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/leave/category', id: 'leave/category', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/leave/apply', id: 'leave/apply', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/leave/applications', id: 'leave/applications', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/admission-queries', id: 'admin/admission-queries', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/payroll/staff-salary', id: 'payroll/staff-salary', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/payroll/allowances', id: 'payroll/allowances', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/payroll/deductions', id: 'payroll/deductions', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/payroll/payslips', id: 'payroll/payslips', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/payroll/reports', id: 'payroll/reports', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/fees/categories', id: 'fees/categories', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/hostel/staff', id: 'hostel/staff', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/fees/collect', id: 'fees/collect', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/fees/receipts', id: 'fees/receipts', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },

  { name: 'Packages', url: '/fees/dues', id: 'fees/dues', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/fees/discounts', id: 'fees/discounts', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/visitors', id: 'admin/visitors', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/visitors', id: 'admin/visitors', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/postal-receive', id: 'admin/postal-receive', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/postal-dispatch', id: 'admin/postal-dispatch', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/phone-calls', id: 'admin/phone-calls', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/setup', id: 'admin/setup', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/id-cards', id: 'admin/id-cards', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/id-cards/generate', id: 'admin/id-cards/generate', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/certificates', id: 'admin/certificates', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/admin/certificates/generate', id: 'admin/certificates/generate', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/account/student-fees', id: 'account/student-fees', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/account/staff-salaries', id: 'account/staff-salaries', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/account/expenses', id: 'account/expenses', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/account/invoices', id: 'account/invoices', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/account/fee-reports', id: 'account/fee-reports', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/account/financial-reports', id: 'account/financial-reports', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/students', id: 'reports/students', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/fees', id: 'reports/fees', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/payroll', id: 'reports/payroll', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/library', id: 'reports/library', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/transport', id: 'reports/transport', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/hostel', id: 'reports/hostel', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/custom', id: 'reports/custom', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/fees', id: 'reports/fees', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },
  { name: 'Packages', url: '/reports/fees', id: 'reports/fees', component: lazy(() => import('@/pages/settings/comming-soon/Index')), },










  {
    component: lazy(() => import('@/pages/rbac/hasPermissions/Index')),
    name: 'Dashboard',
    url: '/has-permissions',
    id: 'has-permissions',
  },

  {
    component: lazy(() => import('@/pages/Dashboard')),
    name: 'Dashboard',
    url: '/user',
    id: 'menu_item1',
  },
  {
    component: lazy(() => import('@/pages/Employee/Index')),
    name: 'Dashboard',
    url: '/employees',
    id: 'menu_item1',
  },

  {
    component: lazy(() => import('@/pages/admin/Dashboard')),
    name: 'Dashboard',
    url: '/backend',
    id: 'backend',
  },
];

export default routes;
