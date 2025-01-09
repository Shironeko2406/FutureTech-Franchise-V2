import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  dashboardData: {},
};

const DashboardReducer = createSlice({
  name: 'DashboardReducer',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
  },
});

export const { setDashboardData } = DashboardReducer.actions;

export default DashboardReducer.reducer;

export const GetDashboardDataActionAsync = ({ from, to, year, topCourse }) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`api/v1/dashboard/revenues`, {
        params: { from, to, year, topCourse },
      });
      if (res.isSuccess && res.data) {
        dispatch(setDashboardData(res.data));
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi lấy dữ liệu dashboard!");
    }
  };
};