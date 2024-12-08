import React from 'react';
import { Modal, Typography, Descriptions, Card, Tag, Space, Divider } from 'antd';
import { CalendarOutlined, DollarOutlined, PercentageOutlined, FileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ContractDetailModal = ({ visible, onClose, contractDetail }) => {

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' } }}
        >
            {contractDetail && (
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Title level={3}>Chi tiết hợp đồng</Title>
                        </div>

                        <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
                            <Descriptions.Item label="Tên đối tác">
                                <Text strong>{contractDetail.agencyName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêu đề">
                                {contractDetail.title}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Thông tin thời gian</Divider>
                        <Space>
                            <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Descriptions column={2}>
                                <Descriptions.Item label="Ngày bắt đầu">
                                    {dayjs(contractDetail.startTime).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày kết thúc">
                                    {dayjs(contractDetail.endTime).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>

                        <Divider orientation="left">Thông tin tài chính</Divider>
                        <Space>
                            <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                            <Text strong>Tổng số tiền: </Text>
                            <Text>{Number(contractDetail.total).toLocaleString('vi-VN')} VND</Text>
                        </Space>
                        <Space>
                            <PercentageOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                            <Text strong>Tỷ lệ chia sẻ doanh thu: </Text>
                            <Text>{contractDetail.revenueSharePercentage}%</Text>
                        </Space>

                        <Divider orientation="left">Tài liệu</Divider>
                        <Space>
                            <FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <a href={contractDetail.contractDocumentImageURL} target="_blank" rel="noopener noreferrer">
                                Xem tài liệu hợp đồng
                            </a>
                        </Space>
                    </Space>
                </Card>
            )}
        </Modal>
    );
};

export default ContractDetailModal;

