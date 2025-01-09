import React, { useState, useEffect } from 'react';
import { Steps, Divider, Typography, message, Spin } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GetClassesForStudentByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/ClassReducer';
// import { RegisterCourseActionAsync } from "../../../Redux/ReducerAPI/RegisterCourseReducer";
import * as S from './RegisCourseStudentStyles';
import { RegisterCourseStudentActionAsync } from '../../../Redux/ReducerAPI/UserReducer';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const translateDayOfWeek = (dayOfWeekString) => {
    const dayTranslation = {
        Monday: "Thứ Hai",
        Tuesday: "Thứ Ba",
        Wednesday: "Thứ Tư",
        Thursday: "Thứ Năm",
        Friday: "Thứ Sáu",
        Saturday: "Thứ Bảy",
        Sunday: "Chủ Nhật",
    };

    return dayOfWeekString.split(/, ?/).map(day => dayTranslation[day.trim()] || day.trim()).join(", ");
};

const timeSlots = [
    { id: 'morning', label: 'Sáng', time: '07:00 - 12:00', icon: '🌅' },
    { id: 'afternoon', label: 'Chiều', time: '13:00 - 18:00', icon: '🌤️' },
    { id: 'evening', label: 'Tối', time: '18:00 - 21:00', icon: '🌙' }
];

