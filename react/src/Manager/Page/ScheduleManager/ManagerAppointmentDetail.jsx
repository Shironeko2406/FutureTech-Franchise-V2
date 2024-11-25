import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Descriptions, Tag, List, Avatar, Form, Input, Select, Button } from 'antd';
import { UserOutlined, ClockCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ManagerAppointmentDetail = () => {
    const { selectedAppointment } = useSelector((state) => state.AppointmentReducer);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedAppointment) {
            navigate('manager/appointment-schedule');
        }
    }, [selectedAppointment, navigate]);

    if (!selectedAppointment) {
        return null;
    }

    const {
        title,
        startTime,
        endTime,
        description,
        report,
        reportImageURL,
        status,
        type,
        user,
    } = selectedAppointment;

    const typeText = type === 'Internal' ? 'Họp nội bộ' : 'Họp với chi nhánh';

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'Cancelled':
                return 'error';
            case 'None':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        const currentDate = new Date();
        if (new Date(startTime) > currentDate) {
            return 'Chưa tới ngày';
        }
        switch (status) {
            case 'Completed':
                return 'Hoàn thành';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return 'Chưa báo cáo';
        }
    };

    const onFinish = (values) => {
        console.log('Báo cáo đã được gửi:', values);
    };

    const isFutureAppointment = new Date(startTime) > new Date();
    const isReportAvailable = status === 'Completed' || status === 'Cancelled';

    return (
        <Card title="Chi tiết lịch hẹn" extra={<Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>}>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tiêu đề">{title}</Descriptions.Item>
                <Descriptions.Item label="Thời gian bắt đầu">
                    <ClockCircleOutlined /> {new Date(startTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian kết thúc">
                    <ClockCircleOutlined /> {new Date(endTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">{description}</Descriptions.Item>
                <Descriptions.Item label="Loại">{typeText}</Descriptions.Item>
            </Descriptions>

            <Card
                style={{ marginTop: 16 }}
                type="inner"
                title="Người tham gia"
            >
                <List
                    itemLayout="horizontal"
                    dataSource={user}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={item.username}
                                description={item.fullName}
                            />
                        </List.Item>
                    )}
                />
            </Card>

            {isReportAvailable && (
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Báo cáo"
                >
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Nội dung báo cáo">{report}</Descriptions.Item>
                        <Descriptions.Item label="URL báo cáo">
                            <a href={reportImageURL} target="_blank" rel="noopener noreferrer">
                                <FilePdfOutlined /> {reportImageURL}
                            </a>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}

            {!isFutureAppointment && !isReportAvailable && (
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Báo cáo"
                >
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item name="report" label="Nội dung báo cáo">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="reportImageURL" label="URL báo cáo">
                            <Input prefix={<FilePdfOutlined />} />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái">
                            <Select>
                                <Option value="Completed">Hoàn thành</Option>
                                <Option value="Cancelled">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Gửi báo cáo
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </Card>
    );
};

export default ManagerAppointmentDetail;

