import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { type: 'section', label: 'Tư vấn' },
  { type: 'link', label: 'Danh sách', path: '/system-consultant', icon: 'solar:login-3-bold-duotone' },
  // { type: 'section', label: 'Công việc' },
  // { type: 'link', label: 'Danh sách', path: '/system-consultant/list-task', icon: 'solar:login-3-bold-duotone' },
  // { type: 'link', label: 'Lịch hẹn', path: '/system-consultant/appointment-schedule', icon: 'solar:calendar-bold-duotone' }
];


const LeftSidebar = ({ onSidebarToggle }) => {
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/system-consultant" className="text-nowrap logo-img">
            <img src="/assets/images/logos/FutureTechLogo.png" alt="logo" />
          </NavLink>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
            onClick={onSidebarToggle}
          >
            <i className="ti ti-x fs-8" />
          </div>
        </div>
        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
          <ul id="sidebarnav">
            {sidebarItems.map((item, index) => (
              item.type === 'section' ? (
                <li key={index} className="nav-small-cap">
                  <i className={`${item.icon} nav-small-cap-icon fs-6`} />
                  <span className="hide-menu">{item.label}</span>
                </li>
              ) : (
                <li key={index} className="sidebar-item">
                  <NavLink className="sidebar-link" to={item.path} aria-expanded="false">
                    <span>
                      <iconify-icon icon={item.icon} className="fs-6" />
                    </span>
                    <span className="hide-menu">{item.label}</span>
                  </NavLink>
                </li>
              )
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
