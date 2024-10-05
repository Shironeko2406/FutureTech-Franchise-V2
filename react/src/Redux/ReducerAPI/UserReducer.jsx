import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  userData: [],
};

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = UserReducer.actions;

export default UserReducer.reducer;
//------------API-CALL-------
export const CreateUserActionAsync = (user) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, user);
      console.log(res);
      message.success(`${res.message}`);
    } catch (error) {
      console.error(error);
    }
  };
};
