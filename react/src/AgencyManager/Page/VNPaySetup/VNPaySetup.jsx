import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Tooltip, Modal, Row, Col, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateVNPayConfigActionAsync, GetVNPayConfigActionAsync } from '../../../Redux/ReducerAPI/AgencyReducer';
import {
    InfoCircleOutlined,
    LockOutlined,
    CodeOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    QuestionCircleOutlined,
    BankOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const VNPaySetup = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
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

    const onFinish = async (values) => {
        const { vnp_TmnCode, vnp_HashSecret } = values;
        const agencyId = userLogin?.agencyId;
        if (agencyId) {
            setLoading(true);
            const success = await dispatch(UpdateVNPayConfigActionAsync(agencyId, vnp_TmnCode, vnp_HashSecret));
            setLoading(false);
            if (success) {
                console.log("VNPay configuration updated successfully");
            }
        } else {
            message.error("Không tìm thấy agencyId");
        }
    };

    const instructionSteps = [
        {
            title: 'Đăng nhập VNPay',
            content: 'Truy cập vào trang quản trị VNPay của bạn và đăng nhập với tài khoản được cấp.',
            image: '/placeholder.svg?height=200&width=400'
        },
        {
            title: 'Truy cập cài đặt',
            content: 'Vào mục "Cài đặt" hoặc "Thông tin tài khoản" trong menu quản trị.',
            image: '/placeholder.svg?height=200&width=400'
        },
        {
            title: 'Lấy thông tin tích hợp',
            content: 'Tìm phần "Thông tin tích hợp" hoặc "API Integration" và sao chép TmnCode và HashSecret.',
            image: '/placeholder.svg?height=200&width=400'
        }
    ];

    const showModal = () => {
        setIsModalVisible(true);
        setCurrentStep(0);
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
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
                                                    <Tooltip title="Mã website của bạn được VNPay cấp">
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
                                                    <Tooltip title="Chuỗi bí mật để tạo chữ ký điện tử">
                                                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                                    </Tooltip>
                                                </Space>
                                            }
                                            name="vnp_HashSecret"
                                            required
                                            rules={[{ required: true, message: 'Vui lòng nhập VNPay HashSecret!' }]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined className="text-gray-400" />}
                                                placeholder="Nhập HashSecret của bạn"
                                                style={{ height: '40px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
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
                        <Button
                            key="back"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            icon={<ArrowLeftOutlined />}
                        >
                            Quay lại
                        </Button>,
                        <Button
                            key="next"
                            type="primary"
                            onClick={currentStep === instructionSteps.length - 1 ? () => setIsModalVisible(false) : handleNext}
                            icon={currentStep === instructionSteps.length - 1 ? null : <ArrowRightOutlined />}
                        >
                            {currentStep === instructionSteps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                        </Button>
                    ]}
                    width={700}
                >
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Title level={4} style={{ marginBottom: '16px', color: '#262626' }}>
                            {instructionSteps[currentStep].title}
                        </Title>
                        <img
                            src={instructionSteps[currentStep].image}
                            alt={`Bước ${currentStep + 1}`}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                height: 'auto',
                                marginBottom: '16px',
                                borderRadius: '8px',
                                border: '1px solid #f0f0f0'
                            }}
                        />
                        <Paragraph style={{ fontSize: '16px', color: '#595959' }}>
                            {instructionSteps[currentStep].content}
                        </Paragraph>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '16px'
                        }}>
                            {instructionSteps.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: currentStep === index ? '#1890ff' : '#d9d9d9',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </Modal>
            </div>
        </Spin>
    );
};

export default VNPaySetup;

