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

export const GetClassSchedulesActionAsync = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const response = await httpClient.get(`/api/v1/class-schedules`, {
        params: {
          StartDate: startDate,
          EndDate: endDate,
        },
      });
      if (response.isSuccess) {
        dispatch(setSchedules(response.data));
        console.log("GetClassSchedulesActionAsync, response: ", response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy lịch học, vui lòng thử lại sau.");
    }
  };
};

export const RemoveAllSchedulesOfOneClassActionAsync = (classId) => {
  return async () => {
    try {
      const res = await httpClient.delete(`/api/v1/classes/${classId}/class-schedules`);
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

export const GetClassScheduleDetailsActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const response = await httpClient.get(`/api/v1/class-schedules/${id}`);
      console.log("GetClassScheduleDetailsActionAsync: ", response)
      if (response.isSuccess) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy chi tiết lịch học, vui lòng thử lại sau.");
      return null;
    }
  };
};