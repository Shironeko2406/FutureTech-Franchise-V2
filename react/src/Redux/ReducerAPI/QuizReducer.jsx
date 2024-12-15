import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetQuizDataAndScoreByClassIdActionAsync } from "./ClassReducer";

const initialState = {
  quizReview: {},
  quizData: {},
};

const QuizReducer = createSlice({
  name: "QuizReducer",
  initialState,
  reducers: {
    setQuizReview: (state, action) => {
      state.quizReview = action.payload;
    },
    setQuizQuestion: (state, action) => {
      state.quizData = action.payload;
    },
  },
});

export const { setQuizReview, setQuizQuestion } = QuizReducer.actions;

export default QuizReducer.reducer;
//------------API CALL-------------
export const GetQuizReviewByIdActionAsync = (quizId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/quizzes/${quizId}`);
      dispatch(setQuizReview(res.data));
    } catch (error) {
      console.log(error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
};

export const GetQuizStudentTestActionAsync = (quizId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/quizzes/${quizId}/details`);
      dispatch(setQuizQuestion(res.data));
    } catch (error) {
      console.log(error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
};

export const SubmitQuizActionAsync = (quizId, dataOption) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/student/api/v1/quizzes/${quizId}`,
        dataOption
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);

        return true;
      } else {
        message.error(`Đã có lỗi xảy ra, vui lòng thử lại sau!`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
};

export const CreateQuizActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/quizzes`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetQuizDataAndScoreByClassIdActionAsync(data.classId));
        return true;
      } else {
        message.error(`Đã có lỗi xảy ra, vui lòng thử lại sau!`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
};

export const DeleteQuizByIdActionAsync = (classId, quizId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/quizzes/${classId}`, {
        params: {
          quizId: quizId,
        },
      });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetQuizDataAndScoreByClassIdActionAsync(classId));
        return true;
      } else {
        message.error(`Đã có lỗi xảy ra, vui lòng thử lại sau!`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
};

export const EditQuizByIdActionAsync = (quizId, dataEdit, classId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/quizzes/${quizId}`, dataEdit);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetQuizDataAndScoreByClassIdActionAsync(classId));
        return true;
      } else {
        message.error(`Đã có lỗi xảy ra, vui lòng thử lại sau!`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };
};
