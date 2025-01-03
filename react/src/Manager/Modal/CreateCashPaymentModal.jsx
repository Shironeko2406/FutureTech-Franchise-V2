import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from 'react-redux';
import { CreateCashPaymentActionAsync } from '../../Redux/ReducerAPI/PaymentReducer';

const CreateCashPaymentModal = ({ visible, onClose, agencyId, paymentAmount }) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `images/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            onSuccess(null, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
        }
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const paymentData = {
                ...values,
                imageUrl,
                agencyId,
            };
            await dispatch(CreateCashPaymentActionAsync(paymentData));
            onClose();
        } catch (error) {
            console.error("Error creating cash payment: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo thanh toán tiền mặt"
            open={visible}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                    <Input placeholder="Nhập tiêu đề" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <Input.TextArea placeholder="Nhập mô tả" />
                </Form.Item>
                <Form.Item
                    name="imageUrl"
                    label="Hình ảnh"
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh' }]}
                >
                    <Upload
                        name="image"
                        customRequest={handleUpload}
                        onRemove={() => setImageUrl(null)}
                        accept="image/*"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCashPaymentModal;
