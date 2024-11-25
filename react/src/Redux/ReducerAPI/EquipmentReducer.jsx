
import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
    equipmentData: [],
};

const EquipmentReducer = createSlice({
    name: "EquipmentReducer",
    initialState,
    reducers: {
        setEquipmentData: (state, action) => {
            state.equipmentData = action.payload;
        },
    },
});

export const { setEquipmentData } = EquipmentReducer.actions;

export default EquipmentReducer.reducer;

//----------API CALL--------------
export const GetEquipmentActionAsync = (agencyId) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/equipments/agency/${agencyId}`);
            dispatch(setEquipmentData(res.data));
        } catch (error) {
            console.error(error);
        }
    };
};

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