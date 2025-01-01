import React, { useState } from 'react';
import { Card, Button, Steps, Progress, Row, Col, Typography, Space, Radio, Divider, Tag, List, Avatar, Tooltip } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const mockClasses = [
  { id: '1', dayOfWeek: 'Thứ 2, Thứ 4', time: '18:00 - 21:00', startDate: '2023-07-01', instructor: 'Nguyễn Văn A', currentStudents: 15, maxStudents: 20, totalLessons: 20, completedLessons: 5 },
  { id: '2', dayOfWeek: 'Thứ 3, Thứ 5', time: '19:00 - 22:00', startDate: '2023-07-15', instructor: 'Trần Thị B', currentStudents: 12, maxStudents: 20, totalLessons: 24, completedLessons: 3 },
  { id: '3', dayOfWeek: 'Thứ 7, Chủ nhật', time: '09:00 - 12:00', startDate: '2023-08-01', instructor: 'Lê Văn C', currentStudents: 18, maxStudents: 20, totalLessons: 16, completedLessons: 0 },
];

const mockCourses = [
  { id: '1', name: 'Lập trình Web Frontend' },
  { id: '2', name: 'Lập trình Web Backend' },
  { id: '3', name: 'Lập trình Mobile' },
  { id: '4', name: 'Trí tuệ nhân tạo' },
];

const Schedule = () => {
  const [registrationData, setRegistrationData] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const handleSubmit = () => {
    const finalData = {
      ...registrationData,
      class: selectedClass?.id,
    };
    console.log('Final submission:', finalData);
    // Handle submission
  };

  const getSelectedCourseName = () => {
    if (!registrationData?.course) return '';
    const course = mockCourses.find(c => c.id === registrationData.course);
    return course?.name || '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-6" style={{ maxWidth: '800px' }}>
        <Card className="shadow-lg rounded-lg p-6">
          <Steps current={1} className="mb-8">
            <Step title="Chọn khóa học" />
            <Step title="Chọn lịch học" />
            <Step title="Thanh toán" />
          </Steps>

          <div className="text-center mb-8">
            <Title level={2} className="mb-4">Lịch Học</Title>
            {getSelectedCourseName() && (
              <Text strong className="text-lg text-gray-600">
                {getSelectedCourseName()}
              </Text>
            )}
          </div>

          <Divider />

          <div className="space-y-8">
            <div>
              <Title level={4} className="mb-6">1. Chọn thời gian học</Title>

              <div className="mb-8">
                <Text strong className="text-base mb-4 block text-gray-700">
                  Ngày học trong tuần
                </Text>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
                    <Button
                      key={day}
                      type={selectedDays.includes(day) ? 'primary' : 'default'}
                      onClick={() => setSelectedDays(prev =>
                        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                      )}
                      className={`h-12 rounded-lg flex items-center justify-center ${selectedDays.includes(day)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                        }`}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Text strong className="text-base mb-4 block text-gray-700">
                  Thời gian học
                </Text>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'Sáng', time: '09:00 - 12:00', icon: '🌅' },
                    { label: 'Chiều', time: '14:00 - 17:00', icon: '🌤️' },
                    { label: 'Tối', time: '18:00 - 21:00', icon: '🌙' }
                  ].map(({ label, time, icon }) => (
                    <div
                      key={label}
                      onClick={() => setSelectedTime(label)}
                      className={`cursor-pointer w-full sm:w-auto flex-1 sm:flex-none ${selectedTime === label
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:border-blue-500 hover:text-blue-500'
                        } border rounded-lg p-4 transition-all duration-200`}
                    >
                      <div className={`flex items-center justify-center gap-2 ${selectedTime === label ? 'text-white' : 'text-gray-600'
                        }`}>
                        <span className="text-lg">{icon}</span>
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{label}</span>
                          <span className="text-sm opacity-85">{time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedDays.length > 0 && selectedTime && (
              <>
                <Divider />
                <Title level={4} className="mb-4">2. Chọn lớp học phù hợp</Title>
                <List
                  itemLayout="vertical"
                  dataSource={mockClasses}
                  renderItem={(classItem) => (
                    <List.Item
                      key={classItem.id}
                      actions={[
                        <Button
                          key="select"
                          type={selectedClass?.id === classItem.id ? 'primary' : 'default'}
                          onClick={() => setSelectedClass(classItem)}
                          icon={selectedClass?.id === classItem.id ? <CheckCircleOutlined /> : null}
                          className="px-4 py-2"
                        >
                          {selectedClass?.id === classItem.id ? 'Đã chọn' : 'Chọn lớp này'}
                        </Button>
                      ]}
                      className="bg-white rounded-lg shadow-md mb-4 p-4"
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<CalendarOutlined />} size={48} className="bg-blue-500" />}
                        title={
                          <Space className="text-lg">
                            <Text strong>{classItem.dayOfWeek}</Text>
                            <Tag color="blue">{classItem.time}</Tag>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" className="mt-2">
                            <Text><CalendarOutlined className="mr-2" /> Bắt đầu: {moment(classItem.startDate).format('DD/MM/YYYY')}</Text>
                            <Text><UserOutlined className="mr-2" /> Giảng viên: {classItem.instructor}</Text>
                          </Space>
                        }
                      />
                      <Row gutter={16} align="middle" className="mt-4">
                        <Col span={12}>
                          <Tooltip title={`${classItem.currentStudents}/${classItem.maxStudents} học viên`}>
                            <Text strong className="mb-2 block">Sĩ số lớp học</Text>
                            <Progress
                              percent={(classItem.currentStudents / classItem.maxStudents) * 100}
                              format={() => `${classItem.currentStudents}/${classItem.maxStudents}`}
                            />
                          </Tooltip>
                        </Col>
                        <Col span={12}>
                          <Tooltip title={`${classItem.completedLessons}/${classItem.totalLessons} buổi học đã hoàn thành`}>
                            <Text strong className="mb-2 block">Tiến độ khóa học</Text>
                            <Progress
                              percent={(classItem.completedLessons / classItem.totalLessons) * 100}
                              format={() => `${classItem.completedLessons}/${classItem.totalLessons}`}
                            />
                          </Tooltip>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </>
            )}

            {selectedClass && (
              <>
                <Divider />
                <Title level={4} className="mb-4">3. Xác nhận đăng ký</Title>
                <Card className="bg-blue-50 mb-4">
                  <Paragraph>
                    Bạn đã chọn lớp học vào <Text strong>{selectedClass.dayOfWeek}</Text>,
                    thời gian <Text strong>{selectedClass.time}</Text>,
                    bắt đầu từ ngày <Text strong>{moment(selectedClass.startDate).format('DD/MM/YYYY')}</Text>.
                  </Paragraph>
                </Card>
                <Button type="primary" size="large" onClick={handleSubmit} block className="mt-4">
                  Đăng ký và thanh toán
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;

