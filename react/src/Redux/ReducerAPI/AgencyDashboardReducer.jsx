import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";


const initialState = {
    DashboardData: [],
    RevenueSummary: [],
};

const AgencyDashboardReducer = createSlice({
    name: "AgencyDashboardReducer",
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.DashboardData = action.payload;
        },
        setRevenueSummary: (state, action) => {
            state.RevenueSummary = action.payload;
        }
    },
});

export const { setDashboardData, setRevenueSummary } = AgencyDashboardReducer.actions;

export default AgencyDashboardReducer.reducer;
//---------API CALL-------------//
export const FetchDashboardAgencyCoursesAsync = (startDate, endDate) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/agency-dashboards/courses?startDate=${startDate}&endDate=${endDate}`);
            console.log("FetchDashboardAgencyCoursesAsync", res)
            if (res.isSuccess && res.data) {
                dispatch(setDashboardData(res.data))
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

};
export const FetchDashboardAgencyAsync = (startDate, endDate) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/agency-dashboards?startDate=${startDate}&endDate=${endDate}`);
            console.log("FetchDashboardAgencyAsync", res);
            if (res.isSuccess) {
                dispatch(setRevenueSummary(res.data));  // Lưu dữ liệu vào Redux
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };
};