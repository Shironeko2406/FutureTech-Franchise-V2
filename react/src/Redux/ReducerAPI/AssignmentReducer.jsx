import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';
import { httpClient } from '../../Utils/Interceptors';
import { GetAssignmentsByClassIdActionAsync } from './ClassReducer';

const initialState = {
  assignments: [],
  studentAssignmentOfClass: [],
  assignmentDetail: {}
}

const AssignmentReducer = createSlice({
  name: "AssignmentReducer",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload
    },
    setStudentAssignmentOfClass: (state, action) => {
      state.studentAssignmentOfClass = action.payload
    },
    setAssignmentDetail: (state, action) => {
      state.assignmentDetail = action.payload
    },
  }
});

export const {setAssignments, setStudentAssignmentOfClass, setAssignmentDetail} = AssignmentReducer.actions

export default AssignmentReducer.reducer
//--------API CALL--------------
export const CreateAssignmentActionAsync = (data) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.post(`/api/v1/assignments`, data);
        if (res.isSuccess && res.data) {
          message.success(`${res.message}`);
          await dispatch(GetAssignmentsByClassIdActionAsync(data.classId));
          return true;
        } else {
          message.error(`${res.message}`);
          return false;
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };
  };

  export const UpdateAssignmentActionAsync = (dataUpdate, id) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.put(`/api/v1/assignments/${id}`, dataUpdate);
        if (res.isSuccess && res.data) {
          message.success(`${res.message}`);
          await dispatch(GetAssignmentsByClassIdActionAsync(dataUpdate.classId));
          return true;
        } else {
          message.error(`${res.message}`);
          return false;
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };
  };

  export const DeleteAssignmentActionAsync = (assId, classId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.delete(`/api/v1/assignments/${assId}`);
        if (res.isSuccess && res.data) {
          message.success(`${res.message}`);
          await dispatch(GetAssignmentsByClassIdActionAsync(classId));
          return true;
        } else {
          message.error(`${res.message}`);
          return false;
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };
  };

  // export const GetAssignmentsByClassIdActionAsync = (classId) => {
  //   return async (dispatch) => {
  //     try {
  //       const res = await httpClient.get(`/api/v1/assignments/classes/${classId}`);
  //       dispatch(setAssignments(res.data))
  //     } catch (error) {
  //       console.log(error);
  //       message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
  //     }
  //   };
  // };

  export const GetStudentAssignmentsByClassIdActionAsync = (classId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.get(`/student/api/v1/assignments/classes/${classId}`);
        dispatch(setStudentAssignmentOfClass(res.data))
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };
  };

  export const GetAssignmentDetailByIdActionAsync = (assId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.get(`/student/api/v1/assignment/${assId}`);
        dispatch(setAssignmentDetail(res.data))
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };
  };

