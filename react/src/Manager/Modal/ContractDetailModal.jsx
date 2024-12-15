import React from 'react';
import { Modal, Typography, Descriptions, Card, Tag, Space, Divider, Row, Col, Button } from 'antd';
import { CalendarOutlined, DollarOutlined, PercentageOutlined, FileOutlined, BankOutlined, CheckCircleOutlined, ToolOutlined, LaptopOutlined, ShopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ContractDetailModal = ({ visible, onClose, contractDetail }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'green';
            case 'pending': return 'orange';
            case 'expired': return 'red';
            default: return 'default';
        }
    };

    const translateStatus = (status) => {
        const translations = {
            'active': 'Đang hoạt động',
            'expired': 'Đã hết hạn',
        };
        return translations[status.toLowerCase()] || status;
    };

    const FinancialItem = ({ icon, label, value, color }) => (
        <div className="mb-4">
            <Space align="center" style={{ width: '100%' }}>
                {React.cloneElement(icon, { style: { fontSize: '24px', color } })}
                <Text strong style={{ minWidth: '150px' }}>{label}</Text>
                <Text>{value}</Text>
            </Space>
        </div>
    );

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
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
                        <div style={{ padding: '0 16px' }}>
                            <Row gutter={[32, 0]}>
                                <Col span={12}>
                                    <FinancialItem
                                        icon={<ShopOutlined />}
                                        label="Phí nhượng quyền:"
                                        value={`${Number(contractDetail.frachiseFee).toLocaleString('vi-VN')} VND`}
                                        color="#1890ff"
                                    />
                                    <FinancialItem
                                        icon={<ToolOutlined />}
                                        label="Phí thiết kế:"
                                        value={`${Number(contractDetail.designFee).toLocaleString('vi-VN')} VND`}
                                        color="#722ed1"
                                    />
                                    <FinancialItem
                                        icon={<LaptopOutlined />}
                                        label="Phí trang thiết bị:"
                                        value={`${Number(contractDetail.equipmentFee).toLocaleString('vi-VN')} VND`}
                                        color="#fa8c16"
                                    />
                                </Col>
                                <Col span={12}>
                                    <FinancialItem
                                        icon={<PercentageOutlined />}
                                        label="Tỷ lệ chia sẻ doanh thu:"
                                        value={`${contractDetail.revenueSharePercentage}%`}
                                        color="#faad14"
                                    />
                                    <FinancialItem
                                        icon={<BankOutlined />}
                                        label="Phần trăm trả trước:"
                                        value={`${contractDetail.depositPercentage}%`}
                                        color="#eb2f96"
                                    />
                                    <FinancialItem
                                        icon={<CheckCircleOutlined />}
                                        label="Số tiền đã trả:"
                                        value={`${Number(contractDetail.paidAmount).toLocaleString('vi-VN')} VND`}
                                        color="#13c2c2"
                                    />
                                </Col>
                            </Row>
                            <Divider style={{ margin: '16px 0' }} />
                            <FinancialItem
                                icon={<DollarOutlined />}
                                label="Tổng số tiền:"
                                value={`${Number(contractDetail.total).toLocaleString('vi-VN')} VND`}
                                color="#52c41a"
                            />
                        </div>

                        {contractDetail.contractDocumentImageURL && (
                            <>
                                <Divider orientation="left">Tài liệu</Divider>
                                <Space>
                                    <FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                    <Button type="link" onClick={() => handleDownload(contractDetail.contractDocumentImageURL)}>
                                        Xem tài liệu hợp đồng
                                    </Button>
                                </Space>
                            </>
                        )}
                    </Space>
                </Card>
            )}
        </Modal>
    );
};

export default ContractDetailModal;

