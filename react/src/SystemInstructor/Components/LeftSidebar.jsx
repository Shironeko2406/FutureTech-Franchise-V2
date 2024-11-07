import React from "react";
import { NavLink } from "react-router-dom";

// Dữ liệu cho sidebar
const sidebarItems = [
  { type: 'section', label: 'Trang chủ', icon: 'ti ti-dots' },
  { type: 'link', label: 'Bảng điều khiển', path: '/instructor', icon: 'solar:home-smile-bold-duotone' },
  { type: 'section', label: 'Quản lý', icon: 'ti ti-dots' },
  { type: 'link', label: 'Người dùng', path: '#', icon: 'solar:layers-minimalistic-bold-duotone' },
  { type: 'link', label: 'Giảng viên', path: '#', icon: 'solar:danger-circle-bold-duotone' },
  { type: 'link', label: 'Khóa học', path: '/system-instructor/course', icon: 'solar:bookmark-square-minimalistic-bold-duotone' },
  { type: 'link', label: 'Lịch học', path: '#', icon: 'solar:file-text-bold-duotone' },
  { type: 'link', label: 'Kiểu chữ', path: '#', icon: 'solar:text-field-focus-bold-duotone' },
  { type: 'section', label: 'Tư vấn' },
  { type: 'link', label: 'Phê duyệt', path: '#', icon: 'solar:login-3-bold-duotone' },
  { type: 'link', label: 'Trạng thái', path: '#', icon: 'solar:user-plus-rounded-bold-duotone' },
  
];

const LeftSidebar = ({ onSidebarToggle }) => {
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/system-instructor" className="text-nowrap logo-img">
            <img src="/assets/images/logos/logo-light.svg" alt="logo" />
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
          <div className="unlimited-access hide-menu bg-primary-subtle position-relative mb-7 mt-7 rounded-3">
            <div className="d-flex">
              <div className="unlimited-access-title me-3">
                <h6 className="fw-semibold fs-4 mb-6 text-dark w-75">
                  Upgrade to pro
                </h6>
                <a target="_blank" className="btn btn-primary fs-2 fw-semibold lh-sm">
                  Buy Pro
                </a>
              </div>
              <div className="unlimited-access-img">
                <img src="/assets/images/backgrounds/rocket.png" alt="rocket" className="img-fluid" />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
