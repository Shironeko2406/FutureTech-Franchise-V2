import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  slotData: [],
};

const SlotReducer = createSlice({
  name: "SlotReducer",
  initialState,
  reducers: {
    setSlotData: (state, action) => {
      state.slotData = action.payload;
    },
  },
});

export const { setSlotData } = SlotReducer.actions;

export default SlotReducer.reducer;
//----------API CALL--------------
export const GetSlotActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(
        `/api/v1/slots`
      );
      dispatch(setSlotData(res.data))
    } catch (error) {
      console.error(error);
    }
  };
};

export const DeleteSlotActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(
        `/api/v1/slots/${id}`
      );
      dispatch(GetSlotActionAsync())
      message.success(`${res.message}`)
    } catch (error) {
      console.error(error);
    }
  };
};

export const AddSlotActionAsync = (slotData) => {
  return async (dispatch) => {
    // try {
    //   // Gọi API đổi mật khẩu
    //   const res = await httpClient.post(`/api/v1/users/change-password`, slotData);

    //   if (res.isSuccess && res.data) {
    //     message.success(`${res.message}`);
    //     return true;
    //   } else if (res.isSuccess && !res.data) {
    //     message.error(`${res.message}`);
    //     return false;
    //   } else {
    //     throw new Error(`${res.message}`);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    //   return false;
    // }
  };
};

export const UpdateSlotActionAsync = (slotId, slotNewData) => {
  return async (dispatch) => {
    // try {
    //   // Gọi API đổi mật khẩu
    //   const res = await httpClient.post(`/api/v1/users/change-password`, slotData);

    //   if (res.isSuccess && res.data) {
    //     message.success(`${res.message}`);
    //     return true;
    //   } else if (res.isSuccess && !res.data) {
    //     message.error(`${res.message}`);
    //     return false;
    //   } else {
    //     throw new Error(`${res.message}`);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    //   return false;
    // }
  };
};  
