import React, { useState, useMemo } from 'react';
import { Card, Avatar, Radio, Button, message, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './AttendancePage.css';

const { Title, Text } = Typography;

// Giả định dữ liệu môn học
const courseInfo = {
  code: 'CS101',
  name: 'Lập trình cơ bản',
  date: '2023-11-05',
  time: '08:00 - 10:00',
};

// Giả định danh sách học sinh
const students = [
  { id: 1, name: 'Nguyễn Văn A', username: 'nguyenvana', avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1' },
  { id: 2, name: 'Trần Thị B', username: 'tranthib', avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2' },
  { id: 3, name: 'Lê Văn C', username: 'levanc', avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=3' },
  { id: 4, name: 'Phạm Thị D', username: 'phamthid', avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=4' },
  { id: 5, name: 'Hoàng Văn E', username: 'hoangvane', avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=5' },
  { id: 6, name: 'Ngô Thị F', username: 'ngothif', avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=6' },
];

export default function AttendancePage() {
  const [attendance, setAttendance] = useState({});

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
  };

  const handleSaveAttendance = () => {
    console.log('Attendance saved:', attendance);
    message.success('Điểm danh đã được lưu thành công!');
  };

  const attendanceStats = useMemo(() => {
    const present = Object.values(attendance).filter(Boolean).length;
    const absent = Object.values(attendance).filter(v => v === false).length;
    return { present, absent, total: students.length };
  }, [attendance]);

  return (
    <div className="attendance-page">
      <Card
        className="course-info-card"
        cover={
          <div className="course-info-header">
            <Title level={2} className="course-title">{courseInfo.name}</Title>
            <Text className="course-code">{courseInfo.code}</Text>
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Ngày học"
              value={courseInfo.date}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Thời gian"
              value={courseInfo.time}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Tổng số học sinh"
              value={students.length}
              prefix={<UserOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} className="stats-row">
        <Col span={8}>
          <Card>
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
          <Card>
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
          <Card>
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
        {students.map(student => (
          <Col key={student.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="student-card"
            >
              <Card.Meta
                avatar={<Avatar size={64} src={student.avatar} icon={<UserOutlined />} />}
                title={student.name}
                description={student.username}
              />
              <div className="attendance-buttons">
                <Radio.Group
                  className="radio-group"
                  onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                  value={attendance[student.id]}
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