import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    instructors: []
};

const ClassReducer = createSlice({
    name: "ClassReducer",
    initialState,
    reducers: {
        setInstructors: (state, action) => {
            state.instructors = action.payload;
        }
    },
});

export const { setInstructors } = ClassReducer.actions;

export default ClassReducer.reducer;
//---------API CALL-------------

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
    return async () => {
        console.log("CreateClassActionAsync:", classData);
        try {
            const res = await httpClient.post(`/api/v1/classes`, classData);
            if (res.isSuccess && res.data) {
                message.success("Tạo lớp học thành công!");
            } else if (res.isSuccess && !res.data) {
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