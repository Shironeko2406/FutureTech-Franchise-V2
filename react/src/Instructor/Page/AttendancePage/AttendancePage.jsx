import React, { useState, useEffect, useMemo } from 'react';
import { Card, Avatar, Radio, Button, message, Row, Col, Statistic, Typography, Tooltip } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import './AttendancePage.css';
import { useDispatch } from 'react-redux';
import { SaveAttendanceActionAsync } from '../../../Redux/ReducerAPI/AttendanceReducer';
import { GetClassScheduleDetailsActionAsync } from '../../../Redux/ReducerAPI/ClassScheduleReducer';
import { useLoading } from '../../../Utils/LoadingContext';

const { Title, Text } = Typography;

export default function AttendancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheduleDetails, setScheduleDetails] = useState(null);
  const [attendance, setAttendance] = useState({});
  const dispatch = useDispatch();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setLoading(true);
      const details = await dispatch(GetClassScheduleDetailsActionAsync(id));
      setScheduleDetails(details);
      if (details.status) {
        const initialAttendance = {};
        details.studentInfo.forEach(student => {
          if (student.attendanceStatus !== "NotStarted") {
            initialAttendance[student.userId] = student.attendanceStatus === "Present";
          }
        });
        setAttendance(initialAttendance);
      }
      setLoading(false);
    };
    fetchScheduleDetails();
  }, [dispatch, id, setLoading]);

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
  };

  const handleSaveAttendance = async () => {
    const unmarkedStudents = scheduleDetails.studentInfo.filter(student => !(student.userId in attendance));
    if (unmarkedStudents.length > 0) {
      message.warning('Vui lòng điểm danh cho tất cả học sinh trước khi lưu.');
      return;
    }
    setLoading(true);
    const presentStudentIds = Object.keys(attendance).filter(id => attendance[id]);
    await dispatch(SaveAttendanceActionAsync(id, presentStudentIds));
    setLoading(false);
    navigate(`/instructor`);
  };

  const handleJoinClass = () => {
    if (scheduleDetails?.url) {
      window.open(scheduleDetails.url, '_blank');
    }
  };

  const attendanceStats = useMemo(() => {
    if (!scheduleDetails) return { present: 0, absent: 0, total: 0 };
    const present = Object.values(attendance).filter(Boolean).length;
    const absent = Object.values(attendance).filter(v => v === false).length;
    return { present, absent, total: scheduleDetails.studentInfo.length };
  }, [attendance, scheduleDetails]);

  if (!scheduleDetails) {
    return <div></div>;
  }

  return (
    <div className="attendance-page">
      <Card
        className="course-info-card"
        cover={
          <div className="course-info-header">
            <Title level={2}>{scheduleDetails.className}</Title>
            <Text className="course-code">{scheduleDetails.courseCode}</Text>
            {scheduleDetails.url && (
              <Button
                type="primary"
                icon={<VideoCameraOutlined />}
                onClick={handleJoinClass}
                className="join-class-button"
                size="large"
              >
                Vào lớp học
              </Button>
            )}
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Ngày học"
              value={scheduleDetails.date}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Thời gian"
              value={`${scheduleDetails.startTime} - ${scheduleDetails.endTime}`}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Tổng số học sinh"
              value={scheduleDetails.studentInfo.length}
              prefix={<UserOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} className="stats-row">
        <Col span={8}>
          <Card className="stats-row-card"          >
            <Statistic
              title="Có mặt"
              value={attendanceStats.present}
              suffix={`/ ${attendanceStats.total}`}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stats-row-card">
            <Statistic
              title="Vắng mặt"
              value={attendanceStats.absent}
              suffix={`/ ${attendanceStats.total}`}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stats-row-card" >
            <Statistic
              title="Chưa điểm danh"
              value={attendanceStats.total - attendanceStats.present - attendanceStats.absent}
              suffix={`/ ${attendanceStats.total}`}
              valueStyle={{ color: '#faad14' }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {scheduleDetails.studentInfo.map(student => (
          <Col key={student.userId} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className={`student-card ${attendance[student.userId] === undefined ? 'unmarked' : ''}`}
            >
              <Card.Meta
                avatar={<Avatar size={64} src={student.urlImage} icon={<UserOutlined />} />}
                title={student.studentName}
                description={student.userName}
              />
              <div className="attendance-buttons">
                <Radio.Group
                  className="radio-group"
                  onChange={(e) => handleAttendanceChange(student.userId, e.target.value)}
                  value={attendance[student.userId]}
                >
                  <Radio.Button value={true} className="attendance-button attendance-button-present">
                    <CheckCircleOutlined />
                    Có mặt
                  </Radio.Button>
                  <Radio.Button value={false} className="attendance-button attendance-button-absent">
                    <CloseCircleOutlined />
                    Vắng
                  </Radio.Button>
                </Radio.Group>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Button
        type="primary"
        onClick={handleSaveAttendance}
        className="save-button"
        size="large"
        style={{ marginTop: '24px', width: '100%', height: '48px' }}
      >
        Lưu điểm danh
      </Button>
    </div>
  );
}

