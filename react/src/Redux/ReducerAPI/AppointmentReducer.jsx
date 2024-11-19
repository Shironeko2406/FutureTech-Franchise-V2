import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';
import { GetTaskDetailByIdActionAsync } from './WorkReducer';

const initialState = {

}

const AppointmentReducer = createSlice({
  name: "AppointmentReducer",
  initialState,
  reducers: {}
});

export const {} = AppointmentReducer.actions

export default AppointmentReducer.reducer
//------------API CALL----------------
export const CreateAppointmentActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/appointments`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskDetailByIdActionAsync(data.workId));
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