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
  {name: 'Dashboard',url: '/permissions',id: 'permissions',component: lazy(() => import('@/pages/rbac/permissions/Index')),},
  {name: 'Dashboard',url: '/roles',id: 'roles',component: lazy(() => import('@/pages/rbac/roles/Index')),},
  {name: 'Dashboard',url: '/schools-inquiry',id: 'schools-inquiry',component: lazy(() => import('@/pages/academic/schoolsInquiries/Index')),},
   {name: 'Dashboard',url: '/mediums',id: 'mediums',component: lazy(() => import('@/pages/academic/mediums/Index')),},
  
  {
    component: lazy(() => import('@/pages/rbac/hasPermissions/Index')),
    name: 'Dashboard',
    url: '/has-permissions',
    id: 'has-permissions',
  },
  {
    component: lazy(() => import('@/pages/academic/schools/Index')),
    name: 'Dashboard',
    url: '/schools',
    id: 'student_detail',
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
