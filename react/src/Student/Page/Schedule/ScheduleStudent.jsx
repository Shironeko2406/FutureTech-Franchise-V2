import React, { useState } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);


const ScheduleStudent = () => {
  const [events, setEvents] = useState([
    {
      id: 0,
      title: "Meeting",
      start: new Date(2024, 9, 16, 10, 0),
      end: new Date(2024, 9, 16, 12, 0),
    },
    {
      id: 1,
      title: "Lunch Break",
      start: new Date(2024, 9, 16, 13, 0),
      end: new Date(2024, 9, 16, 14, 0),
    },
    {
      id: 2,
      title: "Conference",
      start: new Date(2024, 9, 16, 15, 0),
      end: new Date(2024, 9, 16, 16, 30),
    },
  ]);

  // Tạo custom formats cho cột giờ
  const customFormats = {
    timeGutterFormat: (date, culture, localizer) => {
      const hour = moment(date).hour();
      const slotNumber = Math.floor((hour - 8) / 2) + 1; // Slot bắt đầu từ 8:00 AM
      return `Slot ${slotNumber}`;
    },
  };

  // Hàm tạo màu hex ngẫu nhiên
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Hàm để tính độ sáng của màu hex
  const getLuminance = (hex) => {
    // Chuyển đổi hex thành RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Tính độ sáng
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };
  
  // Hàm để tùy chỉnh các thuộc tính CSS cho sự kiện
  const eventStyleGetter = (event) => {
    const backgroundColor = getRandomColor(); // Sử dụng màu ngẫu nhiên
    const luminance = getLuminance(backgroundColor); // Tính độ sáng
  
    // Nếu độ sáng nhỏ hơn 0.5, sử dụng màu chữ trắng; nếu không thì sử dụng đen
    const textColor = luminance < 0.5 ? 'white' : 'black';
  
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: textColor, // Sử dụng màu chữ phù hợp
      border: "0px",
      display: "block",
    };
  
    return {
      style,
    };
  };

  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        style={{ height: "100%" }}
        selectable
        step={120} // Mỗi slot là 2 giờ
        timeslots={1} // Hiển thị 1 slot cho mỗi khoảng thời gian
        formats={customFormats} // Sử dụng custom format
        eventPropGetter={eventStyleGetter} // Sử dụng hàm tùy chỉnh cho sự kiện
        onSelectEvent={(event) => alert(`You clicked on event: ${event.title}`)}
        onSelectSlot={(slotInfo) =>
          alert(
            `You selected slot from ${moment(slotInfo.start).format(
              "MMMM Do YYYY, h:mm a"
            )} to ${moment(slotInfo.end).format("MMMM Do YYYY, h:mm a")}`
          )
        }
        min={new Date(2024, 9, 16, 8, 0)} // Thời gian bắt đầu 8:00 AM
        max={new Date(2024, 9, 16, 17, 0)} // Thời gian kết thúc 5:00 PM
      />
    </div>
  )
}

export default ScheduleStudent