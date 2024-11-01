import React from 'react'
import { NavLink } from 'react-router-dom'

const LeftSidebar = ({ onSidebarToggle }) => {
  return (
    <aside className="left-sidebar">
      {/* Sidebar scroll*/}
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/manager" className="text-nowrap logo-img">
            <img src="/assets/images/logos/logo-light.svg" alt="" />
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
              <span className="hide-menu"></span>
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
          </ul>
        </nav>
        {/* End Sidebar navigation */}
      </div>
      {/* End Sidebar scroll*/}
    </aside>
  )
}

export default LeftSidebar