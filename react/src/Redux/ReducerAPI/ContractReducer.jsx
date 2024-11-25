import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    contracts: [],
    totalPagesCount: 1,
};

const ContractReducer = createSlice({
    name: "ContractReducer",
    initialState,
    reducers: {
        setContracts: (state, action) => {
            state.contracts = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
        }
    },
});

export const { setContracts } = ContractReducer.actions;

export default ContractReducer.reducer;

//---------API CALL-------------
export const GetContractsActionAsync = (pageIndex, pageSize, startTime, endTime, searchInput) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/contracts`, {
                params: {
                    StartTime: startTime,
                    EndTime: endTime,
                    SearchInput: searchInput,
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                },
            });
            console.log("GetContractsActionAsync: ", res)
            dispatch(setContracts(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};

export const CreateSignedContractActionAsync = (contractData) => {
    return async (dispatch) => {
        console.log("CreateSignedContractActionAsync", contractData);
        try {
            const res = await httpClient.put(`/api/v1/contracts`, contractData);
            if (res.isSuccess && res.data) {
                // message.success(`${res.message}`);
                return true;
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
                return false;
            } else {
                throw new Error(`${res.message}`);
            }
        } catch (error) {
            console.error("CreateSignedContractActionAsync", error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return false;
        }
    };
};