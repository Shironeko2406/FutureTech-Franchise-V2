import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { GetCourseByIdActionAsync } from "./CourseReducer";
import { httpClient } from "../../Utils/Interceptors";

const initialState = {
  questionsOfChapter: []
};

const ChapterReducer = createSlice({
  name: "ChapterReducer",
  initialState,
  reducers: {
    setQuestionsOfChapter: (state, action) => {
      state.questionsOfChapter = action.payload
    }
  },
});

export const {setQuestionsOfChapter} = ChapterReducer.actions;

export default ChapterReducer.reducer;
//-------API-CALL-------------
export const CreateChapterActionAsync = (chapter) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/chapters`, chapter);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetCourseByIdActionAsync(chapter.courseId));
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
        await dispatch(GetCourseByIdActionAsync(courseId));
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
        await dispatch(GetCourseByIdActionAsync(courseId));
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

export const GetQuestionBankByChapterId = (chapterId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/chapters/${chapterId}/questions`);
      dispatch(setQuestionsOfChapter(res.data))
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateQuestionChapterByIdActionAsync = (chapterId, data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/chapters/${chapterId}/questions`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetQuestionBankByChapterId(chapterId));
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