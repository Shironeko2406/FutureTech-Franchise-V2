import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Descriptions, Tag, List, Avatar } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const AgencyStaffAppointmentDetail = () => {
    const { selectedAppointment } = useSelector((state) => state.AppointmentReducer);
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedAppointment) {
            navigate('/agency-manager/appointment-schedule');
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
        status,
        type,
        user,
    } = selectedAppointment;

    const typeText = type === 'Internal' ? 'Họp nội bộ' : 'Họp với chi nhánh';

    return (
        <Card title="Chi tiết lịch hẹn">
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tiêu đề">{title}</Descriptions.Item>
                <Descriptions.Item label="Thời gian bắt đầu">
                    <ClockCircleOutlined /> {new Date(startTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian kết thúc">
                    <ClockCircleOutlined /> {new Date(endTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
                </Descriptions.Item>
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
        </Card>
    );
};

export default AgencyStaffAppointmentDetail;