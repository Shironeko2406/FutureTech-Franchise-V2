import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    studentConsultations: [
        // {
        //     id: 1,
        //     name: "John Doe",
        //     email: "johndoe@example.com",
        //     phoneNumber: "123-456-7890",
        //     desiredClassSchedule: "Monday, Wednesday, Friday - 9AM to 11AM",
        //     registrationDate: "2024-10-15",
        //     status: "Pending",
        // },
        // {
        //     id: 2,
        //     name: "Jane Smith",
        //     email: "janesmith@example.com",
        //     phoneNumber: "098-765-4321",
        //     desiredClassSchedule: "Tuesday, Thursday - 2PM to 4PM",
        //     registrationDate: "2024-10-16",
        //     status: "Approved",
        // },
        // {
        //     id: 3,
        //     name: "Alice Johnson",
        //     email: "alicejohnson@example.com",
        //     phoneNumber: "555-555-5555",
        //     desiredClassSchedule: "Monday, Wednesday - 1PM to 3PM",
        //     registrationDate: "2024-10-17",
        //     status: "Rejected",
        // },
    ],
    totalPagesCount: 1,
};

const RegisterCourseReducer = createSlice({
    name: "RegisterCourseReducer",
    initialState,
    reducers: {
        setRegisterCourse: (state, action) => {
            state.studentConsultations = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
        }
    },
});

export const { setRegisterCourse } = RegisterCourseReducer.actions;

export default RegisterCourseReducer.reducer;

//---------API CALL-------------
export const GetStudentConsultationActionAsync = (pageIndex, pageSize, studentStatus, courseId, sortOrder, searchInput) => {
    return async (dispatch) => {
        try {
            console.log("courseId: ", courseId);
            const res = await httpClient.get(`/api/v1/register-course/filter`, {
                params: {
                    Status: studentStatus,
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                    CourseId: courseId,
                    SortOrder: sortOrder,
                    SearchInput: searchInput,
                },
            });
            console.log("GetStudentConsultationActionAsync: ", res.data);
            dispatch(setRegisterCourse(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};

export const UpdateStudentStatusAsync = (id, newStatus, courseId) => {
    return async () => {
        try {
            // Make the API call to update the student's status
            const res = await httpClient.put(`api/v1/register-course/students/${id}?courseId=${courseId}&status=${newStatus}`);
            if (res.isSuccess && res.data) {
                message.success(`${res.message}`);
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            // Hiển thị thông báo lỗi nếu không kết nối được tới server
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

export const UpdateStudentRegistrationAsync = (id, updatedDetails) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.put(`/api/v1/register-course/${id}`, updatedDetails);
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

export const CreateStudentRegistrationActionAsync = (registrationData) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.post(`/api/v1/register-course`, registrationData);
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

export const StudentRequestRefundActionAsync = (courseId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.patch(`/api/v1/users/mine/courses/${courseId}/register-courses/status`);
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

