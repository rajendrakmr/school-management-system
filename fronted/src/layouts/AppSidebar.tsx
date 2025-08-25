// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import { Collapse } from 'react-bootstrap';
// import _nav from '@/router/_nav';
// import './AppSidebar.css';
// interface SidebarProps<T = any> {
//   isToggle: boolean;
// }


// const Sidebar: React.FC<SidebarProps> = ({ isToggle }) => {
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
//   const location = useLocation();
//   const currentPath = location.pathname; 
//   // Function to toggle menu
//   const toggleMenu = (path: string) => {
//     setOpenMenus((prevOpenMenus) => {
//       const newOpenMenus: { [key: string]: boolean } = {};

//       // Open only the clicked menu
//       newOpenMenus[path] = !prevOpenMenus[path];

//       return newOpenMenus;
//     });
//   };

//   // Auto-open the menu that matches the current page & close others
//   useEffect(() => {
//     setOpenMenus(() => {
//       const newOpenMenus: { [key: string]: boolean } = {};

//       _nav.forEach((menuItem) => {
//         if (menuItem.path === currentPath || (menuItem.children && menuItem.children.some(child => child.path === currentPath))) {
//           newOpenMenus[menuItem.path] = true; // Open the matching menu
//         }
//       });

//       return newOpenMenus;
//     });
//   }, [currentPath]);

//   return (
//     <div className={`rk_sidebar ${isToggle ? "sidebarToogleCls" : ""}`}>
//       <div className="sidebar_fixed">
//         <div className={`${isToggle ? "sidebarToogleCls" : "sidebar_logo_container"} col-12 text-center`}>
//           <img src="/public/logo.png" alt="Logo" className="sidebar-logo" />
//           <div className="sidebar-user-info">
//             <strong className="user-name">Rajendra</strong>
//             <p className="user-role">rajendra@gmail.com</p>
//           </div>
//         </div>

//         <div className="col-12 sidebar_routes_container">
//           <div className="sidebarRoutes">
//             <ul className="p-0 accordion">
//               {_nav.map((menuItem, index) => (
//                 <li key={index} className={`parent-route accordion-item border-none ${openMenus[menuItem.path] ? 'isParentActive' : ''} `}>
//                   <div
//                     className={`p-route-link accordion-header ${openMenus[menuItem.path] ? 'child-active' : ''}`}
//                     onClick={() => toggleMenu(menuItem.path)}
//                   >
//                     <div className="d-flex align-items-center gap-2">
//                       {menuItem.icon && (
//                         <FontAwesomeIcon icon={menuItem.icon} className={`p-route-icon p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''}`} />
//                       )}
//                       {menuItem.isParent ? (
//                         <Link to={menuItem.path} className={`c-route-parent-link ${currentPath === menuItem.path ? 'isParent' : ''}`}>
//                           <span className={`ps-1 p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''}`}>{menuItem.name}</span>
//                         </Link>
//                       ) : (
//                         <span className={`ps-1 p-cl-white custom-font ${openMenus[menuItem.path] ? 'activeColor' : ''}`}>{menuItem.name}</span>
//                       )}
//                       {menuItem.children && (
//                         <FontAwesomeIcon
//                           icon={openMenus[menuItem.path] ? faAngleDown : faAngleRight}
//                           className="p-route-icon p-cl-white p-abs"
//                         />
//                       )}

//                     </div>
//                   </div>
//                   {menuItem.children && (
//                     <Collapse in={openMenus[menuItem.path]}>
//                       <div>
//                         <ul className="p-0 accordion-body child-route-con">
//                           {menuItem.children.map((childItem, childIndex) => (
//                             <li
//                               key={childIndex}
//                               className={`child-route ${currentPath === childItem.path ? 'child-active childActive' : ''}`}
//                             >
//                               <Link to={childItem.path} className="c-route-link">
//                                 {currentPath === childItem.path && (
//                                   <span className="active-blinking-dot"></span>
//                                 )} <span className={`c-cl-w ${currentPath === childItem.path ? 'activeColor' : ''}`}>{childItem.name}</span>
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </Collapse>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import './AppSidebar.css';

