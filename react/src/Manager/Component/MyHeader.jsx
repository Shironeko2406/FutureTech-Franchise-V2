import React, { useEffect, useState } from "react";
import { removeDataTextStorage } from "../../Utils/UtilsFunction";
import {
  REFRESH_TOKEN,
  TOKEN_AUTHOR,
  USER_LOGIN,
} from "../../Utils/Interceptors";
import { message, Dropdown, Badge, List, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { BellOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { useNotifications } from "../../Utils/NotificationContext";
import { useDispatch, useSelector } from "react-redux";
import { MarkNotificationReadActionAsync } from "../../Redux/ReducerAPI/NotificationReducer";

const NotificationWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  overflow: hidden;
`;

const NotificationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const StyledNotificationList = styled(List)`
  max-height: 400px;
  overflow-y: auto;

  .ant-list-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .ant-list-item-meta-title {
    margin-bottom: 4px;
    font-weight: 500;
    color: #262626;
  }

  .ant-list-item-meta-description {
    font-size: 14px;
    color: #595959;
  }

  .notification-time {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 4px;
  }
`;

const NotificationFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  background: #fafafa;

  .ant-btn-link {
    color: #1890ff;
    font-weight: 500;
    
    &:hover {
      color: #40a9ff;
    }
  }
`;


const MyHeader = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const { fetchNotifications } = useNotifications(); // Gọi hook
  const dispatch = useDispatch()
  const { notificationData, countNotificationUnRead } = useSelector((state) => state.NotificationReducer);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    // Lấy các thông báo chưa đọc (có countNotificationUnRead)
    const unreadNotificationIds = notificationData
    .slice(0, countNotificationUnRead) 
    .map(item => item.id); // Chỉ lấy các id
  
    dispatch(MarkNotificationReadActionAsync(unreadNotificationIds)); 
  };
  
  const dropdownContent = (
    <NotificationWrapper>
      <NotificationHeader>
        <NotificationTitle>Thông báo</NotificationTitle>
        <Button type="link" onClick={handleMarkAllRead}>
          Đánh dấu tất cả đã đọc
        </Button>
      </NotificationHeader>
      <StyledNotificationList
        itemLayout="horizontal"
        dataSource={notificationData}
        renderItem={(item) => (
          <StyledNotificationList.Item>
            <StyledNotificationList.Item.Meta
              avatar={<BellOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
              title="Thông báo mới"
              description={
                <>
                  <div>{item.message}</div>
                  <div className="notification-time">{item.time}</div>
                </>
              }
            />
          </StyledNotificationList.Item>
        )}
      />
      <NotificationFooter>
        <Button type="link">Xem tất cả thông báo</Button>
      </NotificationFooter>
    </NotificationWrapper>
  );


  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <a
              className="nav-link sidebartoggler nav-icon-hover"
              id="headerCollapse"
              onClick={onSidebarToggle}
            >
              <i className="ti ti-menu-2" />
            </a>
          </li>
        </ul>
        <div
          className="navbar-collapse justify-content-end px-0"
          id="navbarNav"
        >
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <li className="nav-item">
              <Dropdown 
                dropdownRender={() => dropdownContent} 
                trigger={['click']} 
                placement="bottomRight"
                arrow
              >
                <a className="nav-link" onClick={e => e.preventDefault()}>
                  <Badge count={countNotificationUnRead} size="small">
                    <BellOutlined style={{ fontSize: '20px' }} />
                  </Badge>
                </a>
              </Dropdown>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon-hover"
                id="drop2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/assets/images/profile/user-1.jpg"
                  alt=""
                  width={35}
                  height={35}
                  className="rounded-circle"
                />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                aria-labelledby="drop2"
              >
                <div className="message-body">
                  <a className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-user fs-6" />
                    <p className="mb-0 fs-3">My Profile</p>
                  </a>
                  <a className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-mail fs-6" />
                    <p className="mb-0 fs-3">My Account</p>
                  </a>
                  <a className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-list-check fs-6" />
                    <p className="mb-0 fs-3">My Task</p>
                  </a>
                  <button
                    className="btn btn-outline-primary mx-auto d-block mt-2"
                    style={{ width: "85%" }}
                    onClick={() => {
                      removeDataTextStorage(TOKEN_AUTHOR);
                      removeDataTextStorage(REFRESH_TOKEN);
                      removeDataTextStorage(USER_LOGIN);
                      navigate("/");
                      message.success("Logout success!");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default MyHeader;

