import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetTaskDetailByIdActionAsync } from "./WorkReducer";
import { CreateNotificationActionAsync } from "./NotificationReducer";

const initialState = {
  appointmentDetail: {},
  appointmentSchedules: [],
  selectedAppointment: null,
};

const AppointmentReducer = createSlice({
  name: "AppointmentReducer",
  initialState,
  reducers: {
    setAppointmentDetail: (state, action) => {
      state.appointmentDetail = action.payload;
    },
    setAppointmentSchedules: (state, action) => {
      state.appointmentSchedules = action.payload;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
  },
});

export const { setAppointmentDetail, setAppointmentSchedules, setSelectedAppointment } = AppointmentReducer.actions;

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
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error("CreateAppointmentActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
}

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

export const GetAppointmentSchedulesActionAsync = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/staff/api/v1/appointments`, {
        params: {
          StartTime: startDate,
          EndTime: endDate,
        },
      });
      if (res.isSuccess) {
        dispatch(setAppointmentSchedules(res.data));
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      // Hiển thị thông báo lỗi nếu không kết nối được tới server
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };
};

export const GetAppointmentByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/appointments/${id}`);
      if (res.isSuccess) {
        dispatch(setSelectedAppointment(res.data));
        console.log("GetAppointmentByIdActionAsync, response: ", res.data);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy chi tiết lịch hẹn, vui lòng thử lại sau.");
    }
  };
};

export const GetAppointmentSchedulesAgencyActionAsync = (startDate, endDate) => {
  console.log("GetAppointmentSchedulesAgencyActionAsync, startDate: ", startDate);
  console.log("GetAppointmentSchedulesAgencyActionAsync, endDate: ", endDate);
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/agency/api/v1/appointments`, {
        params: {
          StartTime: startDate,
          EndTime: endDate,
        },
      });
      if (res.isSuccess) {
        dispatch(setAppointmentSchedules(res.data));
        console.log("GetAppointmentSchedulesAgencyActionAsync, response: ", res.data);
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      // Hiển thị thông báo lỗi nếu không kết nối được tới server
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };
};