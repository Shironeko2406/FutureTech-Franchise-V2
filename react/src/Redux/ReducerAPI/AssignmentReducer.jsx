import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';
import { httpClient } from '../../Utils/Interceptors';

const initialState = {
  assignments: []
}

const AssignmentReducer = createSlice({
  name: "AssignmentReducer",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload
    }
  }
});

export const {setAssignments} = AssignmentReducer.actions

export default AssignmentReducer.reducer
//--------API CALL--------------
export const CreateAssignmentActionAsync = (data) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.post(`/api/v1/assignments`, data);
        if (res.isSuccess && res.data) {
          message.success(`${res.message}`);
        //   await dispatch(GetQuizDataAndScoreByClassIdActionAsync(data.classId));
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

  export const GetAssignmentsByClassIdActionAsync = (classId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.get(`/api/v1/assignments/classes/${classId}`);
        dispatch(setAssignments(res.data))
      } catch (error) {
        console.log(error);
        message.error("Lỗi hệ thống");
      }
    };
  };