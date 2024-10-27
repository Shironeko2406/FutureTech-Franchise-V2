import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { GetCourseByIdActionAsync } from "./CourseReducer";
import { httpClient } from "../../Utils/Interceptors";

const initialState = {};

const ChapterReducer = createSlice({
  name: "ChapterReducer",
  initialState,
  reducers: {},
});

export const {} = ChapterReducer.actions;

export default ChapterReducer.reducer;
//-------API-CALL-------------
export const CreateChapterActionAsync = (chapter) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/chapters`, chapter);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetCourseByIdActionAsync(chapter.courseId));
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

export const DeleteChapterActionAsync = (chapterId, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/chapters/${chapterId}`);
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

export const EditChapterByIdActionAsync = (chapterId, dataEdit, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/chapters/${chapterId}`, dataEdit);
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
