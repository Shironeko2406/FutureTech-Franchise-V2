import React from "react";
import { NavLink } from "react-router-dom";

const LeftSidebar = ({ onSidebarToggle }) => {

  const sidebarItems = [
    { type: 'section', label: 'Trang chủ', icon: 'ti ti-dots' },
    { type: 'link', label: 'Doanh thu', path: '/agency-manager/dashboard', icon: 'solar:home-smile-bold-duotone' },
    { type: 'section', label: 'Quản lý', icon: 'ti ti-dots' },
    { type: 'link', label: 'Người dùng', path: '#', icon: 'solar:layers-minimalistic-bold-duotone' },
    { type: 'link', label: 'Giảng viên', path: '#', icon: 'solar:layers-minimalistic-bold-duotone' },
    { type: 'link', label: 'Giao dịch', path: '/agency-manager/student-payment', icon: 'fluent:payment-20-filled' },
    { type: 'section', label: 'Lớp học', icon: 'ti ti-dots' },
    { type: 'link', label: 'Ghi danh', path: '/agency-manager/student-consultation-registration', icon: 'solar:file-text-bold-duotone' },
    { type: 'link', label: 'Danh sách', path: '/agency-manager/classes', icon: 'ri:file-list-3-fill' },
    { type: 'link', label: 'Lịch học', path: '/agency-manager/schedules', icon: 'mdi:clock' },
    { type: 'link', label: 'Slot', path: '/agency-manager/slots', icon: 'solar:file-text-bold-duotone' },
  ];
  

  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/agency-manager/dashboard" className="text-nowrap logo-img">
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
