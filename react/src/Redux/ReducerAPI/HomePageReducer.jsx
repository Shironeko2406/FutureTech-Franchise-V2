import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    homePageData: {},
};

const HomePageReducer = createSlice({
    name: "HomePageReducer",
    initialState,
    reducers: {
        setHomePageData: (state, action) => {
            state.homePageData = action.payload;
        },
    },
});

export const { setHomePageData } = HomePageReducer.actions;

export default HomePageReducer.reducer;

//----------API CALL--------------
export const GetHomePageActionAsync = () => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/home-pages`);
            if (res.isSuccess && res.data != null) {
                dispatch(setHomePageData(res.data));
                return res.data;
            } else if (res.isSuccess && res.data == null) {
                message.error(`${res.message}`);
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("GetDocumentByAgencyIdActionAsync", error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return null;
        }
    };
};

export const UpdateHomePageActionAsync = (id, homePageData) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.put(`/api/v1/home-pages/${id}`, homePageData);

            if (res.isSuccess && res.data) {
                message.success(`Cập nhật trang chủ thành công!`);
                dispatch(GetHomePageActionAsync());
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
