import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from 'react-redux';
import { GetClassSchedulesActionAsync } from '../../../Redux/ReducerAPI/ClassScheduleReducer';
import { GetSlotActionAsync } from '../../../Redux/ReducerAPI/SlotReducer';
import { Spin } from 'antd';
import CustomerEvent from '../../Component/CustomerEvent';
const localizer = momentLocalizer(moment);

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

const ScheduleAgencyManager = () => {

    const dispatch = useDispatch();
    const { schedules } = useSelector((state) => state.ClassScheduleReducer);
    const { slotData } = useSelector((state) => state.SlotReducer);
    const [currentView, setCurrentView] = useState(Views.WEEK)
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date())

    // useEffect(() => {
    //     const start = moment(currentDate).startOf('week').format('MM/DD/YYYY');
    //     const end = moment(currentDate).endOf('week').format('MM/DD/YYYY');
    //     setCurrentRange({ start, end });
    // }, [currentDate]);

    useEffect(() => {
        dispatch(GetSlotActionAsync());
    }, [])


    const fetchSchedules = useCallback(async (startDate, endDate) => {
        setLoading(true)
        await dispatch(GetClassSchedulesActionAsync(startDate, endDate))
        await dispatch(GetSlotActionAsync())
        setLoading(false)
    }, [dispatch])

    const updateDateRange = useCallback((date, view) => {
        let start, end
        if (view === Views.MONTH) {
            // Lấy ngày đầu tiên của lưới lịch (có thể là ngày của tháng trước)
            start = moment(date).startOf('month').startOf('week').format('YYYY-MM-DDT00:00:00')
            // Lấy ngày cuối cùng của lưới lịch (có thể là ngày của tháng sau)
            end = moment(date).endOf('month').endOf('week').format('YYYY-MM-DDT00:00:00')
        } else if (view === Views.WEEK) {
            start = moment(date).startOf('week').format('YYYY-MM-DDT00:00:00')
            end = moment(date).endOf('week').format('YYYY-MM-DDT00:00:00')
        } else {
            start = moment(date).format('YYYY-MM-DDT00:00:00')
            end = moment(date).format('YYYY-MM-DDT00:00:00')
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
        id: schedule.id,
        title: schedule.className,
        start: new Date(schedule.date + ' ' + schedule.startTime),
        end: new Date(schedule.date + ' ' + schedule.endTime),
        url: schedule.url,
    }))

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
                messages={messages}
                components={{
                    event: CustomerEvent,
                }}
            />
        </div>
    );
};

export default ScheduleAgencyManager;