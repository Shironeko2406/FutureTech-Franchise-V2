import React, { useState } from "react"; // Add useState import
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { LoginActionAsync } from "../../../Redux/ReducerAPI/AuthenticationReducer";
import { getDataJSONStorage } from "../../../Utils/UtilsFunction";
import { USER_LOGIN } from "../../../Utils/Interceptors";
import { Spin } from "antd";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userForm = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      dispatch(LoginActionAsync(values)).then(() => {
        const userLogin = getDataJSONStorage(USER_LOGIN);
        if (userLogin) {
          switch (userLogin.role) {
            case "Administrator":
              navigate("/admin");
              break;
            case "AgencyManager":
              navigate("/agency-manager");
              break;
            case "AgencyStaff":
              navigate("/agency-staff");
              break;
            case "Student":
              navigate("/student");
              break;
            case "Instructor":
              navigate("/instructor");
              break;
            case "Manager":
              navigate("/manager");
              break;
            case "SystemInstructor":
              navigate("/system-instructor");
              break;
            case "SystemTechnician":
              navigate("/system-technician");
              break;
            case "SystemConsultant":
              navigate("/system-consultant");
              break;
            default:
              navigate("/");
          }
        } else {
          navigate("/");
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    },
  });

  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-6 col-xxl-4">
              <div className="card mb-0">
                <div className="card-body">
                  <NavLink
                    to="/"
                    className="text-nowrap logo-img text-center d-block py-3 w-100"
                  >
                    <img src="/assets/images/logos/FutureTechLogo.png" />
                  </NavLink>
                  <p className="text-center">Đăng nhập</p>
                  <form onSubmit={userForm.handleSubmit}>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Tên người dùng
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="userName"
                        name="userName"
                        onChange={userForm.handleChange}
                        value={userForm.values.userName}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={userForm.handleChange}
                        value={userForm.values.password}
                      />
                    </div>
                    <div className="text-center mb-4">
                      <NavLink
                        className="text-primary fw-bold"
                        to="/forgot-password"
                      >
                        Quên mật khẩu ?
                      </NavLink>
                    </div>
                    <button
                      className="btn btn-primary w-100 py-8 fs-4 mb-4"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <Spin /> : "Đăng Nhập"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
