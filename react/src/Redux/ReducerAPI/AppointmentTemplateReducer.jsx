import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';
import { GetTasksDetailByIdTemplateActionAsync } from './WorkTemplateReducer';

const initialState = {

}

const AppointmentTemplateReducer = createSlice({
  name: "AppointmentTemplateReducer",
  initialState,
  reducers: {}
});

export const {} = AppointmentTemplateReducer.actions

export default AppointmentTemplateReducer.reducer
//-------------API CALL-----------------
export const CreateAppointmentTemplateActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/appointment-templates`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTasksDetailByIdTemplateActionAsync(data.workId));
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

export const DeleteAppointmentTemplateByIdActionAsync = (appointmentId, workId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/appointment-templates/${appointmentId}`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTasksDetailByIdTemplateActionAsync(workId));
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

export const EditAppointmentTemplateByIdActionAsync = (appointmentId, dataEdit, workId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/appointment-templates/${appointmentId}`, dataEdit);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTasksDetailByIdTemplateActionAsync(workId));
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
