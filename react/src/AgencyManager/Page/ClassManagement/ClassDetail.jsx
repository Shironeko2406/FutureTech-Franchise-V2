import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetClassDetailActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import { Card, Descriptions, Table, Avatar, Typography, Spin, Row, Col, Tag, Badge } from 'antd';
import { UserOutlined, BookOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ClassDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { classDetail } = useSelector((state) => state.ClassReducer);

    useEffect(() => {
        dispatch(GetClassDetailActionAsync(id));
    }, [dispatch, id]);

    if (!classDetail) return <Spin size="large" />;

    const columns = [
        {
            title: 'Hình đại diện',
            dataIndex: 'urlImage',
            key: 'urlImage',
            width: '130px',
            align: 'center',
            render: (text) => (
                <div className="flex justify-center">
                    <Avatar
                        size={45}
                        src={text}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#1890ff',
                            border: '2px solid #e6f7ff'
                        }}
                    />
                </div>
            ),
        },
        {
            title: 'Tên Học Viên',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text) => (
                <span style={{ fontWeight: '500', color: '#262626' }}>{text}</span>
            ),
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (text) => (
                <Tag
                    color="blue"
                    style={{
                        padding: '4px 12px',
                        fontSize: '14px',
                        borderRadius: '6px'
                    }}
                >
                    {new Date(text).toLocaleDateString()}
                </Tag>
            ),
        },
        {
            title: 'Tên Đăng Nhập',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => (
                <Tag
                    color="cyan"
                    style={{
                        padding: '4px 12px',
                        fontSize: '14px',
                        borderRadius: '6px'
                    }}
                >
                    {text}
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card
                style={{
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
            >
                <Row justify="center" align="middle" gutter={[0, 24]}>
                    <Col span={24}>
                        <Badge.Ribbon text="Active" color="green">
                            <Title level={2} style={{
                                color: '#1890ff',
                                textAlign: 'center',
                                margin: '0 32px',
                                background: 'linear-gradient(to right, #1890ff, #69c0ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {classDetail.className}
                            </Title>
                        </Badge.Ribbon>
                    </Col>

                    <Col span={24}>
                        <Card
                            type="inner"
                            style={{
                                borderRadius: '12px',
                                background: '#f8f9fa',
                                border: '1px solid #e8e8e8'
                            }}
                        >
                            <Row gutter={[24, 24]}>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <BookOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                                        <div>
                                            <div style={{ color: '#8c8c8c', fontSize: '14px' }}>Tên Khóa Học</div>
                                            <div style={{ fontWeight: '500', fontSize: '16px' }}>{classDetail.courseName}</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <UserOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                                        <div>
                                            <div style={{ color: '#8c8c8c', fontSize: '14px' }}>Giảng Viên</div>
                                            <div style={{ fontWeight: '500', fontSize: '16px' }}>{classDetail.instructorName}</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <TeamOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                                        <div>
                                            <div style={{ color: '#8c8c8c', fontSize: '14px' }}>Sức chứa</div>
                                            <div style={{ fontWeight: '500', fontSize: '16px' }}>
                                                <Tag color="blue">{classDetail.currentEnrollment}/{classDetail.capacity}</Tag>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CalendarOutlined style={{ color: '#1890ff' }} />
                                <span>Lịch Học</span>
                            </div>
                        }
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12}>
                                <Tag color="purple" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    {classDetail.dayOfWeek}
                                </Tag>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Tag color="cyan" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    <ClockCircleOutlined style={{ marginRight: '8px' }} />
                                    08:00:00 - 11:00:00
                                </Tag>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TeamOutlined style={{ color: '#1890ff' }} />
                                <span>Danh Sách Học Viên</span>
                            </div>
                        }
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Table
                            bordered
                            dataSource={classDetail.studentInfo}
                            columns={columns}
                            rowKey="userId"
                            pagination={{
                                pageSize: 5,
                                showTotal: (total) => `Tổng số ${total} học viên`
                            }}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #e8e8e8'
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ClassDetail;