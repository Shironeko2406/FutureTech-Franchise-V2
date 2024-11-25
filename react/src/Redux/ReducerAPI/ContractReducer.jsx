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
                message.success(`${res.message}`);
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

export const DownloadSampleContractActionAsync = (agencyId) => {
    console.log("DownloadSampleContractActionAsync", agencyId);
    return async () => {
        try {
            const res = await httpClient.get(`/api/v1/contracts/download/agency/${agencyId}`, {
                responseType: 'blob',
                headers: {
                    'Accept': '*/*'
                }
            });
            console.log("DownloadSampleContractActionAsync", res);

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from content-disposition header
            const contentDisposition = res.headers['content-disposition'];
            const filename = contentDisposition
                ? decodeURIComponent(
                    contentDisposition
                        .split("filename*=UTF-8''")[1] || // If UTF-8 format
                    contentDisposition.split('filename=')[1].split(';')[0] // If not
                ).replace(/"/g, '')
                : 'SampleContract.pdf'; // Default filename

            link.setAttribute('download', filename); // Set the filename
            document.body.appendChild(link);
            link.click();

            // Clean up the URL object
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("DownloadSampleContractActionAsync", error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};