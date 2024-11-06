import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

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
      message.error("Lỗi hệ thống");
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
      message.error("Lỗi hệ thống");
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
        message.error(`Lỗi hệ thống`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};
