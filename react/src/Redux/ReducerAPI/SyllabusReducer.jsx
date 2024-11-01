import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { GetCourseByIdActionAsync } from "./CourseReducer";
import { message } from "antd";

const initialState = {};

const SyllabusReducer = createSlice({
  name: "SyllabusReducer",
  initialState,
  reducers: {},
});

export const {} = SyllabusReducer.actions;

export default SyllabusReducer.reducer;
//---------API-CALL------------
export const CreateSyllabusActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/syllabuses`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetCourseByIdActionAsync(data.courseId));
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

export const EditSyllabusActionAsync = (data, syllabusId, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/syllabuses/${syllabusId}`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetCourseByIdActionAsync(courseId));
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

export const DelateSyllabusActionAsync = (syllabusId, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/syllabuses/${syllabusId}`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetCourseByIdActionAsync(courseId));
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
