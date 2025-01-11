export const determineAccessStatus = (startDate) => {
    const currentDate = new Date();
    const startDateTime = new Date(startDate).getTime();
    const accessWindow = 5 * 24 * 60 * 60 * 1000; // 5 ngày trước ngày bắt đầu
  
    return startDate && currentDate.getTime() >= startDateTime - accessWindow;
  };
  