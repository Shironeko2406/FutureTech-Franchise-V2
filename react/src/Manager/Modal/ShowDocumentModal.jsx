import React, { useState } from 'react';
import { Modal, Button, Typography, Descriptions, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { ApproveDocumentActionAsync, GetAllDocumentsByAgencyIdActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';

const { Title, Text } = Typography;

const ShowDocumentModal = ({ visible, onClose, document, documentInfo, documentApproval, agencyId }) => {
    const dispatch = useDispatch();
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const handleDownloadFile = (url) => {
        window.open(url, '_blank');
    };

    const handleApproveDocument = async () => {
        const documentId = document?.id;
        if (documentId) {
            await dispatch(ApproveDocumentActionAsync(documentId));
            setIsConfirmVisible(false);
            onClose();
        }
    };

    const showConfirmModal = () => {
        setIsConfirmVisible(true);
    };

    const handleConfirmCancel = () => {
        setIsConfirmVisible(false);
    };

    return (
        <>
            <Modal
                title={<Title level={3}>Thông tin tài liệu</Title>}
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose} size="large">
                        Đóng
                    </Button>,
                    !documentApproval && (
                        <Button key="approve" type="primary" onClick={showConfirmModal} size="large">
                            Duyệt tài liệu
                        </Button>
                    )
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

            <Modal
                title="Xác nhận duyệt tài liệu"
                open={isConfirmVisible}
                onCancel={handleConfirmCancel}
                onOk={handleApproveDocument}
                okText="Duyệt"
                cancelText="Hủy"
            >
                <Text>Bạn có chắc chắn muốn duyệt tài liệu này?</Text>
            </Modal>
        </>
    );
};

export default ShowDocumentModal;
