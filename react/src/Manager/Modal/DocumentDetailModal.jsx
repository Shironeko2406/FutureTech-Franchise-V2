import React from 'react';
import { Modal, Typography, Descriptions, Card, Tag, Space, Divider } from 'antd';
import { CalendarOutlined, FileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const DocumentDetailModal = ({ visible, onClose, documentDetail }) => {
    const getTitle = (type) => {
        switch (type) {
            case 'AgreementContract':
                return 'Thông tin giấy thỏa thuận nguyên tắc';
            case 'BusinessLicense':
                return 'Thông tin giấy đăng ký doanh nghiệp';
            case 'EducationalOperationLicense':
                return 'Thông tin giấy đăng ký giấy phép giáo dục';
            default:
                return 'Chi tiết tài liệu';
        }
    };

    const getExpirationLabel = (type) => {
        switch (type) {
            case 'AgreementContract':
                return 'Ngày kết thúc thỏa thuận';
            case 'BusinessLicense':
                return 'Ngày hết hạn giấy phép';
            case 'EducationalOperationLicense':
                return 'Ngày hết hạn giấy phép';
            default:
                return 'Ngày hết hạn';
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
            styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' } }}
        >
            {documentDetail && (
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Title level={3}>{getTitle(documentDetail.type)}</Title>
                        </div>

                        <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
                            <Descriptions.Item label="Tên đối tác">
                                <Text strong>{documentDetail.agencyName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêu đề">
                                {documentDetail.title}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Thông tin thời gian</Divider>
                        <Space>
                            <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Descriptions column={2}>
                                <Descriptions.Item label={getExpirationLabel(documentDetail.type)}>
                                    {dayjs(documentDetail.expirationDate).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>

                        <Divider orientation="left">Tài liệu</Divider>
                        <Space>
                            <FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <a href={documentDetail.urlFile} target="_blank" rel="noopener noreferrer">
                                Xem tài liệu hợp đồng
                            </a>
                        </Space>
                    </Space>
                </Card>
            )}
        </Modal>
    );
};

export default DocumentDetailModal;
