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

  // ✅ stable selector (no new reference)
  const menu = useSelector((state: RootState) => state.user.menu) ?? [];
  const usersInfo = useSelector((state: RootState) => state.user.user) ?? {};

  const toggleMenu = (path: string) => {
    setOpenMenus((prevOpenMenus) => {
      const newOpenMenus: { [key: string]: boolean } = {};
      newOpenMenus[path] = !prevOpenMenus[path]; // सिर्फ clicked menu open
      return newOpenMenus;
    });
  };

  // Auto-open menu that matches current page
  useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {};
    menu.forEach((menuItem: any) => {
      if (
        menuItem.path === currentPath ||
        (menuItem.children && menuItem.children.some((child: any) => child.path === currentPath))
      ) {
        newOpenMenus[menuItem.path] = true;
      }
    });

    setOpenMenus((prevOpenMenus) => {
      const isSame =
        Object.keys(prevOpenMenus).length === Object.keys(newOpenMenus).length &&
        Object.keys(prevOpenMenus).every((key) => prevOpenMenus[key] === newOpenMenus[key]);

      return isSame ? prevOpenMenus : newOpenMenus;
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
            <ul className="p-0 accordion">
              {menu.map((menuItem: any, index: number) => (
                <li
                  key={index}
                  className={`parent-route accordion-item border-none ${openMenus[menuItem.path] ? 'isParentActive' : ''}`}
                >
                  <div
                    className={`p-route-link accordion-header ${openMenus[menuItem.path] ? 'child-active' : ''}`}
                    onClick={() => toggleMenu(menuItem.path)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {menuItem.icon && (
                        <FontAwesomeIcon
                          icon={menuItem.icon}
                          className={`p-route-icon p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''}`}
                        />
                      )}
                      {menuItem.isParent ? (
                        <Link
                          to={menuItem.path}
                          className={`c-route-parent-link ${currentPath === menuItem.path ? 'isParent' : ''}`}
                        >
                          <span className={`ps-1 p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''}`}>
                            {menuItem.name}
                          </span>
                        </Link>
                      ) : (
                        <span
                          className={`ps-1 p-cl-white custom-font ${openMenus[menuItem.path] ? 'activeColor' : ''}`}
                        >
                          {menuItem.name}
                        </span>
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
                                <span
                                  className={`c-cl-w ${currentPath === childItem.path ? 'childActiveColor' : ''}`}
                                >
                                  {childItem.name}
                                </span>
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