const RegisCourseStudent = () => {
    const location = useLocation();
    const registrationData = location.state?.registrationData;
    console.log('registrationData:', registrationData);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { classes } = useSelector((state) => state.ClassReducer);

    useEffect(() => {
        if (registrationData) {
            dispatch(GetClassesForStudentByAgencyIdActionAsync(registrationData.courseId, registrationData.agencyId));
        } else {
            message.error('No registration data found');
        }
    }, [dispatch, registrationData]);

    const filteredClasses = classes.filter(classItem => {
        const classDays = classItem.dayOfWeek.split(/, ?/).map(day => translateDayOfWeek(day.trim()));
        const selectedDaysMatch = selectedDays.some(day => classDays.includes(day));

        const classStartTime = moment(classItem.slotStart, 'HH:mm:ss');
        const classEndTime = moment(classItem.slotEnd, 'HH:mm:ss');
        const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedTime);
        if (!selectedTimeSlot) return false;
        const selectedStartTime = moment(selectedTimeSlot.time.split(' - ')[0], 'HH:mm');
        const selectedEndTime = moment(selectedTimeSlot.time.split(' - ')[1], 'HH:mm');

        const timeMatch = classStartTime.isBefore(selectedEndTime) && classEndTime.isAfter(selectedStartTime);

        return selectedDaysMatch && timeMatch;
    });

    const handleSubmit = async () => {
        if (selectedClass) {
            setIsLoading(true);
            const response = await dispatch(RegisterCourseStudentActionAsync(selectedClass.id));
            setIsLoading(false);
            if (response.isSuccess && response.data) {
                window.location.href = response.data;
            } else {
                message.error('Registration failed');
            }
        } else {
            message.error('Vui lòng chọn một lớp học trước khi đăng ký.');
        }
    };

    return (
        <S.ScheduleContainer>
            <S.ScheduleWrapper>
                <S.ScheduleCard>
                    <Steps current={1} style={{ marginBottom: '2rem' }}>
                        <Step title="Chọn khóa học" />
                        <Step title="Chọn lịch học" />
                        <Step title="Thanh toán" />
                    </Steps>

                    <S.ScheduleTitle>Lịch Học</S.ScheduleTitle>
                    <S.ScheduleSubtitle>{registrationData?.courseName}</S.ScheduleSubtitle>

                    <Divider />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <S.SectionTitle>1. Chọn thời gian học</S.SectionTitle>

                            <div style={{ marginBottom: '2rem' }}>
                                <Text strong style={{ fontSize: '1rem', marginBottom: '1rem', display: 'block', color: '#4b5563' }}>
                                    Ngày học trong tuần
                                </Text>
                                <S.DaySelector>
                                    {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map((day) => (
                                        <S.DayButton
                                            key={day}
                                            type={selectedDays.includes(day) ? 'primary' : 'default'}
                                            onClick={() => setSelectedDays(prev =>
                                                prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                                            )}
                                        >
                                            {day}
                                        </S.DayButton>
                                    ))}
                                </S.DaySelector>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Text strong style={{ fontSize: '1rem', marginBottom: '1rem', display: 'block', color: '#4b5563' }}>
                                    Thời gian học
                                </Text>
                                <S.TimeSlotContainer>
                                    {timeSlots.map(slot => (
                                        <S.TimeSlot
                                            key={slot.id}
                                            as={selectedTime === slot.id ? S.TimeSlotSelected : S.TimeSlot}
                                            onClick={() => setSelectedTime(slot.id)}
                                        >
                                            <S.TimeSlotIcon>{slot.icon}</S.TimeSlotIcon>
                                            <S.TimeSlotContent>
                                                <S.TimeSlotTitle>{slot.label}</S.TimeSlotTitle>
                                                <S.TimeSlotTime>{slot.time}</S.TimeSlotTime>
                                            </S.TimeSlotContent>
                                        </S.TimeSlot>
                                    ))}
                                </S.TimeSlotContainer>
                            </div>
                        </div>

                        {selectedDays.length > 0 && selectedTime && (
                            <>
                                <Divider />
                                <div>
                                    <S.SectionTitle style={{ marginBottom: '2rem' }}>2. Chọn lớp học phù hợp</S.SectionTitle>

                                    {filteredClasses.length > 0 ? (
                                        filteredClasses.map(classItem => (
                                            <S.ClassCard key={classItem.id}>
                                                <S.ClassHeader>
                                                    <CalendarOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
                                                    <S.ClassInfo>
                                                        <S.ClassSchedule>
                                                            {translateDayOfWeek(classItem.dayOfWeek)}
                                                            <S.ClassTimeTag>{classItem.slotStart} - {classItem.slotEnd}</S.ClassTimeTag>
                                                        </S.ClassSchedule>
                                                        <S.ClassDetails>
                                                            <S.ClassDetail>
                                                                <CalendarOutlined /> Bắt đầu: {moment(classItem.startDate).format('DD/MM/YYYY')}
                                                            </S.ClassDetail>
                                                            <S.ClassDetail>
                                                                <UserOutlined /> Giảng viên: {classItem.instructorName}
                                                            </S.ClassDetail>
                                                        </S.ClassDetails>
                                                    </S.ClassInfo>
                                                    <S.DayButton
                                                        type={selectedClass?.id === classItem.id ? 'primary' : 'default'}
                                                        onClick={() => setSelectedClass(classItem)}
                                                    >
                                                        {selectedClass?.id === classItem.id ? 'Đã chọn' : 'Chọn lớp này'}
                                                    </S.DayButton>
                                                </S.ClassHeader>

                                                <S.ProgressSection>
                                                    <div>
                                                        <S.ProgressTitle>Sĩ số lớp học</S.ProgressTitle>
                                                        <S.StyledProgress
                                                            percent={(classItem.currentEnrollment / classItem.capacity) * 100}
                                                            format={() => `${classItem.currentEnrollment}/${classItem.capacity}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <S.ProgressTitle>Tiến độ khóa học</S.ProgressTitle>
                                                        <S.StyledProgress
                                                            percent={(classItem.daysElapsed / classItem.totalLessons) * 100}
                                                            format={() => `${classItem.daysElapsed}/${classItem.totalLessons}`}
                                                        />
                                                    </div>
                                                </S.ProgressSection>
                                            </S.ClassCard>
                                        ))
                                    ) : (
                                        <Text>Không có lớp học nào phù hợp với lựa chọn của bạn.</Text>
                                    )}
                                </div>
                            </>
                        )}

                        {selectedClass && (
                            <>
                                <Divider />
                                <div style={{ marginBottom: '1rem' }}>
                                    <S.SectionTitle style={{ marginBottom: '2rem' }}>3. Xác nhận đăng ký</S.SectionTitle>
                                    <S.ConfirmationCard>
                                        <Paragraph>
                                            Thông tin đăng ký:
                                            <br />Tên: <Text strong>{registrationData?.studentName}</Text>
                                            <br />Số điện thoại: <Text strong>{registrationData?.phoneNumber}</Text>
                                            <br />Email: <Text strong>{registrationData?.email}</Text>
                                            <br />Khóa học: <Text strong>{registrationData?.courseName}</Text>
                                            {/* <br />Địa chỉ trung tâm: <Text strong>{registrationData?.agencyFullAddress}</Text> */}
                                            <br />Lịch học: <Text strong>{`${translateDayOfWeek(selectedClass.dayOfWeek)} - ${selectedClass.slotStart} đến ${selectedClass.slotEnd}`}</Text>
                                            <br />Ngày bắt đầu: <Text strong>{moment(selectedClass.startDate).format('DD/MM/YYYY')}</Text>
                                        </Paragraph>
                                    </S.ConfirmationCard>
                                    <Spin spinning={isLoading}>
                                        <S.SubmitButton type="primary" size="large" onClick={handleSubmit} disabled={isLoading}>
                                            Đăng ký và thanh toán
                                        </S.SubmitButton>
                                    </Spin>
                                </div>
                            </>
                        )}
                    </div>
                </S.ScheduleCard>
            </S.ScheduleWrapper>
        </S.ScheduleContainer>
    );
};

export default RegisCourseStudent;

