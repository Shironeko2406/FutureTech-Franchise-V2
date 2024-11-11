import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { GetClassOfUserLoginActionAsync } from "../../Redux/ReducerAPI/UserReducer";



const LeftSidebar = ({ onSidebarToggle }) => {
  const dispatch = useDispatch();
  const { classOfUserLogin } = useSelector((state) => state.UserReducer);
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(()=>{
    dispatch(GetClassOfUserLoginActionAsync())
  },[])

  const sidebarItems = [
    { type: "section", label: "Trang chủ", icon: "ti ti-dots" },
    {
      type: "submenu",
      label: "Bảng điều khiển",
      path: "#",
      icon: "mdi:view-dashboard",
    },
    { type: "section", label: "Khóa học", icon: "ti ti-dots" },

    ...classOfUserLogin?.map((classItem, index) => ({
      type: "submenu",
      label: classItem.className, 
      icon: "mdi:school",
      subItems: [
        { label: "Bài kiểm tra", path: `/student/class/${classItem.classId}` },
        { label: "Bài tập nộp", path: `/student/class/${classItem.classId}` },
      ],
    })),
    { type: "section", label: "Lịch học", icon: "ti ti-dots" },
    { type: 'link', label: 'Lịch học', path: '/student/schedules', icon: 'mdi:clock' },
  ];


  const toggleSubmenu = (index) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [index]: !prevOpenSubmenus[index],
    }));
  };

  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/student" className="text-nowrap logo-img">
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
            {sidebarItems.map((item, index) =>
              item.type === "section" ? (
                <li key={index} className="nav-small-cap">
                  <i className={`${item.icon} nav-small-cap-icon fs-6`} />
                  <span className="hide-menu">{item.label}</span>
                </li>
              ) : item.type === "submenu" ? (
                <li key={index} className="sidebar-item">
                  <div
                    className="sidebar-link"
                    onClick={() => toggleSubmenu(index)}
                    aria-expanded={openSubmenus[index]}
                  >
                    <span>
                      <iconify-icon icon={item.icon} className="fs-6" />
                    </span>
                    <span className="hide-menu">{item.label}</span>
                  </div>
                  {openSubmenus[index] && (
                    <ul className="submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink className="sidebar-link" to={subItem.path}>
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={index} className="sidebar-item">
                  <NavLink
                    className="sidebar-link"
                    to={item.path}
                    aria-expanded="false"
                  >
                    <span>
                      <iconify-icon icon={item.icon} className="fs-6" />
                    </span>
                    <span className="hide-menu">{item.label}</span>
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
