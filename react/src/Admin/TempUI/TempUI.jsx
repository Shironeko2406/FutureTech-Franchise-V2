import React, { useEffect, useState } from "react";
import LeftSidebar from "../Components/LeftSidebar";
import MyHeader from "../Components/MyHeader";
import { Outlet } from "react-router-dom";

const TempUI = () => {
  const [sidebarType, setSidebarType] = useState("full");
  const [miniSidebar, setMiniSidebar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // Trạng thái cho show-sidebar

  // Hàm để thiết lập kiểu sidebar dựa trên kích thước màn hình
  const setSidebarTypeHandler = () => {
    const width =
      window.innerWidth > 0 ? window.innerWidth : window.screen.width;
    if (width < 1199) {
      setSidebarType("mini-sidebar");
      setMiniSidebar(true);
    } else {
      setSidebarType("full");
      setMiniSidebar(false);
    }
  };

  useEffect(() => {
    setSidebarTypeHandler(); // Thiết lập lần đầu khi render
    window.addEventListener("resize", setSidebarTypeHandler); // Lắng nghe sự kiện resize

    // Cleanup function để loại bỏ listener khi component unmount
    return () => {
      window.removeEventListener("resize", setSidebarTypeHandler);
    };
  }, []);

  // Xử lý toggle sidebar
  const handleSidebarToggle = () => {
    setMiniSidebar(!miniSidebar);
    setSidebarType(!miniSidebar ? "mini-sidebar" : "full");
    setShowSidebar(!showSidebar); // Toggle trạng thái show-sidebar
  };

  return (
    <div
      className={`page-wrapper ${miniSidebar ? "mini-sidebar" : ""} ${
        showSidebar ? "show-sidebar" : ""
      }`}
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype={sidebarType}
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      {/* Sidebar Start */}
      <LeftSidebar onSidebarToggle={handleSidebarToggle} />
      {/*  Sidebar End */}
      {/*  Main wrapper */}
      <div className="body-wrapper">
        {/*  Header Start */}
        <MyHeader onSidebarToggle={handleSidebarToggle}></MyHeader>
        {/*  Header End */}
        <div className="container-fluid">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default TempUI;
