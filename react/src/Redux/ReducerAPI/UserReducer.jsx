import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  userData: [],
  userProfile: {},
  schedules: [],
  classOfUserLogin: [],
  accounts: [],
  totalItemsCount: 0
};

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setCLassOfUserLogin: (state, action) => {
      state.classOfUserLogin = action.payload
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload.items;
      state.totalItemsCount = action.payload.totalItemsCount;
    }
  },
});

export const { setUserData, setUserProfile, setSchedules, setCLassOfUserLogin, setAccounts } = UserReducer.actions;

export default UserReducer.reducer;
//------------API-CALL-------
export const CreateUserActionAsync = (user) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, user);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const CreateUserUploadFileActionAsync = (file) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/agency-manager/api/v1/users/files`,
        file
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const ChangePasswordActionAsync = (passwordData) => {
  return async (dispatch) => {
    try {
      // Gọi API đổi mật khẩu
      console.log(passwordData);
      const res = await httpClient.post(`/api/v1/users/change-password`, passwordData);

      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const GetUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        dispatch(setUserProfile(res.data))
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetClassSchedulesByLoginActionAsync = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      console.log("GetClassSchedulesByLoginActionAsync, startDate: ", startDate);
      console.log("GetClassSchedulesByLoginActionAsync, endDate: ", endDate);
      const response = await httpClient.get(`/api/v1/users/mine/class-schedules`, {
        params: {
          startTime: startDate,
          endTime: endDate,
        },
      });
      if (response.isSuccess) {
        dispatch(setSchedules(response.data));
        console.log("GetClassSchedulesByLoginActionAsync, response: ", response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy lịch học, vui lòng thử lại sau.");
    }
  };
};

export const GetClassOfStudentLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/classes`);
      if (res.isSuccess && res.data) {
        dispatch(setCLassOfUserLogin(res.data))
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetAccountsActionAsync = (search, isActive, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/agency-manager/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const GetAdminAccountsActionAsync = (search, isActive, agencyId, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/admin/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          AgencyId: agencyId,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const CreateAccountByAgencyManagerActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAgencyManagerActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAdminActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAgencyManagerActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

