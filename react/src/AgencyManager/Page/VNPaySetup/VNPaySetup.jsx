import React from 'react';
import { Form, Input, Button, Card, Typography, Space, Tooltip, Steps, Row, Col } from 'antd';
import {
    InfoCircleOutlined,
    LockOutlined,
    CodeOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    QuestionCircleOutlined,
    BankOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const VNPaySetup = () => {
    const [form] = Form.useForm();
    const vnp_TmnCode = "DEMO_TMN_CODE";
    const vnp_HashSecret = "DEMO_HASH_SECRET";

    const onFinish = async (values) => {
        setTimeout(() => {
            console.log("Saved values:", values);
        }, 1000);
    };

    return (
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

                    <Col span={24}>
                        <Card
                            type="inner"
                            style={{
                                borderRadius: '12px',
                                background: '#f8f9fa',
                                border: '1px solid #e8e8e8'
                            }}
                        >
                            <Steps
                                current={-1}
                                items={[
                                    {
                                        title: 'Đăng nhập VNPay',
                                        description: 'Truy cập trang quản trị VNPay',
                                    },
                                    {
                                        title: 'Lấy thông tin',
                                        description: 'Tìm TmnCode và HashSecret',
                                    },
                                    {
                                        title: 'Cấu hình',
                                        description: 'Nhập thông tin vào form',
                                    },
                                ]}
                            />
                        </Card>
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
                            initialValues={{ vnp_TmnCode, vnp_HashSecret }}
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
                            <Form.Item style={{ marginBottom: 0, marginTop: '0px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    style={{
                                        height: '35px',
                                        paddingInline: '20px',
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

                <Col span={24}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <QuestionCircleOutlined style={{ color: '#1890ff' }} />
                                <span>Hướng dẫn lấy thông tin VNPay</span>
                            </div>
                        }
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <ol className="space-y-3 text-gray-600 list-decimal list-inside">
                            <li>Đăng nhập vào tài khoản quản trị VNPay của bạn.</li>
                            <li>Truy cập vào mục "Cài đặt" hoặc "Thông tin tài khoản".</li>
                            <li>Tìm phần "Thông tin tích hợp" hoặc "API Integration".</li>
                            <li>Sao chép giá trị của "TmnCode" và "HashSecret".</li>
                            <li>Dán các giá trị vào form trên để hoàn tất cấu hình.</li>
                        </ol>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default VNPaySetup;

