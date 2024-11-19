import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';

const initialState = {
  agencyData: [],
  totalPagesCount: 0,
  tasks: []
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
      state.tasks = action.payload
    }
  }
});

export const {setAgencyData, setTaskByAgencyId} = AgencyReducer.actions

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
      dispatch(setTaskByAgencyId(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};