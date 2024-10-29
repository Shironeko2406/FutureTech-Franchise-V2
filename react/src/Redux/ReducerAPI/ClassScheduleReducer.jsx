import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  schedules: [],
};

const ClassScheduleReducer = createSlice({
  name: "ClassScheduleReducer",
  initialState,
  reducers: {
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
  },
});

export const { setSchedules } = ClassScheduleReducer.actions;

export default ClassScheduleReducer.reducer;

//---------API CALL-------------//
export const CreateClassScheduleActionAsync = (scheduleData) => {
  return async () => {
    try {
      console.log(`CreateClassScheduleActionAsync: ${JSON.stringify(scheduleData)}`);
      const res = await httpClient.post(`/api/v1/class-schedules/date-range`, scheduleData);
      if (res.isSuccess) {
        message.success("Thời khóa biểu đã được tạo thành công!");
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi tạo thời khóa biểu, vui lòng thử lại sau.");
    }
  };
};
