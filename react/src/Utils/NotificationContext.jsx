import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as signalR from "@microsoft/signalr";
import { notification } from 'antd';
import { GetNotificationUnReadOfUserActionAsync, GetNotificationUserLoginActionAsync } from '../Redux/ReducerAPI/NotificationReducer';
import { HOST_DOMAIN } from './Interceptors';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const connection = useRef(null);

  useEffect(() => {
    // Lấy số thông báo chưa đọc khi hook được khởi chạy
    // dispatch(GetNotificationUnReadOfUserActionAsync());
    // dispatch(GetNotificationUserLoginActionAsync());
    
    // Kết nối tới SignalR hub
    connection.current = new signalR.HubConnectionBuilder()
      .withUrl(`${HOST_DOMAIN}/notificationHub?userId=${JSON.parse(localStorage.getItem("userLogin")).id}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.current.start();
        console.log("SignalR connected successfully.");

        // Lắng nghe sự kiện nhận thông báo
        connection.current.on("ReceivedNotification", async (message) => {
          console.log("Received notification:", message);
          if (message) {
            await Promise.all([
              dispatch(GetNotificationUserLoginActionAsync()),
              dispatch(GetNotificationUnReadOfUserActionAsync())
            ]);
            
            // Hiển thị thông báo mới
            notification.success({
              message: "Thông báo mới",
              description: message,
            });
          } else {
            notification.error({
              message: "Lỗi nhận thông báo",
              description: "Không thể nhận thông báo",
            });
          }
        });
      } catch (error) {
        console.error("SignalR connection failed: ", error);
      }
    };

    startConnection();

    // Cleanup: Ngắt kết nối SignalR khi component unmount
    return () => {
      if (connection.current && connection.current.state === signalR.HubConnectionState.Connected) {
        connection.current.stop()
          .then(() => console.log("SignalR disconnected."))
          .catch((err) => console.error("Error stopping SignalR connection: ", err));
      }
    };
  }, [dispatch]);

  return {
    fetchNotifications: () => {
      dispatch(GetNotificationUnReadOfUserActionAsync());
      dispatch(GetNotificationUserLoginActionAsync());
    },
  };
};