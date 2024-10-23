import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  course: [],
  courseById: {},
  totalPagesCount: 0
};

const CourseReducer = createSlice({
  name: "CourseReducer",
  initialState,
  reducers: {
    setCourse: (state, action)=>{
      state.course = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount
    },
    setCourseById: (state, action)=>{
      state.courseById = action.payload
    }
  },
});

export const {setCourse, setCourseById} = CourseReducer.actions;

export default CourseReducer.reducer;
//---------API CALL-------------
export const GetCourseActionAsync = (search, status, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/courses`, {
        params: {Search:search, Status: status, PageIndex: pageIndex, PageSize: pageSize }
      });
      console.log(res.data);
      dispatch(setCourse(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetCourseByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/courses/${id}`);
      dispatch(setCourseById(res.data));
      console.log(res.data)
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateCourseActionAsync = (data, status, pageIndex, pageSize, search) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/courses`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetCourseActionAsync(search, status, pageIndex, pageSize))
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

export const UpdateStatusCourseActionAsync = (courseId, statusUpdate, search, status, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/courses/${courseId}/status`, null, {
        params: {courseStatusEnum: statusUpdate }
      });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetCourseActionAsync(search, status, pageIndex, pageSize))
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
