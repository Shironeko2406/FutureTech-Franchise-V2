import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';

const initialState = {
    reportData: [],
    totalItemsCount: 0,
    totalPagesCount: 0,
}

const ReportReducer = createSlice({
  name: "ReportReducer",
  initialState,
  reducers: {
    setReportData: (state, action) => {
        state.reportData = action.payload.items;
        state.totalItemsCount = action.payload.totalItemsCount;
        state.totalPagesCount = action.payload.totalPagesCount;
    },
  }
});

export const {setReportData} = ReportReducer.actions

export default ReportReducer.reducer
//---------API CALL----------------------
export const CreateReportEquipActionAsync = (data) => {
    return async (dispatch) => {
      try {
        const res = await httpClient.post(`/api/v1/reports/equipment`, data);
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
        console.error(error);
        message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        return false;
      }
    };
  };

  export const GetReportActionAsync = (agencyId, status, pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.get(`/api/v1/reports`, {
                params: {
                    AgencyId: agencyId,
                    Status: status,
                    ReportType: 'Equipment',
                    PageNumber: pageIndex,
                    PageSize: pageSize,
                },
            });
            dispatch(setReportData(res.data));
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

export const UpdateReportStatusByIdActionAsync = (id, statusUpdate, filters, pageIndex, pageSize) => {
    return async (dispatch) => {
        try {
            const res = await httpClient.put(
                `/api/v1/reports/${id}/status`, 
                JSON.stringify(statusUpdate), 
                {
                    headers: {
                        'Content-Type': 'application/json'  
                    }
                }
            );
            if (res.isSuccess && res.data) {
                if (statusUpdate === 'Completed') {                     
                  message.success(`${res.message}`);                 
                }     

                const content = 
                    statusUpdate === 'Processing' 
                        ? "Chúng tôi đã ghi nhận lại các thiết bị hư hỏng của bạn, Vui lòng theo dõi ở mục công việc!"
                        : statusUpdate === 'Completed'
                            ? "Các thiết bị hư hỏng của bạn đã hoàn tất sửa chữa và sẵn sàng bàn giao lại."
                            : null;
                            
                await Promise.all([
                    dispatch(GetReportActionAsync(null, filters.statusFilter, pageIndex, pageSize)),
                    dispatch(RespondReportIdActionAsync(id, content))
                ]);

                return true;
              } else if (res.isSuccess && !res.data) {
                message.error(`${res.message}`);
                return false;
              } else {
                throw new Error(`${res.message}`);
              }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };
};

export const RespondReportIdActionAsync = (reportId, content) => {
  return async (dispatch) => {
      try {
          const res = await httpClient.post(
              `/api/v1/reports/${reportId}/respond`, 
              JSON.stringify(content), 
              {
                  headers: {
                      'Content-Type': 'application/json'  
                  }
              }
          );
          if (res.isSuccess && res.data) { 
              return true;
            } else if (res.isSuccess && !res.data) {
              message.error(`${res.message}`);
              return false;
            } else {
              throw new Error(`${res.message}`);
            }
      } catch (error) {
          console.error(error);
          message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
  };
};
  