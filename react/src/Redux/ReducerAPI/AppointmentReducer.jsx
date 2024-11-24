import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetTaskDetailByIdActionAsync } from "./WorkReducer";
import { CreateNotificationActionAsync } from "./NotificationReducer";

const initialState = {
  appointmentDetail: {},
};

const AppointmentReducer = createSlice({
  name: "AppointmentReducer",
  initialState,
  reducers: {
    setAppointmentDetail: (state, action) => {
      state.appointmentDetail = action.payload;
    },
  },
});

export const { setAppointmentDetail } = AppointmentReducer.actions;

export default AppointmentReducer.reducer;
//------------API CALL----------------
export const CreateAppointmentActionAsync = (data, notificationData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/appointments`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await Promise.all([
          dispatch(GetTaskDetailByIdActionAsync(data.workId)),
          dispatch(CreateNotificationActionAsync(notificationData)),
        ]);
        return true;
      } else {
        message.error(`Lỗi hệ thống`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const GetAppointmentDetailByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/appointments/${id}`);
      dispatch(setAppointmentDetail(res.data));
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const UpdateUserListInAppointmentActionAsync = (userList, appointmentId, notificationData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/appointments/${appointmentId}/users`, userList);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await Promise.all([
          dispatch(GetAppointmentDetailByIdActionAsync(appointmentId)),
          dispatch(CreateNotificationActionAsync(notificationData)),
        ]);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const DeleteAppointmentByIdActionAsync = (appointmentId, workId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/appointments/${appointmentId}`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskDetailByIdActionAsync(workId));
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const EditAppointmentByIdActionAsync = (appointmentId, dataEdit, workId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/appointments/${appointmentId}`, dataEdit);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskDetailByIdActionAsync(workId));
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};
