import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';

const initialState = {
  agencyData: [],
  totalPagesCount: 0,
  tasks: [],
  agencyStatus: null
}

const AgencyReducer = createSlice({
  name: "AgencyReducer",
  initialState,
  reducers: {
    setAgencyData: (state, action) => {
      state.agencyData = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setTaskByAgencyId: (state, action) => {
      state.tasks = action.payload.work
      state.agencyStatus = action.payload.agencyStatus
    }
  }
});

export const { setAgencyData, setTaskByAgencyId } = AgencyReducer.actions

export default AgencyReducer.reducer
//------------API CALL----------------
export const GetAgencyActionAsync = (pageIndex, pageSize, status, search) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/agencies`, {
        params: {
          SearchInput: search,
          Status: status,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      dispatch(setAgencyData(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetTaskByAgencyIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/agencies/${id}/works`);
      console.log("GetTaskByAgencyIdActionAsync", res.data);
      dispatch(setTaskByAgencyId(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const UpdateStatusAgencyActionAsync = (id, status) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/agencies/${id}/status`, null, {
        params: {
          newStatus: status
        },
      });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskByAgencyIdActionAsync(id));
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const CreateAgencyActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/agencies`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

