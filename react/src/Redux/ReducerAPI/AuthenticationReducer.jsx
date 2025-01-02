import { createSlice } from "@reduxjs/toolkit";
import { httpClient, REFRESH_TOKEN, TOKEN_AUTHOR, USER_LOGIN } from "../../Utils/Interceptors";
import { getDataJSONStorage, setDataJSONStorage, setDataTextStorage } from "../../Utils/UtilsFunction";
import { message } from "antd";

const initialState = {
  userLogin: getDataJSONStorage(USER_LOGIN),
  statusAgency: getDataJSONStorage(USER_LOGIN)?.status || null
};

const AuthenticationReducer = createSlice({
  name: "AuthenticationReducer",
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      state.userLogin = action.payload,
        state.statusAgency = action.payload.status
    }
  },
});

export const { setUserLogin } = AuthenticationReducer.actions;

export default AuthenticationReducer.reducer;
//------------API CALL------------
export const LoginActionAsync = (dataLogin) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/auth/login`, dataLogin);
      if (res.data?.userViewModel) {
        dispatch(setUserLogin(res.data.userViewModel))
        setDataJSONStorage(USER_LOGIN, res.data.userViewModel);
        setDataTextStorage(TOKEN_AUTHOR, res.data.refreshTokenModel.accessToken);
        setDataTextStorage(REFRESH_TOKEN, res.data.refreshTokenModel.refreshToken);
        message.success(`${res.message}`);
      } else {
        message.error(`${res.message}`)
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred during login, please try again.");
    }
  };
};

export const RefreshTokenActionAsync = (refreshToken, accessToken) => {
  return async (dispatch) => {
    try {

      const res = await httpClient.put(`/api/v1/auth/new-token`, { refreshToken: refreshToken, accessToken: accessToken });
      if (res.isSuccess && res.data) {
        setDataTextStorage(TOKEN_AUTHOR, res.data.accessToken);
        setDataTextStorage(REFRESH_TOKEN, res.data.refreshToken);
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

export const OtpEmailActionAsync = (username) => {
  return async () => {
    try {
      const res = await httpClient.post(`/api/v1/auth/otp-email`, username);
      console.log(res)
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

export const ResetPasswordActionAsync = (dataResetPassword) => {
  return async () => {
    try {
      const res = await httpClient.post(`/api/v1/auth/reset-password`, dataResetPassword);
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
  }
};

export const VerifyPasswordActionAsync = (passwordData) => {
  return async () => {
    try {
      const res = await httpClient.post(`/api/v1/users/change-password`, passwordData);
      if (res.isSuccess && res.data) {
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      message.error(`Mật khẩu không đúng!`);
      return false;
    }
  };
};

