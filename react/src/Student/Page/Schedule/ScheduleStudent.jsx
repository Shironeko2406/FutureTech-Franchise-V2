import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from 'react-redux';
import { GetClassSchedulesByLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { GetSlotActionAsync } from '../../../Redux/ReducerAPI/SlotReducer';
import { Spin } from 'antd';

const localizer = momentLocalizer(moment);

const ScheduleStudent = () => {

  const dispatch = useDispatch();
  const { slotData } = useSelector((state) => state.SlotReducer);
  const [currentView, setCurrentView] = useState(Views.WEEK)
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date())
  const { schedules } = useSelector((state) => state.UserReducer);

  useEffect(() => {
    dispatch(GetSlotActionAsync());
  }, [])


  const fetchSchedules = useCallback(async (startDate, endDate) => {
    setLoading(true)
    await dispatch(GetClassSchedulesByLoginActionAsync(startDate, endDate))
    await dispatch(GetSlotActionAsync())
    setLoading(false)
  }, [dispatch])

  const updateDateRange = useCallback((date, view) => {
    let start, end
    if (view === Views.MONTH) {
      // Lấy ngày đầu tiên của lưới lịch (có thể là ngày của tháng trước)
      start = moment(date).startOf('month').startOf('week').format('MM/DD/YYYY')
      // Lấy ngày cuối cùng của lưới lịch (có thể là ngày của tháng sau)
      end = moment(date).endOf('month').endOf('week').format('MM/DD/YYYY')
    } else if (view === Views.WEEK) {
      start = moment(date).startOf('week').format('MM/DD/YYYY')
      end = moment(date).endOf('week').format('MM/DD/YYYY')
    } else {
      start = moment(date).format('MM/DD/YYYY')
      end = moment(date).format('MM/DD/YYYY')
    }
    return { start, end }
  }, [])

  useEffect(() => {
    const { start, end } = updateDateRange(currentDate, currentView)
    fetchSchedules(start, end)
  }, [currentDate, currentView, fetchSchedules, updateDateRange])


  const handleNavigate = (date, view, action) => {
    setCurrentDate(date)
    setCurrentView(view)
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  //click on a day in month view to switch to week view
  const handleSelectSlot = (slotInfo) => {
    if (currentView === Views.MONTH) {
      setCurrentDate(slotInfo.start)
      setCurrentView(Views.WEEK)
    }
  }
  // Convert API data to events format
  const events = schedules.map(schedule => ({
    id: schedule.scheduleId,
    title: `${schedule.className} - ${schedule.room}`,
    start: new Date(moment(schedule.date).format('YYYY-MM-DD') + ' ' + schedule.startTime),
    end: new Date(moment(schedule.date).format('YYYY-MM-DD') + ' ' + schedule.endTime),
  }))
  console.log(events);

  // Hàm để tùy chỉnh các thuộc tính CSS cho sự kiện
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: '#3174ad',
      color: 'white',
      borderRadius: "5px",
      display: "block",
    }
  });

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
        // formats={customFormats}
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
        onSelectEvent={handleSelectSlot}
        selectable
      />
    </div>
  );
};

export default ScheduleStudent;