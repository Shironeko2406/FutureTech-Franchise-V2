import React from 'react';
import { Row, Col, Progress, Table, Typography } from 'antd';
import { CheckCircleFilled, ClockCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import "./AttendanceReport.css";

const { Title } = Typography;

const AttendanceReport = () => {
    // Mock data
    const courseData = {
        courseCode: 'MLN131',
        courseName: 'Scientific socialism',
        className: 'AI1705_Half 1',
        stats: {
            present: 9,
            absent: 1,
            future: 1,
            total: 10
        }
    };

    const sessions = [
        {
            key: '1',
            date: '07/09/2024',
            slot: 4,
            lecturer: 'LamTD8',
            status: 'attended'
        },
        {
            key: '2',
            date: '11/09/2024',
            slot: 4,
            lecturer: 'LamTD8',
            status: 'absent'
        },
        {
            key: '3',
            date: '14/09/2024',
            slot: 4,
            lecturer: 'LamTD8',
            status: 'future'
        },
        {
            key: '4',
            date: '21/09/2024',
            slot: 4,
            lecturer: 'LamTD8',
            status: 'future'
        }
    ];

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
        },
        {
            title: 'Slot',
            dataIndex: 'slot',
            key: 'slot',
            align: 'center',
        },
        {
            title: 'Giảng viên',
            dataIndex: 'lecturer',
            key: 'lecturer',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                switch (status) {
                    case 'attended':
                        return <CheckCircleFilled style={{ fontSize: '24px', color: '#52c41a' }} />;
                    case 'absent':
                        return <CloseCircleFilled style={{ fontSize: '24px', color: '#ff4d4f' }} />;
                    case 'future':
                        return <ClockCircleFilled style={{ fontSize: '24px', color: '#faad14' }} />;
                    default:
                        return null;
                }
            },
        },
    ];

    // Calculate attendance percentage
    const attendancePercentage = Math.round((courseData.stats.present / courseData.stats.total) * 100);

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
                                    format={() => `${courseData.stats.present}/${courseData.stats.total}`}
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
                                        <div className="stat-value">{courseData.stats.present}</div>
                                        <div className="stat-label">Có mặt</div>
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="stat-container">
                                        <div className="stat-icon-wrapper status-absent">
                                            <CloseCircleFilled />
                                        </div>
                                        <div className="stat-value">{courseData.stats.absent}</div>
                                        <div className="stat-label">Vắng mặt</div>
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="stat-container">
                                        <div className="stat-icon-wrapper status-future">
                                            <ClockCircleFilled />
                                        </div>
                                        <div className="stat-value">{courseData.stats.future}</div>
                                        <div className="stat-label">Sắp tới</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={sessions}
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

