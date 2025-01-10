import { createSlice } from "@reduxjs/toolkit";
import { httpClient } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetTaskForAgencyActionAsync } from "./WorkReducer";

const initialState = {
  contracts: [],
  totalPagesCount: 1,
  contractDetail: null,
};

const ContractReducer = createSlice({
  name: "ContractReducer",
  initialState,
  reducers: {
    setContracts: (state, action) => {
      state.contracts = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setContractDetail: (state, action) => {
      state.contractDetail = action.payload;
    },
  },
});

export const { setContracts, setContractDetail } = ContractReducer.actions;

export default ContractReducer.reducer;

//---------API CALL-------------
export const GetContractsActionAsync = (
  pageIndex,
  pageSize,
  startTime,
  endTime,
  searchInput
) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/contracts`, {
        params: {
          StartTime: startTime,
          EndTime: endTime,
          SearchInput: searchInput,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      console.log("GetContractsActionAsync: ", res);
      dispatch(setContracts(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateSignedContractActionAsync = (contractData) => {
  return async (dispatch) => {
    console.log("CreateSignedContractActionAsync", contractData);
    try {
      const res = await httpClient.post(`/api/v1/contracts`, contractData);
      if (res.isSuccess && res.data) {
        message.success(`Tạo hợp đồng thành công!`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error("CreateSignedContractActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const DownloadSampleContractActionAsync = (agencyId) => {
  console.log("DownloadSampleContractActionAsync", agencyId);
  return async () => {
    try {
      const res = await httpClient.get(
        `/api/v1/contracts/download/agency/${agencyId}`
      );
      console.log("DownloadSampleContractActionAsync", res);
      if (res.isSuccess && res.data != null) {
        const link = document.createElement("a");
        link.href = res.data;
        link.setAttribute("download", "Contract.doc");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (res.isSuccess && res.data == null) {
        message.error("Chưa có hợp đồng nào được tạo ra.");
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error("DownloadSampleContractActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };
};

export const GetContractDetailByAgencyIdActionAsync = (agencyId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/contracts/agency/${agencyId}`);
      if (res.isSuccess && res.data != null) {
        dispatch(setContractDetail(res.data));
        return res.data;
      } else if (res.isSuccess && res.data == null) {
        // message.error(`Chưa có hợp đồng nào được tạo ra.`);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error("GetContractDetailByAgencyIdActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return null;
    }
  };
};

export const UpdateContractActionAsync = (contractId, contractData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(
        `/api/v1/contracts/${contractId}`,
        contractData
      );
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
      console.error("UpdateContractActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const AgencyUploadContractActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/contracts/agency?ContractDocumentImageURL=${data.contractDocumentImageURL}&AgencyId=${data.agencyId}`);
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
      console.error("UpdateContractActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};


export const GetContractsWithAgencyIdActionAsync = (agencyId, pageIndex, pageSize, startTime, endTime, searchInput) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/contracts`, {
        params: {
          AgencyId: agencyId,
          StartTime: startTime,
          EndTime: endTime,
          SearchInput: searchInput,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      console.log("GetContractsWithAgencyIdActionAsync: ", res);
      dispatch(setContracts(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const UpdateDesignFeeActionAsync = (agencyId, designFee) => {
  return async () => {
    try {
      const res = await httpClient.put(`/api/v1/contracts/agency/${agencyId}/designFee`, null, {
        params: { designFee }
      });
      if (res.isSuccess && res.data) {
        // message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error("UpdateContractActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const CreateCustomPackageActionAsync = (contractData) => {
  return async (dispatch) => {
    console.log("CreateCustomPackageActionAsync", contractData);
    try {
      const res = await httpClient.post(`/api/v1/contracts/packages`, contractData);
      if (res.isSuccess && res.data) {
        message.success(`Tạo hợp đồng với gói tùy chỉnh thành công!`);
        return res.data;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return null;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error("CreateCustomPackageActionAsync", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return null;
    }
  };
};
