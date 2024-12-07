import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Import Vietnamese locale
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from 'react-redux';
import { GetAppointmentSchedulesAgencyActionAsync, GetAppointmentByIdActionAsync } from '../../../Redux/ReducerAPI/AppointmentReducer';
import { useLoading } from '../../../Utils/LoadingContext';
import './AgencyManagerAppointment.css';
import { useNavigate } from 'react-router-dom';

moment.locale('vi'); // Set moment locale to Vietnamese
const localizer = momentLocalizer(moment);

const AgencyManagerAppointment = () => {
    const dispatch = useDispatch();
    const { appointmentSchedules } = useSelector((state) => state.AppointmentReducer);
    const [currentView, setCurrentView] = useState(Views.WEEK);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const fetchSchedules = useCallback(async (startDate, endDate) => {
        setLoading(true);
        await dispatch(GetAppointmentSchedulesAgencyActionAsync(startDate, endDate));
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

    const events = appointmentSchedules.map(consultant => ({
        id: consultant.id,
        title: `${consultant.title}`,
        start: new Date(consultant.startTime),
        end: new Date(consultant.endTime),
        status: consultant.status,
    }));

    const eventStyleGetter = (event) => {
        const currentDate = new Date();
        let backgroundColor = '#f0ad4e'; // Default color
        if (moment(event.start).isSameOrBefore(currentDate, 'day')) {
            backgroundColor = '#3174ad';
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
        return (
            <div className="event-container">
                <span className="event-title">{event.title}</span>
            </div>
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
                messages={messages} // Add messages prop for localization
            />
        </div>
    );
};

export default AgencyManagerAppointment;