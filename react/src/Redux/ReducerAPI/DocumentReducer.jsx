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
        }
    },
});

export const { setDocuments, setDocumentDetail } = DocumentReducer.actions;

export default DocumentReducer.reducer;

//---------API CALL-------------
export const GetDocumentsActionAsync = ({ pageIndex, pageSize, type, status, agencyId }) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/documents`, {
                params: {
                    AgencyId: agencyId, // Replace with actual AgencyId
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

export const GetDocumentByAgencyIdActionAsync = (agencyId, typeDocument) => {
    console.log("GetDocumentByAgencyIdActionAsync", agencyId, typeDocument);
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`api/v1/documents/agency/${agencyId}?type=${typeDocument}`);
            if (res.isSuccess && res.data != null) {
                return res.data;
            } else if (res.isSuccess && res.data == null) {
                message.error(`Không tìm thấy tài liệu nào được tải lên`);
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("GetDocumentByAgencyIdActionAsync", error);
            // message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return null;
        }
    };
};

export const UpdateDocumentActionAsync = (documentId, data) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.put(`/api/v1/documents/${documentId}`, data);
            if (res.isSuccess && res.data) {
                message.success(`${res.message}`);
                return res.data;
            } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("UpdateDocumentActionAsync", error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return null;
        }
    };
};

export const GetAllDocumentsByAgencyIdActionAsync = (agencyId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/documents/agency/${agencyId}/all`);
            if (res.isSuccess && res.data) {
                dispatch(setDocuments({ items: res.data, totalPagesCount: 1 }));
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("GetAllDocumentsByAgencyIdActionAsync", error);
            message.error("Đã xảy ra lỗi khi lấy danh sách tài liệu!");
        }
    };
};

export const ApproveDocumentActionAsync = (documentId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.put(`/api/v1/documents/${documentId}/approved`);
            if (res.isSuccess && res.data) {
                message.success(`${res.message}`);
                return res.data;
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("ApproveDocumentActionAsync", error);
            message.error("Đã xảy ra lỗi khi duyệt tài liệu!");
            return null;
        }
    };
};