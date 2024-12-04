import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetUserLoginActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.UserReducer);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(GetUserLoginActionAsync());
  }, [dispatch]);

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "";
  };

  const userUpdate = useFormik({
    initialValues: {
      userName: userProfile.userName || "",
      email: userProfile.email || "",
      fullName: userProfile.fullName || "",
      phoneNumber: userProfile.phoneNumber || "",
      dateOfBirth: userProfile.dateOfBirth ? dayjs(userProfile.dateOfBirth).format("YYYY-MM-DD") : "",
      gender: userProfile.gender || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      setIsEditing(false);
    },
  });

  return (
    <div className="card">
      <div className="card-body">
        <div className="e-profile">
          <div className="row">
            <div className="col-12 col-sm-auto mb-3">
              <div className="mx-auto" style={{ width: 140 }}>
                <div
                  className="d-flex justify-content-center align-items-center rounded"
                  style={{ height: 140, backgroundColor: "rgb(233, 236, 239)" }}
                >
                  <img
                    src={userProfile?.urlImage || "/assets/images/profile/user-1.jpg"}
                    alt="Profile"
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col d-flex flex-column flex-sm-row justify-content-between mb-3">
              <div className="text-center text-sm-start mb-2 mb-sm-0">
                <h4 className="pt-sm-2 pb-1 mb-0 text-nowrap">
                  {userProfile?.fullName}
                </h4>
                <p className="mb-0">{userProfile?.userName}</p>
                <div className="text-muted">
                  <small>Last seen 2 hours ago</small>
                </div>
              </div>
              <div className="text-center text-sm-end">
                <span className="badge bg-secondary">{userProfile?.role}</span>
                <div className="text-muted">
                  <small>Joined 09 Dec 2017</small>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content pt-3">
            <form className="form" onSubmit={userUpdate.handleSubmit}>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>Họ và Tên</label>
                    <input
                      className="form-control"
                      type="text"
                      name="fullName"
                      readOnly={!isEditing}
                      value={userUpdate.values.fullName}
                      onChange={userUpdate.handleChange}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                      className="form-control"
                      type="text"
                      name="userName"
                      readOnly={!isEditing}
                      value={userUpdate.values.userName}
                      onChange={userUpdate.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      readOnly={!isEditing}
                      value={userUpdate.values.email}
                      onChange={userUpdate.handleChange}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      className="form-control"
                      type="tel"
                      name="phoneNumber"
                      readOnly={!isEditing}
                      value={userUpdate.values.phoneNumber}
                      onChange={userUpdate.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      className="form-control"
                      type="date"
                      name="dateOfBirth"
                      readOnly={!isEditing}
                      value={userUpdate.values.dateOfBirth}
                      onChange={userUpdate.handleChange}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      className="form-control"
                      name="gender"
                      disabled={!isEditing}
                      value={userUpdate.values.gender}
                      onChange={userUpdate.handleChange}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col d-flex justify-content-end">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-danger me-2"
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          userUpdate.resetForm();
                        }}
                      >
                        Hủy
                      </button>
                      <button className="btn btn-primary" type="submit">
                        Lưu
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      Cập nhật
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
