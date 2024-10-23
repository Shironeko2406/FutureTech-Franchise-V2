import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    studentConsultations: [
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@example.com",
            phoneNumber: "123-456-7890",
            desiredClassSchedule: "Monday, Wednesday, Friday - 9AM to 11AM",
            registrationDate: "2024-10-15",
            status: "Pending",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "janesmith@example.com",
            phoneNumber: "098-765-4321",
            desiredClassSchedule: "Tuesday, Thursday - 2PM to 4PM",
            registrationDate: "2024-10-16",
            status: "Approved",
        },
        {
            id: 3,
            name: "Alice Johnson",
            email: "alicejohnson@example.com",
            phoneNumber: "555-555-5555",
            desiredClassSchedule: "Monday, Wednesday - 1PM to 3PM",
            registrationDate: "2024-10-17",
            status: "Rejected",
        },
    ],
    totalPagesCount: 1,
};

const ClassReducer = createSlice({
    name: "ClassReducer",
    initialState,
    reducers: {
        setClass: (state, action) => {
            state.studentConsultations = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setClass } = ClassReducer.actions;

export default ClassReducer.reducer;

//---------API CALL-------------
export const GetStudentConsultationActionAsync = (search, status, pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/student-consultations`, {
                params: {
                    Search: search,
                    Status: status,
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                },
            });
            console.log(res.data);
            dispatch(setClass(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};

