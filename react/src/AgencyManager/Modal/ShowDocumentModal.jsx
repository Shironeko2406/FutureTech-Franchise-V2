import React from 'react';
import { Modal, Button, Typography, Descriptions, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const ShowDocumentModal = ({ visible, onClose, document, documentInfo, documentApproval }) => {
    const handleDownloadFile = (url) => {
        window.open(url, '_blank');
    };

    return (
        <Modal
            title={<Title level={3}>Thông tin tài liệu</Title>}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose} size="large">
                    Đóng
                </Button>
            ]}
            width={800}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tiêu đề">{documentInfo.title}</Descriptions.Item>
                <Descriptions.Item label="Ngày hết hạn">{documentInfo.expirationDate ? moment(documentInfo.expirationDate).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Tài liệu">
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleDownloadFile(documentInfo.urlFile)}>
                        Xem tài liệu
                    </Button>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={documentApproval ? 'success' : 'processing'}>
                        {documentApproval ? 'Đã duyệt' : 'Đang chờ duyệt'}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ShowDocumentModal;
