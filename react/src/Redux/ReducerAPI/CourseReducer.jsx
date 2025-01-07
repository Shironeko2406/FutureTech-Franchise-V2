import { createSlice } from "@reduxjs/toolkit";
import { httpClient, USER_LOGIN } from "../../Utils/Interceptors";
import { message } from "antd";
import { getDataJSONStorage } from "../../Utils/UtilsFunction";
import { formatCourseData } from "../../Utils/FormatCourseData";

const initialState = {
  course: [],
  courseById: {},
  chapters: [],
  assessments: [],
  courseMaterials: [],
  totalPagesCount: 0,
  percentCourseProgress: 0,
  courseNewVer: '',
  courseOldVer: '',
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
      state.chapters = action.payload.chapters;
      state.assessments = action.payload.assessments;
      state.courseMaterials = action.payload.courseMaterials;
    },
    setPercentCourseProgress: (state, action) => {
      state.percentCourseProgress = action.payload
    },
    setCourseNewVer: (state, action) => {
      state.courseNewVer = action.payload
    },
    setCourseOldVer: (state, action) => {
      state.courseOldVer = action.payload
    }
  },
});

export const { setCourse, setCourseById, setPercentCourseProgress, setCourseNewVer, setCourseOldVer } = CourseReducer.actions;

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

//-----------TEST----------------------

export const GetCourseTestActionAsync = (search, status, pageIndex, pageSize) => {
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
//--------------------------------------



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

export const UpdateCourseByIdActionAsync = (
  data,
  courseId,
  status,
  pageIndex,
  pageSize,
  search
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/courses/${courseId}`, data);
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
        `/api/v1/courses/files`,
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

export const GetAllCoursesAvailableActionAsync = () => {
  return async (dispatch) => {
    try {
      const response = await httpClient.get(`api/v1/courses/available`);
      if (response.isSuccess) {
        dispatch(setCourse({ items: response.data }))
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Đã xảy ra lỗi khi lấy danh sách khóa học!");
    }
  }
};

export const GetPercentCourseActionAsync = (courseId) => {
  return async (dispatch) => {
    try {
      const userId = getDataJSONStorage(USER_LOGIN).id
      const response = await httpClient.get(`api/v1/courses/${courseId}/users/${userId}/percents`);
      if (response.isSuccess) {
        dispatch(setPercentCourseProgress(response.data))
      } else {
        message.error(`${response.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi hệ thống!");
    }
  }
};

export const GetCourseCurrentVerByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/courses/${id}`);
      dispatch(setCourseNewVer(formatCourseData(res.data)));
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetCourseOldVerByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/courses/${id}/old-versions`);
      dispatch(setCourseOldVer(formatCourseData(res.data)));
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
};

;