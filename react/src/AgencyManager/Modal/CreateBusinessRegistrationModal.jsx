import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload, Spin } from 'antd'; // Import Spin
import { UploadOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from 'react-redux';
import { CreateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import moment from 'moment';

const CreateBusinessRegistrationModal = ({ visible, onClose, agencyId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // Local loading state

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const storageRef = ref(imageDB, `documents/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileURL = await getDownloadURL(storageRef);
            const documentData = {
                title: values.title,
                urlFile: fileURL,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                documentType: "BusinessLicense",
                agencyId: agencyId, // Use the passed agencyId
            };
            await dispatch(CreateDocumentActionAsync(documentData));
            onClose();
            form.resetFields();
        } catch (error) {
            console.error("Error creating business registration: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if (!file.type.startsWith('application/')) {
            onError(new Error('Only document files are allowed!'));
            return;
        }
        setFile(file);
        onSuccess(null, file);
    };

    return (
        <Modal
            title="Thêm mới Giấy Đăng Ký Doanh Nghiệp"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} disabled={loading}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} disabled={loading}>
                    Thêm mới
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Form.Item
                        name="expirationDate"
                        label="Ngày hết hạn"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={(current) => current && current < moment().endOf('day')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        label="File tài liệu"
                        rules={[{ required: true, message: 'Vui lòng upload file' }]}
                    >
                        <Upload
                            name="file"
                            customRequest={handleUpload}
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateBusinessRegistrationModal;