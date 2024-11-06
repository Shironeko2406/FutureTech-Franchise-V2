import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from 'react-redux';
import { GetClassSchedulesByLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { GetSlotActionAsync } from '../../../Redux/ReducerAPI/SlotReducer';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GetClassScheduleDetailsActionAsync } from '../../../Redux/ReducerAPI/ClassScheduleReducer';

const localizer = momentLocalizer(moment);

const ScheduleInstructor = () => {

  const dispatch = useDispatch();
  const { slotData } = useSelector((state) => state.SlotReducer);
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { schedules } = useSelector((state) => state.UserReducer);
  const navigate = useNavigate();

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
    title: `${schedule.className} - ${schedule.room}`,
    start: new Date(moment(schedule.date).format('YYYY-MM-DD') + ' ' + schedule.startTime),
    end: new Date(moment(schedule.date).format('YYYY-MM-DD') + ' ' + schedule.endTime),
  })) : [];
  console.log(events);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: '#3174ad',
      color: 'white',
      borderRadius: "5px",
      display: "block",
    }
  });

  const handleSelectEvent = (event) => {
    navigate('attendances', { state: { scheduleId: event.id } });
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
        onSelectEvent={handleSelectEvent}
        selectable
      />
    </div>
  );
};

export default ScheduleInstructor;