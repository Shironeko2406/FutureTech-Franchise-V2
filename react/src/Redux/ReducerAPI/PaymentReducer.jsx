import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    paymentInfo: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
};

const PaymentReducer = createSlice({
    name: "PaymentReducer",
    initialState,
    reducers: {
        setPaymentInfo: (state, action) => {
            state.paymentInfo = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
            state.totalItemsCount = action.payload.totalItemsCount;
        },
    },
});

export const { setPaymentInfo } = PaymentReducer.actions;

export default PaymentReducer.reducer;

//------------API CALL------------

export const GetStudentPaymentInfoActionAsync = (pageIndex, pageSize, search) => {
    return async (dispatch) => {
        try {
            console.log(`search ${search}`);
            const res = await httpClient.get(`api/v1/payments/filter`, {
                params: { PageIndex: pageIndex, PageSize: pageSize, StudentName: search },
            });
            console.log(res.data);
            dispatch(setPaymentInfo(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};

export const CreateStudentPaymentActionAsync = (paymentData, paymentType) => {
    return async () => {
        console.log("create payment", paymentData);
        try {
            const res = await httpClient.post(`/api/v1/payments?status=${paymentType}`, paymentData);
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

export const CreatePaymentContractActionAsync = (contractId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.post(`/api/v1/payments/create-vnpay-url`, { contractId });
            if (res.isSuccess && res.data) {
                window.open(res.data, '_blank');
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

export const CreateCashPaymentActionAsync = (paymentData) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.post(`/direct`, paymentData);
            if (res.isSuccess && res.data) {
                message.success('Tạo thanh toán trực tiếp thành công');
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };
};

export const CreatePaymentContract2ndActionAsync = (contractId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.post(`/api/v1/payments/create-vnpay-url-2`, { contractId });
            if (res.isSuccess && res.data) {
                window.open(res.data, '_blank');
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };
};

export const GetPaymentContractsActionAsync = (startDate, endDate, contractCode, agencyId, pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/payments/contract/filter`, {
                params: { StartDate: startDate, EndDate: endDate, ContractCode: contractCode, AgencyId: agencyId, PageIndex: pageIndex, PageSize: pageSize },
            });
            console.log(res.data);
            dispatch(setPaymentInfo(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};

export const GetRefundAmountActionAsync = (registerCourseId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/payments/calculate-refund/${registerCourseId}`);
            if (res.isSuccess) {
                return res.data;
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            // message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return null;
        }
    };
};

export const CreateRefundActionAsync = (refundData) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.post(`api/v1/payments/refund`, refundData);
            if (res.isSuccess && res.data) {
                message.success("Tạo thông tin hoàn tiền thành công");
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

export const GetMonthlyDuePaymentsActionAsync = (startDate, endDate, status, agencyId, pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/payments/monthly-due`, {
                params: { StartDate: startDate, EndDate: endDate, Status: status, AgencyId: agencyId, PageIndex: pageIndex, PageSize: pageSize },
            });
            console.log(res.data);
            dispatch(setPaymentInfo(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};
