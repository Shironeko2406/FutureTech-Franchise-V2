import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const LeftSidebar = ({ onSidebarToggle }) => {
  const { statusAgency } = useSelector((state) => state.AuthenticationReducer);

  // Menu cho trạng thái "active"
  const activeMenu = [
    { type: 'section', label: 'Trang chủ', icon: 'ti ti-dots' },
    { type: 'link', label: 'Doanh thu', path: '', icon: 'solar:home-smile-bold-duotone' },
    // { type: 'link', label: 'Lịch hẹn', path: '/agency-manager/appointment-schedule', icon: 'solar:calendar-bold-duotone' },
    { type: 'link', label: 'Khóa học', path: '/agency-manager/course', icon: 'mdi:book-open-page-variant' },
    { type: 'link', label: 'Trang thiết bị', path: '/agency-manager/equipments', icon: 'mdi:tools' },
    { type: 'link', label: 'Báo cáo sự cố', path: '/agency-manager/reports', icon: 'mdi:tools' },
    { type: 'link', label: 'Hợp đồng', path: '/agency-manager/contracts', icon: 'clarity:contract-solid' },
    { type: 'link', label: 'Tài liệu', path: '/agency-manager/documents', icon: 'solar:document-bold-duotone' },
    { type: 'section', label: 'Công việc bàn giao', icon: 'ti ti-dots' },
    { type: 'link', label: 'Quản lý', path: '/agency-manager/list-task', icon: 'solar:file-text-bold-duotone' },
    { type: 'link', label: 'Lịch hẹn', path: '/agency-manager/appointment-schedule', icon: 'solar:calendar-bold-duotone' },
    { type: 'section', label: 'Quản lý', icon: 'ti ti-dots' },
    { type: 'link', label: 'Tài khoản', path: '/agency-manager/accounts', icon: 'mdi:account-group' },
    { type: 'link', label: 'Giao dịch', path: '/agency-manager/student-payment', icon: 'fluent:payment-20-filled' },
    { type: 'link', label: 'Cài đặt VNPay', path: '/agency-manager/vnpay-setup', icon: 'mdi:key' },
    { type: 'section', label: 'Lớp học', icon: 'ti ti-dots' },
    { type: 'link', label: 'Ghi danh', path: '/agency-manager/student-consultation-registration', icon: 'solar:file-text-bold-duotone' },
    { type: 'link', label: 'Danh sách', path: '/agency-manager/classes', icon: 'ri:file-list-3-fill' },
    { type: 'link', label: 'Lịch học', path: '/agency-manager/schedules', icon: 'mdi:clock' },
    { type: 'link', label: 'Tiết học', path: '/agency-manager/slots', icon: 'solar:file-text-bold-duotone' },
  ];

  // Menu cho trạng thái "inactive"
  const inactiveMenu = [
    { type: 'section', label: 'Công việc bàn giao', icon: 'ti ti-dots' },
    { type: 'link', label: 'Quản lý', path: '/agency-manager', icon: 'solar:file-text-bold-duotone' },
    { type: 'link', label: 'Lịch hẹn', path: '/agency-manager/appointment-schedule', icon: 'solar:calendar-bold-duotone' },
  ];

  // Lựa chọn menu dựa trên trạng thái người dùng
  const sidebarItems = statusAgency !== "active" ? activeMenu : inactiveMenu;

  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/agency-manager" className="text-nowrap logo-img">
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
