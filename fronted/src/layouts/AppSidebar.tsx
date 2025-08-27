import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import './AppSidebar.css';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SidebarProps<T = any> {
  isToggle: boolean;
}

const AppSidebar: React.FC<SidebarProps> = ({ isToggle }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const currentPath = location.pathname;

  const menu = useSelector((state: RootState) => state.user.menu) ?? [];
  const usersInfo = useSelector((state: RootState) => state.user.user) ?? {};

  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) => ({ [path]: !prev[path] }));
  };

  // Auto-open menu matching current route
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
    setOpenMenus(newOpenMenus);
  }, [currentPath, menu]);

  // Reorder menu: active parent first
  const orderedMenu = useMemo(() => {
    if (!menu || menu.length === 0) return [];
    const activeIndex = menu.findIndex(
      (menuItem: any) =>
        menuItem.path === currentPath ||
        (menuItem.children && menuItem.children.some((child: any) => child.path === currentPath))
    );
    if (activeIndex === -1) return menu;
    const newMenu = [...menu];
    const [activeItem] = newMenu.splice(activeIndex, 1);
    return [activeItem, ...newMenu];
  }, [menu, currentPath]);

  // Refs for parent and child items
  const parentRefs = useMemo(() => orderedMenu.map(() => React.createRef<HTMLLIElement>()), [orderedMenu]);
  const childRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // Scroll active parent/child into visible container
  useEffect(() => {
    if (!sidebarContainerRef.current) return;

    const container = sidebarContainerRef.current;

    // Scroll active parent
    const activeParentIndex = orderedMenu.findIndex(
      (menuItem: any) =>
        menuItem.path === currentPath ||
        (menuItem.children && menuItem.children.some((child: any) => child.path === currentPath))
    );
    const parentEl = parentRefs[activeParentIndex]?.current;
    if (parentEl) {
      const parentTop = parentEl.offsetTop;
      const parentBottom = parentTop + parentEl.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (parentTop < containerTop) {
        container.scrollTo({ top: parentTop, behavior: 'smooth' });
      } else if (parentBottom > containerBottom) {
        container.scrollTo({ top: parentBottom - container.clientHeight, behavior: 'smooth' });
      }
    }

    // Scroll active child
    const childEl = childRefs.current[currentPath];
    if (childEl) {
      const childTop = childEl.offsetTop;
      const childBottom = childTop + childEl.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (childTop < containerTop) {
        container.scrollTo({ top: childTop, behavior: 'smooth' });
      } else if (childBottom > containerBottom) {
        container.scrollTo({ top: childBottom - container.clientHeight, behavior: 'smooth' });
      }
    }
  }, [currentPath, orderedMenu, parentRefs]);

  return (
    <div className={`rk_sidebar ${isToggle ? 'sidebarToogleCls' : ''}`}>
      <div className="sidebar_fixed">
        <div className={`${isToggle ? 'sidebarToogleCls' : 'sidebar_logo_container'} col-12 text-center`}>
          <img src={usersInfo.logo} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-user-info">
            <strong className="user-name">{usersInfo.first_name}</strong>
            <p className="user-role">{usersInfo.email}</p>
          </div>
        </div>

        <div className="col-12 sidebar_routes_container" ref={sidebarContainerRef} style={{ overflowY: 'auto', maxHeight: '94%' }}>
          <div className="sidebarRoutes">
            <ul className="p-0 accordion">
              {orderedMenu.map((menuItem: any, index: number) => (
                <li
                  ref={parentRefs[index]}
                  key={index}
                  className={`parent-route accordion-item border-none ${openMenus[menuItem.path] ? 'isParentActive' : ''
                    }`}
                >
                  <div
                    className={`p-route-link accordion-header ${openMenus[menuItem.path] ? 'child-active' : ''
                      }`}
                    onClick={() => toggleMenu(menuItem.path)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {menuItem.icon && (
                        <FontAwesomeIcon
                          icon={Icons[menuItem.icon as keyof typeof Icons] as IconDefinition}
                          size="sm" // small, lg, 2x, 3x, etc.
                          className="sidebar-icon"
                        //  className="sidebar-icon"
                        />
                      )}

                      {menuItem.isParent ? (
                        <Link
                          to={menuItem.path}
                          className={`c-route-parent-link ${currentPath === menuItem.path ? 'isParent' : ''
                            }`}
                        >
                          <span
                            className={`ps-1 p-cl-white ${openMenus[menuItem.path] ? 'activeColor' : ''
                              }`}
                          >
                            {menuItem.name}
                          </span>
                        </Link>
                      ) : (
                        <span
                          className={`ps-1 p-cl-white custom-font ${openMenus[menuItem.path] ? 'activeColor' : ''
                            }`}
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
                              ref={(el) => { childRefs.current[childItem.path] = el; }}
                              key={childIndex}
                              className={`child-route ${currentPath === childItem.path ? 'child-active childActive' : ''
                                }`}
                            >
                              <Link
                                to={childItem.path}
                                className="c-route-link d-flex align-items-center"
                              >
                                <span
                                style={{backgroundColor:"gray"}}
                                  className={`menu-dot ${currentPath === childItem.path ? 'active-dot' : ''
                                    }`}
                                ></span>

                                <span
                                  className={`c-cl-w ${currentPath === childItem.path ? 'childActiveColor' : ''
                                    }`}
                                >
                                  {childItem.name}
                                </span>

                                {childItem.isNew && (
                                  <span className="badge bg-success ms-auto">New</span>
                                )}
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
        <div className="col-md">
          <button
      className="btn btn-danger mt-1 btn-sm w-75 d-flex align-items-center justify-content-center mx-auto logout-btn"
      // onClick={handleLogout} // your logout function
    >
      <FontAwesomeIcon icon={Icons.faSignOutAlt as IconDefinition} className="me-2" />
      Logout
    </button>
        </div>

      </div>
    </div>
  );
};

export default AppSidebar;
