import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from 'react-redux';
import { GetAppointmentSchedulesActionAsync, GetAppointmentByIdActionAsync } from '../../../Redux/ReducerAPI/AppointmentReducer';
import { useLoading } from '../../../Utils/LoadingContext';
import './ScheduleSystemTechnician.css';
import AppointmentDetail from './AppointmentDetail';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const ScheduleSystemTechnician = () => {
    const dispatch = useDispatch();
    const { appointmentSchedules } = useSelector((state) => state.AppointmentReducer);
    const [currentView, setCurrentView] = useState(Views.WEEK);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const fetchSchedules = useCallback(async (startDate, endDate) => {
        setLoading(true);
        await dispatch(GetAppointmentSchedulesActionAsync(startDate, endDate));
        setLoading(false);
    }, [dispatch, setLoading]);

    const updateDateRange = useCallback((date, view) => {
        let start, end;
        if (view === Views.MONTH) {
            start = moment(date).startOf('month').startOf('week').format('YYYY-MM-DDT00:00:00');
            end = moment(date).endOf('month').endOf('week').format('YYYY-MM-DDT23:59:59');
        } else if (view === Views.WEEK) {
            start = moment(date).startOf('week').format('YYYY-MM-DDT00:00:00');
            end = moment(date).endOf('week').format('YYYY-MM-DDT23:59:59');
        } else {
            start = moment(date).format('YYYY-MM-DDT00:00:00');
            end = moment(date).format('YYYY-MM-DDT23:59:59');
        }
        return { start, end };
    }, []);

    useEffect(() => {
        const { start, end } = updateDateRange(currentDate, currentView);
        fetchSchedules(start, end);
    }, [currentDate, currentView, fetchSchedules, updateDateRange]);

    const handleNavigate = (date, view, action) => {
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

    const handleSelectEvent = async (event) => {
        await dispatch(GetAppointmentByIdActionAsync(event.id));
        navigate('details');
    };

    const events = appointmentSchedules.map(appointment => ({
        id: appointment.id,
        title: `${appointment.title}`,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        status: appointment.status,
    }));

    const eventStyleGetter = (event) => {
        const currentDate = new Date();
        let backgroundColor = '#3174ad'; // Default color
        if (moment(event.start).isSameOrBefore(currentDate, 'day')) {
            if (event.status === 'Completed') {
                backgroundColor = '#28a745'; // Green for completed
            } else if (event.status === 'Cancelled') {
                backgroundColor = '#dc3545'; // Red for cancelled
            } else {
                backgroundColor = '#f0ad4e'; // Yellow for none
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
        if (moment(event.start).isSameOrBefore(currentDate, 'day')) {
            statusText = event.status === 'Completed' ? "(Đã báo cáo)" : event.status === 'Cancelled' ? "(Đã hủy)" : "(Chưa báo cáo)";
        }
        return (
            <div className="event-container">
                <span className="event-title">{event.title}</span>
                <br />
                <span className="event-status">
                    {statusText}
                </span>
            </div>
        );
    };

    return (
        <div style={{ position: 'relative', height: "600px" }}>
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
                components={{
                    event: EventComponent,
                }}
            />
        </div>
    );
};

export default ScheduleSystemTechnician;