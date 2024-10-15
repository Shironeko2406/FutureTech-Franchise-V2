import React from "react";

const Profile = () => {
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
                    src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-1/352800632_1718158735281941_3317771396889960595_n.jpg?stp=dst-jpg_s200x200&_nc_cat=108&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=gFMQupBqsFIQ7kNvgFS6y7a&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=Arb-HDX_s40_OKzOgoCXfgX&oh=00_AYBArqpyfBcvigvOpXXOGsxz2llcPvazMfOLIhRs3hBGMA&oe=6711AD91"
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
                <h4 className="pt-sm-2 pb-1 mb-0 text-nowrap">John Smith</h4>
                <p className="mb-0">@johnny.s</p>
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
                <span className="badge bg-secondary">administrator</span>
                <div className="text-muted">
                  <small>Joined 09 Dec 2017</small>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content pt-3">
            <form className="form">
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="John Smith"
                      defaultValue="John Smith"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control"
                      type="text"
                      name="username"
                      placeholder="johnny.s"
                      defaultValue="johnny.s"
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
                      placeholder="user@example.com"
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
                      rows={5}
                      placeholder="My Bio"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col d-flex justify-content-end">
                  <button className="btn btn-primary" type="submit">
                    Save Changes
                  </button>
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
