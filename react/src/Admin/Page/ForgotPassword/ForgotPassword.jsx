import { useDispatch } from "react-redux";
import { OtpEmailActionAsync } from "../../../Redux/ReducerAPI/AuthenticationReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState } from "react";
import { Spin } from "antd";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      dispatch(OtpEmailActionAsync(values))
        .then((response) => {
          if (response) {
            navigate(
              `/forgot-password/reset-password?username=${values.username}`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
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
                  <p className="text-center">Lấy lại mật khẩu</p>
                  <form onSubmit={user.handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Tên người dùng
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        onChange={user.handleChange}
                        value={user.values.username}
                      />
                    </div>

                    <button
                      className="btn btn-primary w-100 py-8 fs-4 mb-4"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spin size="small" />
                      ) : (
                        "Quên mật khẩu"
                      )}
                    </button>
                    <div className="d-flex align-items-center justify-content-center">
                      <p className="fs-4 mb-0 fw-bold">Đăng nhập?</p>
                      <NavLink className="text-primary fw-bold ms-2" to="/">
                        Trở lại
                      </NavLink>
                    </div>
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

export default ForgotPassword;
