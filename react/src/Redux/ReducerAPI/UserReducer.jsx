import { createSlice } from "@reduxjs/toolkit";
import { httpClient, USER_LOGIN } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetAssignmentDetailByIdActionAsync } from "./AssignmentReducer";
import { getDataJSONStorage, setDataJSONStorage } from "../../Utils/UtilsFunction";
import { setUserLogin } from "./AuthenticationReducer";
import { GetAssignmentsByClassIdActionAsync } from "./ClassReducer";

const initialState = {
  userData: [],
  userProfile: {},
  schedules: [],
  classOfUserLogin: [],
  userManager: [],
  taskUser: [],
  totalPagesCount: 0,
  accounts: [],
  totalItemsCount: 0,
  materialClass: {},
  scoreData: []
};

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setCLassOfUserLogin: (state, action) => {
      state.classOfUserLogin = action.payload;
    },
    setUserManager: (state, action) => {
      state.userManager = action.payload;
    },
    setTaskUser: (state, action) => {
      state.taskUser = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload.items;
      state.totalItemsCount = action.payload.totalItemsCount;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setMaterialClass: (state, action) => {
      state.materialClass = action.payload;
    },
    setScoreData: (state, action) => {
      state.scoreData = action.payload
    }
  },
});

export const {
  setUserData,
  setUserProfile,
  setSchedules,
  setCLassOfUserLogin, setAccounts,
  setUserManager,
  setTaskUser,
  setMaterialClass,
  setScoreData
} = UserReducer.actions;

export default UserReducer.reducer;
//------------API-CALL-------
export const CreateUserActionAsync = (user) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, user);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
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

