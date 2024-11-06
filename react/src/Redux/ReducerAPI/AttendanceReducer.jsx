import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
};

const AttendanceReducer = createSlice({
    name: "AttendanceReducer",
    initialState,
    reducers: {
    },
});

export const { } = AttendanceReducer.actions;

export default AttendanceReducer.reducer;

//---------API CALL-------------//
export const SaveAttendanceActionAsync = (classScheduleId, studentIds) => {
    return async (dispatch) => {
        try {
            console.log(`studentIds: ${(studentIds)}`);
            console.log(`classScheduleId: ${(classScheduleId)}`);
            const res = await httpClient.post(`/api/v1/attendances?classScheduleId=${classScheduleId}`, studentIds);
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
