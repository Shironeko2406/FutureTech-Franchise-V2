import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from "../../Utils/Interceptors";

const initialState = {
    notificationData:[],
    countNotificationUnRead:0,
}

const NotificationReducer = createSlice({
  name: "NotificationReducer",
  initialState,
  reducers: {
    setNotificationData: (state, action) => {
      state.notificationData = action.payload
    },
    setCountNotificationUnRead: (state, action) => {
      state.countNotificationUnRead = action.payload
    }
  }
});

export const {setNotificationData, setCountNotificationUnRead} = NotificationReducer.actions

export default NotificationReducer.reducer
//-----API CALL--------------------
export const GetNotificationUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/notifications/mine`);
      dispatch(setNotificationData(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetNotificationUnReadOfUserActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/notifications`);
      dispatch(setCountNotificationUnRead(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const MarkNotificationReadActionAsync = (notificationIds) => {
  return async (dispatch) => {
    try {
      const requests = notificationIds.map(async (id) => {
        const res = await httpClient.post(`/api/v1/notifications/${id}`);
      });
      // Đợi tất cả các yêu cầu API hoàn thành
      await Promise.all(requests);
      dispatch(GetNotificationUnReadOfUserActionAsync());
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateNotificationActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/notifications`, data);
    } catch (error) {
      console.error(error);
    }
  };
};