import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    equipmentData: [],
    totalItemsCount: 0,
    totalPagesCount: 0,
};

const EquipmentReducer = createSlice({
    name: "EquipmentReducer",
    initialState,
    reducers: {
        setEquipmentData: (state, action) => {
            state.equipmentData = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setEquipmentData } = EquipmentReducer.actions;

export default EquipmentReducer.reducer;

//----------API CALL--------------

export const CreateEquipmentActionAsync = (agencyId, equipmentFormData) => {
    return async (dispatch) => {
        console.log("CreateEquipmentActionAsync, agencyId:", agencyId);
        console.log("CreateEquipmentActionAsync, equipmentFormData:", equipmentFormData);
        try {
            const res = await httpClient.post(`/api/v1/equipments/agency/${agencyId}`, equipmentFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            return false;
        }
    };
};

export const DownloadEquipmentFileActionAsync = (agencyId) => {
    return async () => {
        try {
            const res = await httpClient.get(`/api/v1/equipments/agency/${agencyId}`);
            if (res.isSuccess && res.data != null) {
                const link = document.createElement('a');
                const fileExtension = res.data.split('.').pop();
                link.href = res.data;
                link.setAttribute('download', `EquipmentFile.${fileExtension}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("DownloadEquipmentFileActionAsync", error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

export const GetEquipmentActionAsync = (agencyId, status, pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/agency/equipments`, {
                params: {
                    AgencyId: agencyId,
                    Status: status,
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setEquipmentData({
                    items: res.data.items,
                    totalItemsCount: res.data.totalItemsCount,
                    totalPagesCount: res.data.totalPagesCount,
                }));
            } else {
                message.error(`${res.message}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};