import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from 'react-redux';
import { GetClassSchedulesByLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { GetSlotActionAsync } from '../../../Redux/ReducerAPI/SlotReducer';
import { Spin, Tooltip } from 'antd';
import './ScheduleStudent.css';

const localizer = momentLocalizer(moment);

const ScheduleStudent = () => {

  const dispatch = useDispatch();
  const { slotData } = useSelector((state) => state.SlotReducer);
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { schedules } = useSelector((state) => state.UserReducer);

  useEffect(() => {
    dispatch(GetSlotActionAsync());
  }, [dispatch]);

  const fetchSchedules = useCallback(async (startDate, endDate) => {
    setLoading(true);
    await dispatch(GetClassSchedulesByLoginActionAsync(startDate, endDate));
    await dispatch(GetSlotActionAsync());
    setLoading(false);
  }, [dispatch]);

  const updateDateRange = useCallback((date, view) => {
    let start, end;
    if (view === Views.MONTH) {
      start = moment(date).startOf('month').startOf('week').format('MM/DD/YYYY');
      end = moment(date).endOf('month').endOf('week').format('MM/DD/YYYY');
    } else if (view === Views.WEEK) {
      start = moment(date).startOf('week').format('MM/DD/YYYY');
      end = moment(date).endOf('week').format('MM/DD/YYYY');
    } else {
      start = moment(date).format('MM/DD/YYYY');
      end = moment(date).format('MM/DD/YYYY');
    }
    return { start, end };
  }, []);

  useEffect(() => {
    const { start, end } = updateDateRange(currentDate, currentView);
    fetchSchedules(start, end);
  }, [currentDate, currentView, fetchSchedules, updateDateRange]);

  const handleNavigate = (date, view) => {
    setCurrentDate(date);
    setCurrentView(view);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleSelectSlot = (slotInfo) => {
    if (currentView === Views.MONTH) {
      setCurrentDate(slotInfo.start);
      setCurrentView(Views.WEEK);
    }
  };

  const events = schedules ? schedules.map(schedule => ({
    id: schedule.scheduleId,
    title: `${schedule.className}`,
    start: new Date(moment(schedule.date).format('YYYY-MM-DD') + ' ' + schedule.startTime),
    end: new Date(moment(schedule.date).format('YYYY-MM-DD') + ' ' + schedule.endTime),
    attendanceStatus: schedule.attendanceStatus,
    date: schedule.date,
    url: schedule.url,
    teacherName: schedule.teacherName // Add teacherName field
  })) : [];

  const eventStyleGetter = (event) => {
    const currentDate = new Date();
    let backgroundColor = '#3174ad'; // Default color
    if (moment(event.date).isSameOrBefore(currentDate, 'day')) {
      if (event.attendanceStatus === 'Present') {
        backgroundColor = '#28a745'; // Green for attended
      } else if (event.attendanceStatus === 'Absent') {
        backgroundColor = '#dc3545'; // Red for not attended
      }
    }
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: "5px",
        display: "block",
      }
    };
  };

  const EventComponent = ({ event }) => {
    const currentDate = new Date();
    let statusText = "(Chưa tới ngày)";
    if (moment(event.date).isSameOrBefore(currentDate, 'day')) {
      statusText = event.attendanceStatus === 'Present' ? "(Có mặt)" : event.attendanceStatus === 'Absent' ? "(Vắng mặt)" : "(Chưa điểm danh)";
    }
    const handleClick = (e) => {
      e.stopPropagation();
      if (event.url) {
        window.open(event.url, '_blank');
      }
    };
    return (
      <Tooltip title={event.url ? "Nhấn để vào lớp học" : "Chưa có link lớp học"}>
        <div className="event-container" onClick={handleClick} style={{ cursor: event.url ? 'pointer' : 'default' }}>
          <span className="event-title">{event.title}</span>
          <span className="event-teacher">Giáo viên: {event.teacherName}</span> {/* Display teacher's name */}
          <span className="event-status">
            {statusText}
          </span>
        </div>
      </Tooltip>
    );
  };

  const MonthEventComponent = ({ event }) => {
    const currentDate = new Date();
    let statusText = "(Chưa tới ngày)";
    if (moment(event.date).isSameOrBefore(currentDate, 'day')) {
      statusText = event.attendanceStatus === 'Present' ? "(Có mặt)" : event.attendanceStatus === 'Absent' ? "(Vắng mặt)" : "(Chưa điểm danh)";
    }
    const handleClick = (e) => {
      e.stopPropagation();
      if (event.url) {
        window.open(event.url, '_blank');
      }
    };
    return (
      <Tooltip title={event.url ? "Nhấn để vào lớp học" : "Chưa có link lớp học"}>
        <div className="event-container" onClick={handleClick} style={{ cursor: event.url ? 'pointer' : 'default' }}>
          <span className="event-time small-text">
            {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
          </span>
          <span className="event-title">{event.title}</span>
          <span className="event-status">
            {statusText}
          </span>
        </div>
      </Tooltip>
    );
  };

  const messages = {
    allDay: 'Cả ngày',
    previous: 'Trước',
    next: 'Tiếp',
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    agenda: 'Lịch trình',
    date: 'Ngày',
    time: 'Thời gian',
    event: 'Sự kiện',
    noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này.',
    showMore: total => `+ Xem thêm (${total})`
  };

  return (
    <div style={{ position: 'relative', height: "600px" }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <Spin size="large" />
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={[Views.WEEK, Views.MONTH, Views.DAY]}
        style={{ height: "100%" }}
        step={60}
        timeslots={1}
        eventPropGetter={eventStyleGetter}
        min={new Date(2024, 9, 16, 7, 0)}
        max={new Date(2024, 9, 16, 23, 0)}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        date={currentDate}
        view={currentView}
        popup
        onSelectSlot={handleSelectSlot}
        selectable
        components={{
          event: EventComponent,
          month: {
            event: MonthEventComponent
          }
        }}
        messages={messages}
      />
    </div>
  );
};

export default ScheduleStudent;