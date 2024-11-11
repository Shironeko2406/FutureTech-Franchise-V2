import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';
import { GetQuestionBankByChapterId } from './ChapterReducer';

const initialState = {

}

const QuestionReducer = createSlice({
  name: "QuestionReducer",
  initialState,
  reducers: {}
});

export const {} = QuestionReducer.actions

export default QuestionReducer.reducer
//-----------API CALL-------------
export const DeleteQuestionByIdActionAsync = (questionId, chapterId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.delete(`/api/v1/questions/${questionId}`);
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