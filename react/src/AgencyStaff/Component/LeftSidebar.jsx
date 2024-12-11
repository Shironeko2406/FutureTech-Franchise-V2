import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const LeftSidebar = ({ onSidebarToggle }) => {

  // Menu cho trạng thái "active"
  const sidebarItems = [
    { type: 'section', label: 'Trang chủ', icon: 'ti ti-dots' },
    { type: 'link', label: 'Lịch hẹn', path: '/agency-staff/appointment-schedule', icon: 'solar:calendar-bold-duotone' },
    { type: 'link', label: 'Khóa học', path: '/agency-staff/course', icon: 'mdi:book-open-page-variant' },
    { type: 'link', label: 'Trang thiết bị', path: '/agency-staff/equipments', icon: 'mdi:tools' },
    { type: 'link', label: 'Giao dịch', path: '/agency-staff/student-payment', icon: 'fluent:payment-20-filled' },
    { type: 'section', label: 'Lớp học', icon: 'ti ti-dots' },
    { type: 'link', label: 'Ghi danh', path: '', icon: 'solar:file-text-bold-duotone' },
    { type: 'link', label: 'Danh sách', path: '/agency-staff/classes', icon: 'ri:file-list-3-fill' },
    { type: 'link', label: 'Lịch học', path: '/agency-staff/schedules', icon: 'mdi:clock' },
    { type: 'link', label: 'Tiết học', path: '/agency-staff/slots', icon: 'solar:file-text-bold-duotone' },
  ];


  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/agency-staff/dashboard" className="text-nowrap logo-img">
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
