import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';
import { GetCourseByIdActionAsync } from './CourseReducer';
import { httpClient } from '../../Utils/Interceptors';

const initialState = {

}

const ChapterMaterialReducer = createSlice({
  name: "ChapterMaterialReducer",
  initialState,
  reducers: {}
});

export const {} = ChapterMaterialReducer.actions

export default ChapterMaterialReducer.reducer
//----------API CALL-----------------

export const CreateMaterialChapterIdActionAsync = (material, courseId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.post(`/api/v1/chapter-materials`, material);
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