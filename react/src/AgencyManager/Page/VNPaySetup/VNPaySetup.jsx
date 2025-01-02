import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Tooltip, Modal, Row, Col, message, Spin, Steps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateVNPayConfigActionAsync, GetVNPayConfigActionAsync } from '../../../Redux/ReducerAPI/AgencyReducer';
import { VerifyPasswordActionAsync } from '../../../Redux/ReducerAPI/AuthenticationReducer';
import { InfoCircleOutlined, LockOutlined, CodeOutlined, SaveOutlined, QuestionCircleOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const VNPaySetup = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(true);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.AuthenticationReducer.userLogin);
    const vnpayConfig = useSelector((state) => state.AgencyReducer.vnpayConfig);

    useEffect(() => {
        const fetchVNPayConfig = async () => {
            setLoading(true);
            await dispatch(GetVNPayConfigActionAsync());
            setLoading(false);
        };
        fetchVNPayConfig();
    }, [dispatch]);

    useEffect(() => {
        form.setFieldsValue({
            vnp_TmnCode: vnpayConfig.tmnCode || '',
            vnp_HashSecret: vnpayConfig.hashSecret || ''
        });
    }, [vnpayConfig, form]);

    const onFinish = (values) => {
        setFormValues(values);
        setIsConfirmModalVisible(true);
    };

    const handleConfirmSave = async () => {
        const { vnp_TmnCode, vnp_HashSecret } = formValues;
        const agencyId = userLogin?.agencyId;
        if (agencyId) {
            setLoading(true);
            const success = await dispatch(UpdateVNPayConfigActionAsync(agencyId, vnp_TmnCode, vnp_HashSecret));
            setLoading(false);
            setIsConfirmModalVisible(false);
            if (success) {
                message.success("Cấu hình VNPay đã được cập nhật thành công");
                console.log("VNPay configuration updated successfully");
            }
        } else {
            message.error("Không tìm thấy agencyId");
        }
    };

    const handlePasswordSubmit = async (values) => {
        setPasswordLoading(true);
        const passwordData = {
            oldPassword: values.password,
            newPassword: values.password,
            confirmPassword: values.password
        };
        const isVerified = await dispatch(VerifyPasswordActionAsync(passwordData));
        setPasswordLoading(false);
        if (isVerified) {
            setIsPasswordModalVisible(false);
            setIsVerified(true);
        }
    };

    const instructionSteps = [
        {
            title: 'Ký hợp đồng với VNPay',
            content: 'Liên hệ bộ phận kinh doanh của VNPay và hoàn tất ký kết hợp đồng dịch vụ.'
        },
        {
            title: 'Cung cấp thông tin tích hợp',
            content: 'Gửi các thông tin cần thiết (Domain tích hợp, Callback URL, thông tin tài khoản ngân hàng) theo yêu cầu từ VNPay.'
        },
        {
            title: 'Nhận email từ VNPay',
            content: 'Sau khi hoàn tất thiết lập, VNPay sẽ gửi email chứa: TmnCode (Mã định danh Merchant) và HashSecret (Khóa bảo mật).'
        },
        {
            title: 'Kiểm tra email',
            content: 'Tìm email từ VNPay (kiểm tra cả mục Spam/Quảng cáo). Nếu không nhận được, liên hệ bộ phận hỗ trợ của VNPay.'
        }
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    return (
        <>
            <Modal
                title={
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <LockOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <Title level={3} style={{ marginTop: '16px', marginBottom: 0 }}>Xác minh danh tính</Title>
                    </div>
                }
                open={isPasswordModalVisible}
                footer={null}
                closable={false}
                width={400}
            >
                <Paragraph style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Vui lòng nhập mật khẩu của bạn để tiếp tục truy cập trang này.
                </Paragraph>
                <Form onFinish={handlePasswordSubmit} layout="vertical">
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Nhập mật khẩu"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                            htmlType="submit"
                            loading={passwordLoading} block
                            size="large"
                        >
                            Xác minh
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Xác nhận lưu cấu hình"
                open={isConfirmModalVisible}
                onCancel={() => setIsConfirmModalVisible(false)}
                onOk={handleConfirmSave}
                confirmLoading={loading}
            >
                <p>Bạn có chắc chắn muốn lưu cấu hình VNPay không?</p>
            </Modal>
            {isVerified && (
                <Spin spinning={loading}>
                    <div style={{ padding: '24px' }}>
                        <Card
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Row justify="center" align="middle" gutter={[0, 24]}>
                                <Col span={24}>
                                    <Title level={2} style={{
                                        color: '#1890ff',
                                        textAlign: 'center',
                                        margin: '0 32px',
                                        background: 'linear-gradient(to right, #1890ff, #69c0ff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        Cài đặt VNPay
                                    </Title>
                                </Col>
                            </Row>
                        </Card>

                        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                            <Col span={24}>
                                <Card
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <BankOutlined style={{ color: '#1890ff' }} />
                                            <span>Thông tin cấu hình VNPay</span>
                                            <Tooltip title="Xem hướng dẫn">
                                                <Button
                                                    type="text"
                                                    icon={<QuestionCircleOutlined />}
                                                    onClick={showModal}
                                                    style={{
                                                        color: '#1890ff',
                                                        marginLeft: 'auto'
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    }
                                    style={{
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        initialValues={{ vnp_TmnCode: '', vnp_HashSecret: '' }}
                                        onFinish={onFinish}
                                    >
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <Space>
                                                            <Text strong>VNPay TmnCode</Text>
                                                            <Tooltip title="Mã định danh merchant trên hệ thống VNPay.">
                                                                <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                                            </Tooltip>
                                                        </Space>
                                                    }
                                                    name="vnp_TmnCode"
                                                    required
                                                    rules={[{ required: true, message: 'Vui lòng nhập VNPay TmnCode!' }]}
                                                >
                                                    <Input
                                                        prefix={<CodeOutlined className="text-gray-400" />}
                                                        placeholder="Nhập TmnCode của bạn"
                                                        style={{ height: '40px' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label={
                                                        <Space>
                                                            <Text strong>VNPay HashSecret</Text>
                                                            <Tooltip title="Khóa bí mật dùng để mã hóa dữ liệu giao tiếp giữa hệ thống của bạn và VNPay.">
                                                                <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                                            </Tooltip>
                                                        </Space>
                                                    }
                                                    name="vnp_HashSecret"
                                                    required
                                                    rules={[{ required: true, message: 'Vui lòng nhập VNPay HashSecret!' }]}
                                                >
                                                    <Input
                                                        prefix={<LockOutlined className="text-gray-400" />}
                                                        placeholder="Nhập HashSecret của bạn"
                                                        style={{ height: '40px' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item style={{ marginBottom: 0, marginTop: '0px' }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                icon={<SaveOutlined />}
                                                style={{
                                                    height: '40px',
                                                    paddingInline: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                Lưu cấu hình
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>

                        <Modal
                            title={
                                <div style={{
                                    textAlign: 'center',
                                    color: '#1890ff',
                                    fontSize: '20px',
                                    fontWeight: 600
                                }}>
                                    Hướng dẫn lấy thông tin VNPay
                                </div>
                            }
                            open={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={[
                                <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
                                    Đóng
                                </Button>
                            ]}
                            width={700}
                        >
                            <div style={{ padding: '20px 0' }}>
                                <Steps direction="vertical" current={-1}>
                                    {instructionSteps.map((step, index) => (
                                        <Step
                                            key={index}
                                            title={
                                                <Title level={4} style={{ marginBottom: '8px', color: '#262626' }}>
                                                    {step.title}
                                                </Title>
                                            }
                                            description={
                                                <Paragraph style={{ fontSize: '16px', color: '#595959' }}>
                                                    {step.content}
                                                </Paragraph>
                                            }
                                        />
                                    ))}
                                </Steps>
                            </div>
                        </Modal>
                    </div>
                </Spin>
            )}
        </>
    );
};

export default VNPaySetup;