export const CreateUserUploadFileActionAsync = (file) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/agency-manager/api/v1/users/files`,
        file
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
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

export const ChangePasswordActionAsync = (passwordData) => {
  return async (dispatch) => {
    try {
      // Gọi API đổi mật khẩu
      console.log(passwordData);
      const res = await httpClient.post(
        `/api/v1/users/change-password`,
        passwordData
      );

      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const GetUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        dispatch(setUserProfile(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetCheckStatusAgencyLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        const agencyLogin = getDataJSONStorage(USER_LOGIN);
        console.log("đang check")
        if (agencyLogin?.status && res.data.status !== agencyLogin.status) { // kiểm tra status re.data.status trả về có giống statusAgencyLogin hay ko
          const updatedAgencyLogin = { ...agencyLogin, status: res.data.status };
          setDataJSONStorage(USER_LOGIN, updatedAgencyLogin);

          dispatch(setUserLogin(updatedAgencyLogin));
        }
        //
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetClassSchedulesByLoginActionAsync = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      console.log(
        "GetClassSchedulesByLoginActionAsync, startDate: ",
        startDate
      );
      console.log("GetClassSchedulesByLoginActionAsync, endDate: ", endDate);
      const response = await httpClient.get(
        `/api/v1/users/mine/class-schedules`,
        {
          params: {
            startTime: startDate,
            endTime: endDate,
          },
        }
      );
      if (response.isSuccess) {
        dispatch(setSchedules(response.data));
        console.log(
          "GetClassSchedulesByLoginActionAsync, response: ",
          response.data
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy lịch học, vui lòng thử lại sau.");
    }
  };
};

export const GetClassOfUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/classes`);
      if (res.isSuccess && res.data) {
        dispatch(setCLassOfUserLogin(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetManagerUserAddAppointmentActionAsync = (filter) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/manager/api/v1/users`, {
        params: {
          StartTime: filter.startTimeFilter,
          EndTime: filter.endTimeFilter,
        },
      });
      const filteredUsers = res.data.filter((user) =>
        ["Manager", "SystemInstructor", "SystemTechnician", "AgencyManager", "SystemConsultant"].includes(user.role)
      );
      dispatch(setUserManager(filteredUsers));
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetTaskUserByLoginActionAsync = (search, level, status, submit, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/works`, {
        params: { Search: search, Level: level, Status: status, Submit: submit, PageIndex: pageIndex, PageSize: pageSize }
      });
      console.log("GetTaskUserByLoginActionAsync, response: ", res.data);
      dispatch(setTaskUser(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const StudentSubmitAssignmentActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/api/v1/users/mine/assignments`,
        null, { params: { assignmentId: data.assignmentId, fileSubmitUrl: data.fileUrl, fileSubmitName: data.fileName } });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetAssignmentDetailByIdActionAsync(data.assignmentId))
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
}

export const InstructorGradeForAssignmentActionAsync = (usersScores, classId) => {
  return async (dispatch) => {
    try {
      // Create an array of POST request promises for each score
      const promises = usersScores.map((dataScore) =>
        httpClient.post(`/instructor/api/v1/scores`, dataScore)
      );

      // Wait for all requests to complete using Promise.all
      const responses = await Promise.all(promises);

      // Check if all responses are successful
      const allSuccessful = responses.every(res => res.isSuccess && res.data);

      if (allSuccessful) {
        message.success('Chấm điểm thành công!');
        await dispatch(GetAssignmentsByClassIdActionAsync(classId)); // Dispatch the action after successful submission
        return true;
      } else {
        message.error('There was an issue with one or more submissions');
        return false;
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while submitting scores');
      return false;
    }
  };
};


export const GetAccountsActionAsync = (search, isActive, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/agency-manager/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const GetAdminAccountsActionAsync = (search, isActive, agencyId, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/admin/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          AgencyId: agencyId,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const CreateAccountByAgencyManagerActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAgencyManagerActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAdminActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAdminActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const CreateAccountByAdminActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/admin/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAgencyManagerActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserAccountByLoginActionAsync = (dataUpdate) => {
  return async (dispatch) => {
    try {
      const currentUser = getDataJSONStorage(USER_LOGIN)
      const res = await httpClient.put(`/api/v1/users`, dataUpdate);
      if (res.isSuccess && res.data) {
        const updatedUser = { ...currentUser, ...dataUpdate };
        await Promise.all([
          dispatch(GetUserLoginActionAsync()),
          dispatch(setUserLogin(updatedUser))
        ]);
        setDataJSONStorage(USER_LOGIN, updatedUser)
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const GetClassMaterialOfUserLoginActionAsync = (courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/courses/${courseId}`);
      if (res.isSuccess && res.data) {
        dispatch(setMaterialClass(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetScoreOfClassForStudentActionAsync = (classId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/classes/${classId}/assessments`);
      if (res.isSuccess && res.data) {
        const score = res.data; // Tạo biến score chứa res.data

        const scoreData = [
          // Tính toán trực tiếp các điểm từ response của API
          // Attendance
          {
            key: 'attendance',
            category: score.assessmentAttendanceView.content,
            item: 'Điểm danh',
            weight: score.assessmentAttendanceView.weight,
            completionCriteria: score.assessmentAttendanceView.completionCriteria,
            score: score.assessmentAttendanceView.score,
            type: 'attendance',
            isFirst: true,
          },
          {
            key: 'attendanceTotal',
            category: score.assessmentAttendanceView.content,
            item: 'Tổng điểm danh',
            weight: score.assessmentAttendanceView.weight,
            completionCriteria: score.assessmentAttendanceView.completionCriteria,
            score: score.assessmentAttendanceView.score,
            isTotal: true,
            type: 'attendance',
          },
          // Quiz
          ...score.assessmentQuizView.quizzes.map((quiz, index) => ({
            key: `quiz${index}`,
            category: score.assessmentQuizView.content,
            item: quiz.title,
            weight: quiz.weight,
            completionCriteria: score.assessmentQuizView.completionCriteria,
            score: quiz.score,
            type: 'quiz',
            isFirst: index === 0,
          })),
          {
            key: 'quizTotal',
            category: score.assessmentQuizView.content,
            item: 'Tổng kiểm tra',
            weight: score.assessmentQuizView.weight,
            completionCriteria: score.assessmentQuizView.completionCriteria,
            score: score.assessmentQuizView.score,
            isTotal: true,
            type: 'quiz',
          },
          // Assignment
          ...score.assessmentAssignmentView.assignments.map((assignment, index) => ({
            key: `assignment${index}`,
            category: score.assessmentAssignmentView.content,
            item: assignment.title,
            weight: assignment.weight,
            completionCriteria: score.assessmentAssignmentView.completionCriteria,
            score: assignment.score,
            type: 'assignment',
            isFirst: index === 0,
          })),
          {
            key: 'assignmentTotal',
            category: score.assessmentAssignmentView.content,
            item: 'Tổng bài tập',
            weight: score.assessmentAssignmentView.weight,
            completionCriteria: score.assessmentAssignmentView.completionCriteria,
            score: score.assessmentAssignmentView.score,
            isTotal: true,
            type: 'assignment',
          },
          // Final
          ...score.assessmentFinalViewModel.finals.map((final, index) => ({
            key: `final${index}`,
            category: score.assessmentFinalViewModel.content,
            item: final.title,
            weight: final.weight,
            completionCriteria: score.assessmentFinalViewModel.completionCriteria,
            score: final.score,
            type: 'final',
            isFirst: index === 0,
          })),
          {
            key: 'finalTotal',
            category: score.assessmentFinalViewModel.content,
            item: 'Tổng cuối khóa',
            weight: score.assessmentFinalViewModel.weight,
            completionCriteria: score.assessmentFinalViewModel.completionCriteria,
            score: score.assessmentFinalViewModel.score,
            isTotal: true,
            type: 'final',
          },
          // Average
          {
            key: 'average',
            category: 'Điểm trung bình',
            item: '',
            weight: 100, // Set to 100% for average row
            completionCriteria: 5,
            score: score.averageScore,
            isTotal: true,
            type: 'average',
          },
        ];

        // Dispatch mảng scoreData đã tính toán
        dispatch(setScoreData(scoreData)); // Dispatch vào Redux state
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const RegisterCourseStudentActionAsync = (classId) => {
  return async (dispatch) => {
      try {
          const res = await httpClient.post(`/api/v1/users/mine/class`, null, {params: {classId}});
          if (res.isSuccess && res.data) {
              message.success(`${res.message}`);
              return { isSuccess: res.isSuccess, data: res.data, message: res.message };
          } else if (res.isSuccess && !res.data) {
              message.error(`${res.message}`);
              return { isSuccess: res.isSuccess, data: null, message: res.message };
          } else {
              throw new Error(`${res.message}`);
          }
      } catch (error) {
          console.error(error);
          // Hiển thị thông báo lỗi nếu không kết nối được tới server
          message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
          return { isSuccess: false, data: null, message: error.message };
      }
  };
};

export const MarkChapterMaterialByIdActionAsync = (data, courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/users/chapter-materials`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetClassMaterialOfUserLoginActionAsync(courseId))
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};
