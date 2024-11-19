import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';
import { GetTaskByAgencyIdActionAsync } from './AgencyReducer';

const initialState = {
  taskDetail: {}
}

const WorkReducer = createSlice({
  name: "WorkReducer",
  initialState,
  reducers: {
    setTaskDetail: (state, action) => {
      state.taskDetail = action. payload
    }
  }
});

export const {setTaskDetail} = WorkReducer.actions

export default WorkReducer.reducer
//------------API CALL----------------
export const CreateTaskActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/works`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskByAgencyIdActionAsync(data.agencyId));
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

export const GetTaskDetailByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/works/${id}`);
      dispatch(setTaskDetail(res.data))
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const UpdateStatusTaskByIdActionAsync = (id, status, agencyId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/manager/api/v1/works/${id}`, null, {params: {status: status}});
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await Promise.all([
          dispatch(GetTaskDetailByIdActionAsync(id)),
          dispatch(GetTaskByAgencyIdActionAsync(agencyId))
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