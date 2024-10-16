import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { GetUserLoginActionAsync } from "../../../Redux/ReducerAPI/UserReducer";

const user = {
  id: "bd8cdbbf-a88d-4a60-b273-883444cc93c4",
  role: "Administrator",
  userName: "Administrator",
  email: "nthieu24062002@gmail.com",
  fullName: "Nguyễn Trung Hiếu",
  about: "This is my bio.",
};

const Profile = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.UserReducer);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(GetUserLoginActionAsync());
  }, []);

  const userUpdate = useFormik({
    initialValues: {
      userName: userProfile.userName || "",
      email: userProfile.email || "",
      fullName: userProfile.fullName || "",
      about: "",
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
                    src={userProfile?.urlImage}
                    alt="Description of image"
                    style={{
                      width: "140px",
                      height: "140px",
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
                <div className="mt-2">
                  <button className="btn btn-primary" type="button">
                    <i className="fa fa-fw fa-camera" />
                    <span>Change Photo</span>
                  </button>
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
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Full Name</label>
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
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Username</label>
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
                <div className="col-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      readOnly={!isEditing}
                      value={userUpdate.values.email}
                      onChange={userUpdate.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col mb-3">
                  <div className="form-group">
                    <label>About</label>
                    <textarea
                      className="form-control"
                      name="about"
                      rows={5}
                      readOnly={!isEditing}
                      value={userUpdate.values.about}
                      onChange={userUpdate.handleChange}
                    />
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
                        Cancel
                      </button>
                      <button className="btn btn-primary" type="submit">
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      Update
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
