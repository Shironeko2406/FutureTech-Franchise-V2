import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, message, Typography, Space } from 'antd';
import { UploadOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from 'react-redux';
import { VerifyPasswordActionAsync } from '../../Redux/ReducerAPI/AuthenticationReducer';
import { GetRefundAmountActionAsync, CreateRefundActionAsync } from '../../Redux/ReducerAPI/PaymentReducer';

const { Title, Paragraph } = Typography;

const RefundModal = ({ visible, onClose, onRefund, registerCourseId, onRefundSuccess }) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [refundAmount, setRefundAmount] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible && registerCourseId) {
            dispatch(GetRefundAmountActionAsync(registerCourseId)).then((amount) => {
                setRefundAmount(amount);
            });
        }
    }, [visible, registerCourseId, dispatch]);

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 VND';
    };

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

    const handleClose = () => {
        setStep(1);
        setImageUrl(null);
        setRefundReason('');
        form.resetFields();
        onClose();
    };

    const handleNext = async () => {
        try {
            if (step === 1) {
                await form.validateFields();
                setRefundReason(form.getFieldValue('refundReason'));
                setStep(2);
            } else {
                setLoading(true);
                const values = form.getFieldsValue();
                const { password } = values;
                const passwordData = {
                    oldPassword: password,
                    newPassword: password,
                    confirmPassword: password
                };
                const isVerified = await dispatch(VerifyPasswordActionAsync(passwordData));
                if (isVerified) {
                    const refundData = {
                        registerCourseId,
                        refundReason,
                        imageUrl
                    };
                    await dispatch(CreateRefundActionAsync(refundData));
                    onRefund(refundData);
                    onRefundSuccess();
                    handleClose();
                }
            }
        } catch (error) {
            console.error("Error during refund process: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Hoàn tiền${refundAmount !== null ? ` - Số tiền cần hoàn lại: ${formatCurrency(refundAmount)}` : ''}`}
            open={visible}
            onCancel={handleClose}
            onOk={handleNext}
            confirmLoading={loading}
            okText={step === 1 ? "Tiếp tục" : "Xác minh"}
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                {step === 1 ? (
                    <>
                        <Form.Item
                            name="refundReason"
                            label="Lý do hoàn tiền"
                            rules={[{ required: true, message: 'Vui lòng nhập lý do hoàn tiền' }]}
                        >
                            <Input.TextArea placeholder="Nhập lý do hoàn tiền" />
                        </Form.Item>
                        <Form.Item
                            name="imageUrl"
                            label="Hình ảnh minh chứng"
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
                    </>
                ) : (
                    <Space direction="vertical" size="large" style={{ width: '100%', alignItems: 'center' }}>
                        <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <Title level={4}>Xác minh danh tính</Title>
                        <Paragraph style={{ textAlign: 'center' }}>
                            Vui lòng nhập mật khẩu của bạn để xác minh và tiếp tục.
                        </Paragraph>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            style={{ width: '100%' }}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Nhập mật khẩu"
                                size="large"
                            />
                        </Form.Item>
                    </Space>
                )}
            </Form>
        </Modal>
    );
};

export default RefundModal;

