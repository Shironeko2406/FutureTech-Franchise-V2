import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";
import { setAssignments } from "./AssignmentReducer";

const initialState = {
    instructors: [],
    quizOfClassStudent: [],
    classDetail: {},
    chapterFilter: [],
    quizData: [],
    classes: [],
    totalPagesCount: 0,
    availableClasses: []
};

const ClassReducer = createSlice({
    name: "ClassReducer",
    initialState,
    reducers: {
        setInstructors: (state, action) => {
            state.instructors = action.payload;
        },
        setClasses: (state, action) => {
            state.classes = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
        setClassDetail: (state, action) => {
            state.classDetail = action.payload;
        },
        setQuizOfClassStudent: (state, action) => {
            state.quizOfClassStudent = action.payload;
        },
        setChapterFilter: (state, action) => {
            state.chapterFilter = action.payload
        },
        setQuizData: (state, action) => {
            state.quizData = action.payload
        },
        setAvailableClasses: (state, action) => {
            state.availableClasses = action.payload;
        },
    },
});

export const { setInstructors, setClasses, setClass, setClassDetail, setQuizOfClassStudent, setChapterFilter, setQuizData, setAvailableClasses } = ClassReducer.actions;

export default ClassReducer.reducer;
//---------API CALL-------------

export const GetAssignmentsByClassIdActionAsync = (classId) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.get(`/api/v1/classes/${classId}/assignments`);
        dispatch(setAssignments(res.data))
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };
  };

export const GetClassesActionAsync = (pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/classes/filter`, {
                params: {
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                },
            });
            console.log("GetClassesActionAsync: ", res.data);
            dispatch(setClasses(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};


export const GetAllInstructorsAvailableActionAsync = () => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/agencies/instructors`);
            if (res.isSuccess) {
                dispatch(setInstructors(res.data))
            } else {
                throw new Error(res.message)
            }
        } catch (error) {
            console.error("Error fetching agencies:", error);
            message.error("Đã xảy ra lỗi khi lấy danh sách giảng viên!");
        }
    }
};

export const CreateClassActionAsync = (classData) => {
    return async (dispatch) => {
        console.log("CreateClassActionAsync:", classData);
        try {
            const res = await httpClient.post(`/api/v1/classes`, classData);
            if (res.isSuccess && res.data != null) {
                message.success("Tạo lớp học thành công!");
                return res;
            } else if (res.isSuccess && res.data == null) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    }
};

export const GetClassDetailActionAsync = (id) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/classes/${id}`);
            if (res.isSuccess) {
                console.log("res:", res.data)
                dispatch(setClassDetail(res.data));
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
            message.error("Đã xảy ra lỗi khi lấy thông tin lớp học!");
        }
    };
};

export const UpdateClassStatusActionAsync = (id, newStatus) => {
    return async () => {
        try {
            const res = await httpClient.patch(`api/v1/classes/${id}/status?status=${newStatus}`);
            if (res.isSuccess && res.data) {
                message.success(`${res.message}`);
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

export const UpdateClassActionAsync = (classId, classData) => {
    return async () => {
        try {
            const res = await httpClient.put(`/api/v1/classes/${classId}`, classData);
            console.log("UpdateClassActionAsync:", res);
            if (res.isSuccess && res.data) {
                message.success(`${res.message}`);
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

export const GetQuizByClassIdStudentActionAsync = (classId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/student/api/v1/classes/${classId}/quizzes`);
            if (res.isSuccess) {
                console.log("res:", res.data)
                dispatch(setQuizOfClassStudent(res.data));
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
            message.error("Đã xảy ra lỗi khi lấy thông tin lớp học!");
        }
    };
};

export const GetChapterFilterByClassIdActionAsync = (classId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/classes/${classId}/chapters`);
            if (res.isSuccess) {
                dispatch(setChapterFilter(res.data));
            } else {
                message.error("Đã xảy ra lỗi khi lấy thông tin lớp học!");
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
            message.error("Đã xảy ra lỗi khi lấy thông tin lớp học!");
        }
    };
};

export const GetQuizDataAndScoreByClassIdActionAsync = (classId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/instructor/api/v1/classes/${classId}/quizzes`);
            if (res.isSuccess) {
                dispatch(setQuizData(res.data));
            } else {
                message.error("Đã xảy ra lỗi khi lấy thông tin bài kiểm tra!");
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
            message.error("Đã xảy ra lỗi khi lấy thông tin bài kiểm tra!");
        }
    };
};

export const GetAvailableClassesByCourseIdActionAsync = (courseId) => {
    return async (dispatch) => {
        try {
            console.log("GetAvailableClassesByCourseIdActionAsync: courseId", courseId)
            const res = await httpClient.get(`/api/v1/classes/courses/${courseId}`);
            console.log("GetAvailableClassesByCourseIdActionAsync: res", res)

            if (res.isSuccess) {
                dispatch(setAvailableClasses(res.data));
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("Error fetching available classes:", error);
            message.error("Đã xảy ra lỗi khi lấy danh sách lớp học!");
        }
    };
};

export const AddStudentsToClassActionAsync = (classId, studentIds) => {
    return async () => {
        try {
            const res = await httpClient.post(`/api/v1/classes/${classId}/users`, { studentId: studentIds });
            if (res.isSuccess && res.data) {
                message.success("Thêm học sinh vào lớp thành công!");
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

