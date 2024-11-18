import React from "react";
import { NavLink } from "react-router-dom";

const LeftSidebar = ({ onSidebarToggle }) => {

  return (
    <aside className="left-sidebar">
      {/* Sidebar scroll*/}
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="" className="text-nowrap logo-img">
            {/* <img src="/assets/images/logos/logo-light.svg" alt="" /> */}
          </NavLink>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
            onClick={onSidebarToggle}
          >
            <i className="ti ti-x fs-8" />
          </div>
        </div>
        {/* Sidebar navigation*/}
        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-6" />
              <span className="hide-menu">Home</span>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="/agency-manager"
                aria-expanded="false"
              >
                <span>
                  <iconify-icon
                    icon="solar:home-smile-bold-duotone"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-6" />
              <span className="hide-menu">Quản lý</span>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="#"
                aria-expanded="false"
              >
                <span>
                  <iconify-icon
                    icon="solar:layers-minimalistic-bold-duotone"
                    className="fs-6"

                    activeClassName="active"
                  />
                </span>
                <span className="hide-menu">Người dùng</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="#"
                aria-expanded="false"

              >
                <span>
                  <iconify-icon
                    icon="solar:layers-minimalistic-bold-duotone"
                    className="fs-6"

                    activeClassName="active"
                  />
                </span>
                <span className="hide-menu">Giảng viên</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="student-payment"
                aria-expanded="false"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="fluent:payment-20-filled"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Giao dịch</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="student-accounts"
                aria-expanded="false"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="mdi:account-group"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Học sinh</span>
              </NavLink>
            </li>
            <li className="nav-small-cap">
              <span className="hide-menu">Lớp học</span>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="student-consultation-registration"
                aria-expanded="false"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="solar:file-text-bold-duotone"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Ghi danh</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="classes"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="ri:file-list-3-fill"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Danh sách</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="schedules"
                aria-expanded="false"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="uis:schedule"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Lịch học</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="slots"
                aria-expanded="false"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="mdi:clock"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Slots</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* End Sidebar navigation */}
      </div>
      {/* End Sidebar scroll*/}
    </aside>
  );
};

export default LeftSidebar;
