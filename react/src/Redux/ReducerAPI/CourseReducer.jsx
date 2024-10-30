import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  course: [],
  courseById: {},
  sessions: [],
  chapters: [],
  assessments: [],
  courseMaterials: [],
  totalPagesCount: 0,
};

const CourseReducer = createSlice({
  name: "CourseReducer",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setCourseById: (state, action) => {
      state.courseById = action.payload;
      state.sessions = action.payload.sessions;
      state.chapters = action.payload.chapters;
      state.assessments = action.payload.assessments;
      state.courseMaterials = action.payload.courseMaterials;
    },
  },
});

export const { setCourse, setCourseById } = CourseReducer.actions;

export default CourseReducer.reducer;
//---------API CALL-------------
export const GetCourseActionAsync = (search, status, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/courses`, {
        params: {
          Search: search,
          Status: status,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
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
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateCourseActionAsync = (
  data,
  status,
  pageIndex,
  pageSize,
  search
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/courses`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(
          GetCourseActionAsync(search, status, pageIndex, pageSize)
        );
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

export const UpdateStatusCourseActionAsync = (
  courseId,
  statusUpdate,
  search,
  status,
  pageIndex,
  pageSize
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(
        `/api/v1/courses/${courseId}/status`,
        null,
        {
          params: { courseStatusEnum: statusUpdate },
        }
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(
          GetCourseActionAsync(search, status, pageIndex, pageSize)
        );
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

export const CreateAssessmentActionAsync = (assessment, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/api/v1/courses/${courseId}/assessments`,
        assessment
      );
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

export const CreateSessionActionAsync = (session, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/api/v1/courses/${courseId}/sessions`,
        session
      );
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

export const CreateCourseDetailByFileActionAsync = (
  file,
  status,
  pageIndex,
  pageSize,
  search
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/api/v1/courses/api/v1/courses/files`,
        file
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(
          GetCourseActionAsync(search, status, pageIndex, pageSize)
        );
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

export const CreateCourseCloneByIdActionAsync = (
  courseId,
  status,
  pageIndex,
  pageSize,
  search
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/courses/${courseId}/versions`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(
          GetCourseActionAsync(search, status, pageIndex, pageSize)
        );
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

export const DeleteCourseByIdActionAsync = (
  courseId,
  status,
  pageIndex,
  pageSize,
  search
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/courses/${courseId}`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(
          GetCourseActionAsync(search, status, pageIndex, pageSize)
        );
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
