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
    try {
      const res = await httpClient.post(`/api/v1/slots`, slotData);

      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetSlotActionAsync());
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

export const UpdateSlotActionAsync = (slotId, slotNewData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/slots/${slotId}`, slotNewData); // Gọi API PUT để cập nhật slot

      if (res.data) {
        dispatch(GetSlotActionAsync()); // Gọi lại API để lấy danh sách slot mới nhất
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