interface SidebarProps<T = any> {
  isToggle: boolean;
}

const AppSidebar: React.FC<SidebarProps> = ({ isToggle }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const currentPath = location.pathname;

  // Get menu from Redux store
  const menu = useSelector((state: RootState) => state.user.menu || []);
  const usersInfo = useSelector((state: RootState) => state.user.user || {});
 
  const toggleMenu = (path: string) => {
    setOpenMenus((prevOpenMenus) => {
      const newOpenMenus: { [key: string]: boolean } = {};
      newOpenMenus[path] = !prevOpenMenus[path]; // Open only clicked menu
      return newOpenMenus;
    });
  };

  // Auto-open the menu that matches the current page & close others
  useEffect(() => {
    setOpenMenus(() => {
      const newOpenMenus: { [key: string]: boolean } = {};
      menu.forEach((menuItem: any) => {
        if (
          menuItem.path === currentPath ||
          (menuItem.children && menuItem.children.some((child: any) => child.path === currentPath))
        ) {
          newOpenMenus[menuItem.path] = true;
        }
      });
      return newOpenMenus;
    });
  }, [currentPath, menu]);

  return (
    <div className={`rk_sidebar ${isToggle ? "sidebarToogleCls" : ""}`}>
      <div className="sidebar_fixed">
        <div className={`${isToggle ? "sidebarToogleCls" : "sidebar_logo_container"} col-12 text-center`}>
          <img src={usersInfo.logo} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-user-info">
            <strong className="user-name">{usersInfo.first_name}</strong>
            <p className="user-role">{usersInfo.email}</p>
          </div>
        </div>

        <div className="col-12 sidebar_routes_container">
          <div className="sidebarRoutes">
            <ul className="p-0 accordion" >
              {menu.map((menuItem: any, index: number) => (
                <li key={index} className={`parent-route accordion-item border-none ${openMenus[menuItem.path] ? 'isParentActive' : ''}`}>
                  <div
                    className={`p-route-link accordion-header ${openMenus[menuItem.path] ? 'child-active' : ''}`}
                    onClick={() => toggleMenu(menuItem.path)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {menuItem.icon && (
                        <FontAwesomeIcon icon={menuItem.icon} className={`p-route-icon p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''}`} />
                      )}
                      {menuItem.isParent ? (
                        <Link to={menuItem.path} className={`c-route-parent-link ${currentPath === menuItem.path ? 'isParent' : ''}`}>
                          <span className={`ps-1 p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''}`}>{menuItem.name}</span>
                        </Link>
                      ) : (
                        <span className={`ps-1 p-cl-white custom-font ${openMenus[menuItem.path] ? 'activeColor' : ''}`}>{menuItem.name}</span>
                      )}
                      {menuItem.children && (
                        <FontAwesomeIcon
                          icon={openMenus[menuItem.path] ? faAngleDown : faAngleRight}
                          className="p-route-icon p-cl-white p-abs"
                        />
                      )}
                    </div>
                  </div>

                  {menuItem.children && (
                    <Collapse in={openMenus[menuItem.path]}>
                      <div>
                        <ul className="p-0 accordion-body child-route-con">
                          {menuItem.children.map((childItem: any, childIndex: number) => (
                            <li
                              key={childIndex}
                              className={`child-route ${currentPath === childItem.path ? 'child-active childActive' : ''}`}
                            >
                              <Link to={childItem.path} className="c-route-link">
                                {/* {currentPath === childItem.path && (
                                  <span className="active-blinking-dot"></span>
                                )} */}
                                <span className={`c-cl-w ${currentPath === childItem.path ? 'childActiveColor' : ''}`}>{childItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Collapse>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;

