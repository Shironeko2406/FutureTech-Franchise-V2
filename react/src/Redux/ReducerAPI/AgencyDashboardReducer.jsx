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

export const FetchDashboardAgencyByIdAsync = (id, startDate, endDate) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/agency-dashboards/agencies/${id}/amount?startDate=${startDate}&endDate=${endDate}`);
            console.log("FetchDashboardAgencyByIdAsync", res);
            if (res.isSuccess) {
                dispatch(setRevenueSummary(res.data));  // Lưu dữ liệu vào Redux
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };
}

export const FetchDashboardAgencyByIdCoursesAsync = (id, startDate, endDate) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/agency-dashboards/agencies/${id}?startDate=${startDate}&endDate=${endDate}`);
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

export const ExportAgencyRevenueReportAsync = (month, year) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/dashboard/agency-payment-report?month=${month}&year=${year}`);
            if (res.isSuccess && res.data) {
                const link = document.createElement('a');
                link.href = res.data; // Link to the Excel file on Firebase
                link.setAttribute('download', `AgencyRevenueReport_${month}_${year}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã có lỗi xảy ra vui lòng thử lại sau!");
        }
    };
};