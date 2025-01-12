import React, { useEffect, useState } from 'react'
import './Profile.css'
import { Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { GetUserLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { translateRoleToVietnamese } from '../../../Utils/TranslateRole';
import { formatAddress } from '../../../Utils/FormatAddress';
import EditProfileModal from '../../Modal/EditProfileModal';

const Profile_2 = () => {
  const { userProfile } = useSelector((state) => state.UserReducer);
  console.log(userProfile)
  const dispatch = useDispatch();
  const formattedAddress = formatAddress(userProfile.agency?.address);
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const showModalEdit = () => setEditProfileOpen(true);
  const closeModalEdit = () => setEditProfileOpen(false);


  useEffect(() => {
      dispatch(GetUserLoginActionAsync());
    }, [dispatch]);

  return (
    <Card className='emp-profile'>
      <div className="row">
        <div className="col-md-4">
          <div className="profile-img">
            <img src={userProfile.urlImage || "/assets/images/profile/user-1.jpg"} alt />
          </div>
        </div>
        <div className="col-md-6">
          <div className="profile-head">
            <h5>
              {userProfile?.fullName}
            </h5>
            <h6>
              {translateRoleToVietnamese(userProfile?.role)}
            </h6>
            <p className="proile-rating">Chi nhánh : <span>{formattedAddress}</span></p>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Chi tiết</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Lớp học đăng ký</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary" onClick={showModalEdit}>Cập nhật</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="profile-work">
            <p>WORK LINK</p>
            <a href="#">Website Link</a><br />
            <a href="#">Bootsnipp Profile</a><br />
            <a href="#">Bootply Profile</a>
            <p>SKILLS</p>
            <a href="#">Web Designer</a><br />
            <a href="#">Web Developer</a><br />
            <a href="#">WordPress</a><br />
            <a href="#">WooCommerce</a><br />
            <a href="#">PHP, .Net</a><br />
          </div>
        </div>
        <div className="col-md-8">
          <div className="tab-content profile-tab" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <div className="row">
                <div className="col-md-6">
                  <label>Họ và tên</label>
                </div>
                <div className="col-md-6">
                  <p>{userProfile?.fullName}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Email</label>
                </div>
                <div className="col-md-6">
                  <p>{userProfile?.email}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Số điện thoại</label>
                </div>
                <div className="col-md-6">
                  <p>{userProfile?.phoneNumber}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Giới tính</label>
                </div>
                <div className="col-md-6">
                  <p>{userProfile?.gender === 'Female' ? 'Nữ' : 'Nam'}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Ngày sinh</label>
                </div>
                <div className="col-md-6">
                  <p>{new Date(userProfile?.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <div className="row">
                <div className="col-md-6">
                  <label>Experience</label>
                </div>
                <div className="col-md-6">
                  <p>Expert</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Hourly Rate</label>
                </div>
                <div className="col-md-6">
                  <p>10$/hr</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Total Projects</label>
                </div>
                <div className="col-md-6">
                  <p>230</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>English Level</label>
                </div>
                <div className="col-md-6">
                  <p>Expert</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Availability</label>
                </div>
                <div className="col-md-6">
                  <p>6 months</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label>Your Bio</label><br />
                  <p>Your detail description</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        visible={editProfileOpen}
        onClose={closeModalEdit}
      />
    </Card>
  )
}

export default Profile_2
