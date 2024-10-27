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
        setClass: (state, action) => {
            state.studentConsultations = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
        }
    },
});

export const { setClass } = RegisterCourseReducer.actions;

export default RegisterCourseReducer.reducer;

//---------API CALL-------------
export const GetStudentConsultationActionAsync = (pageIndex, pageSize, studentStatus, courseId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/register-course/filter`, {
                params: {
                    Status: studentStatus,
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                    CourseId: courseId,
                },
            });
            console.log("GetStudentConsultationActionAsync: ", res.data);
            dispatch(setClass(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};


export const UpdateStudentStatusAsync = (id, newStatus) => {
    return async () => {
        try {
            // Make the API call to update the student's status
            const res = await httpClient.put(`api/v1/register-course/${id}?status=${newStatus}`);
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
