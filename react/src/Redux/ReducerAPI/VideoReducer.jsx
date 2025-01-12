import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";

const initialState = {
  videoData: [],
  videoUrlCopy: null,
};

const VideoReducer = createSlice({
  name: "VideoReducer",
  initialState,
  reducers: {
    setVideoData: (state, action) => {
      state.videoData = action.payload;
    },
    setVideoUrlCopy: (state, action) => {
      state.videoUrlCopy = action.payload;
    },
  },
});

export const { setVideoData, setVideoUrlCopy } = VideoReducer.actions;

export default VideoReducer.reducer;
//----------API CALL-------------
export const GetVideoActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/videos`);
      if (res.isSuccess && res.data) {
        dispatch(setVideoData(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const CreateVideoActionAsync = (name, file) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/videos`, file, {
        params: { name: name },
      });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await Promise.all([
          dispatch(GetVideoActionAsync()),
          dispatch(setVideoUrlCopy(res.data.url))
        ]);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const DeleteVideoActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/videos`, {
        params: { id: id },
      });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetVideoActionAsync())
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};
