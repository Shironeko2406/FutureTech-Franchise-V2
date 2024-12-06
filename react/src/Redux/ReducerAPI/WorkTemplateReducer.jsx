import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';

const initialState = {
  tasksTemplate: [],
  taskDetailTemplate: {}
}

const WorkTemplateReducer = createSlice({
  name: "WorkTemplateReducer",
  initialState,
  reducers: {
    setTaskTemplate: (state, action) => {
      state.tasksTemplate = action.payload
    },
    setTaskDetailTemplate: (state, action) => {
      state.taskDetailTemplate = action.payload
    },
  }
});

export const {setTaskTemplate, setTaskDetailTemplate} = WorkTemplateReducer.actions

export default WorkTemplateReducer.reducer
//-------------API CALL---------
export const GetTasksTemplateActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/work-templates`);
      dispatch(setTaskTemplate(res.data));
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const GetTasksDetailByIdTemplateActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/work-templates/${id}`);
      dispatch(setTaskDetailTemplate(res.data));
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const CreateTaskTemplateActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/work-templates`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTasksTemplateActionAsync());
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

export const DeleteTaskTemplateByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/work-templates/${id}`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTasksTemplateActionAsync());
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

export const EditTaskTemplateByIdActionAsync = (dataUpdate, taskId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/work-templates/${taskId}`, dataUpdate);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTasksTemplateActionAsync());
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