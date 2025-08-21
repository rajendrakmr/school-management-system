 
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
];

export default _nav;
