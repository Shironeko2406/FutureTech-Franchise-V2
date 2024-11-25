import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    documents: [],
    totalPagesCount: 0,
};

const DocumentReducer = createSlice({
    name: "DocumentReducer",
    initialState,
    reducers: {
        setDocuments: (state, action) => {
            state.documents = action.payload.items;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setDocuments } = DocumentReducer.actions;

export default DocumentReducer.reducer;

//---------API CALL-------------
export const GetDocumentsActionAsync = ({ pageIndex, pageSize, type, status }) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/documents`, {
                params: {
                    AgencyId: null, // Replace with actual AgencyId
                    Type: type,
                    Status: status,
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                },
            });
            console.log("GetDocumentsActionAsync res: ", res.data);
            dispatch(setDocuments(res.data));
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi khi lấy danh sách tài liệu!");
        }
    };
};

export const DeleteDocumentActionAsync = (documentId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.delete(`/api/v1/documents/${documentId}`);
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

export const CreateDocumentActionAsync = (data) => {
    console.log("CreateDocumentActionAsync data: ", data);
    return async (dispatch) => {
        try {
            const res = await httpClient.post(`/api/v1/documents`, data);
            if (res.isSuccess && res.data) {
                message.success(`${res.message}`);
                return res.data;
            } else {
                message.error(`${res.message}`);
                return null;
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return null;
        }
    };
};
