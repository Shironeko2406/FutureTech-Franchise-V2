import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    paymentInfo: [],
    totalPagesCount: 0,
};

const PaymentReducer = createSlice({
    name: "PaymentReducer",
    initialState,
    reducers: {
        setPaymentInfo: (state, action) => {
            state.paymentInfo = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
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
    console.log("paymentData", paymentData);
    console.log("paymentType", paymentType);
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