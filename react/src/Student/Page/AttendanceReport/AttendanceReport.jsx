import React, { useEffect, useState } from 'react';
import { Row, Col, Progress, Table, Typography } from 'antd';
import { CheckCircleFilled, ClockCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetClassScheduleStudentActionAsync } from '../../../Redux/ReducerAPI/ClassScheduleReducer';
import { useLoading } from '../../../Utils/LoadingContext';
import "./AttendanceReport.css";

const { Title } = Typography;

const AttendanceReport = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { setLoading } = useLoading();
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        const fetchAttendanceReport = async () => {
            setLoading(true);
            const data = await dispatch(GetClassScheduleStudentActionAsync(id));
            setCourseData(data);
            setLoading(false);
        };
        fetchAttendanceReport();
    }, [dispatch, id, setLoading]);

    if (!courseData) {
        return <div>Loading...</div>;
    }

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (date) => new Date(date).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
        },
        {
            title: 'Giờ học',
            dataIndex: 'slot',
            key: 'slot',
            align: 'center',
            render: (_, record) => `${record.startTime} đến ${record.endTime}`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'attendanceStatus',
            key: 'attendanceStatus',
            align: 'center',
            render: (status) => {
                switch (status) {
                    case 'Present':
                        return <CheckCircleFilled style={{ fontSize: '24px', color: '#52c41a' }} />;
                    case 'Absent':
                        return <CloseCircleFilled style={{ fontSize: '24px', color: '#ff4d4f' }} />;
                    case 'NotStarted':
                        return <ClockCircleFilled style={{ fontSize: '24px', color: '#faad14' }} />;
                    default:
                        return null;
                }
            },
        },
    ];

    const attendancePercentage = Math.round((courseData.present / (courseData.total - courseData.future)) * 100);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Chi tiết điểm danh</h5>

                <Title level={4} className="course-title">
                    {courseData.courseCode} - {courseData.courseName}
                </Title>

                <Row gutter={[24, 24]} className="mb-4">
                    <Col xs={24} lg={8}>
                        <div className="stats-card attendance-circle-card">
                            <div className="circle-wrapper">
                                <Progress
                                    type="circle"
                                    percent={attendancePercentage}
                                    format={() => `${courseData.present}/${courseData.total - courseData.future}`}
                                    strokeColor={{
                                        '0%': '#95de64',
                                        '100%': '#52c41a'
                                    }}
                                    size={180}
                                />
                                <div className="class-name">
                                    <Typography.Text>
                                        Lớp: {courseData.className}
                                    </Typography.Text>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={16}>
                        <div className="stats-card stats-summary">
                            <Row gutter={[32, 32]} justify="space-around" align="middle" className="stats-row">
                                <Col xs={8}>
                                    <div className="stat-container">
                                        <div className="stat-icon-wrapper status-present">
                                            <CheckCircleFilled />
                                        </div>
                                        <div className="stat-value">{courseData.present}</div>
                                        <div className="stat-label">Có mặt</div>
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="stat-container">
                                        <div className="stat-icon-wrapper status-absent">
                                            <CloseCircleFilled />
                                        </div>
                                        <div className="stat-value">{courseData.absent}</div>
                                        <div className="stat-label">Vắng mặt</div>
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="stat-container">
                                        <div className="stat-icon-wrapper status-future">
                                            <ClockCircleFilled />
                                        </div>
                                        <div className="stat-value">{courseData.future}</div>
                                        <div className="stat-label">Sắp tới</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={courseData.classSchedules}
                    pagination={false}
                    bordered
                    className="attendance-table"
                    scroll={{ y: 400 }}
                />
            </div>
        </div>
    );
};

export default AttendanceReport;

