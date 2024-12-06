import React from "react";
import { NavLink, Link } from "react-router-dom";

const LeftSidebar = ({ onSidebarToggle }) => {

  const sidebarItems = [
    { type: 'section', label: 'Trang chủ', icon: 'ti ti-dots' },
    { type: 'link', label: 'Thông tin trang chủ', path: '/admin/home-page-management', icon: 'solar:home-smile-bold-duotone' },
    { type: 'section', label: 'Quản lý', icon: 'ti ti-dots' },
    { type: 'link', label: 'Tài khoản hệ thống', path: '/admin/system-accounts', icon: 'mdi:account-group' },
    { type: 'link', label: 'Tài khoản chi nhánh', path: '/admin/agency-accounts', icon: 'mdi:account-group' },
    { type: 'link', label: 'Hợp đồng', path: '/admin/contracts', icon: 'clarity:contract-solid' },
    { type: 'section', label: 'Mẫu công việc', icon: 'ti ti-dots' },
    { type: 'link', label: 'Chi tiết', path: '/admin/work-template', icon: 'solar:file-text-bold-duotone' },
  ];

  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/admin" className="text-nowrap logo-img">
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