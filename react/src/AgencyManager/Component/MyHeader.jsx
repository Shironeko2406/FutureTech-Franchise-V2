import React from "react";
import { removeDataTextStorage } from "../../Utils/UtilsFunction";
import {
  REFRESH_TOKEN,
  TOKEN_AUTHOR,
  USER_LOGIN,
} from "../../Utils/Interceptors";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const MyHeader = ({ onSidebarToggle }) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <a
              className="nav-link sidebar toggler nav-icon-hover"
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
              <a className="nav-link nav-icon-hover">
                <i className="ti ti-bell-ringing" />
                <div className="notification bg-primary rounded-circle" />
              </a>
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
                  <Link className="d-flex align-items-center gap-2 dropdown-item" to={'/agency-manager/profile'}>
                    <i className="ti ti-user fs-6" />
                    <p className="mb-0 fs-3">Chi Tiết Tài Khoản</p>
                  </Link>
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
