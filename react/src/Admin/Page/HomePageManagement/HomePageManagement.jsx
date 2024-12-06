import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Typography, Layout, Space, Row, Col, message, Spin } from 'antd';
import { EditOutlined, HomeOutlined, ReadOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetHomePageActionAsync } from '../../../Redux/ReducerAPI/HomePageReducer';
import EditHomePageModal from '../../Modal/EditHomePageModal';

const { Title, Text } = Typography;
const { Content } = Layout;

const HomePageManagement = () => {
    const dispatch = useDispatch();
    const { homePageData, loading } = useSelector((state) => state.HomePageReducer);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(GetHomePageActionAsync());
    }, [dispatch]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const CardTitle = ({ icon, title }) => (
        <Space>
            {icon}
            <Text strong>{title}</Text>
        </Space>
    );

    return (
        <Layout>
            <Card
                className="main-card"
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
            >
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', padding: '16px 0' }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
                                <HomeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>Quản Lý Trang Chủ</Title>
                            </Space>
                        </Col>
                        <Col>
                            <Button type="primary" icon={<EditOutlined />} onClick={showModal} size="medium">
                                Chỉnh sửa
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Content style={{ padding: '0 16px' }}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card
                                    title={<CardTitle icon={<HomeOutlined />} title="Thông Tin Nhượng Quyền" />}
                                    hoverable
                                    style={{
                                        height: '100%',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        background: '#fafafa'
                                    }}
                                    headStyle={{
                                        background: '#f6f6f6',
                                        borderBottom: '2px solid #1890ff'
                                    }}
                                >
                                    <Descriptions
                                        column={1}
                                        labelStyle={{
                                            fontWeight: 'bold',
                                            padding: '12px 0'
                                        }}
                                        contentStyle={{
                                            padding: '12px 0'
                                        }}
                                    >
                                        <Descriptions.Item label="Tiêu đề">{homePageData.franchiseTitle}</Descriptions.Item>
                                        <Descriptions.Item label="Mô tả">{homePageData.franchiseDescription}</Descriptions.Item>
                                        <Descriptions.Item label="Hình ảnh banner">
                                            <img
                                                src={homePageData.franchiseBannerImageUrl}
                                                alt="Banner nhượng quyền"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nội dung chính">{homePageData.franchiseMainContent}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card
                                    title={<CardTitle icon={<ReadOutlined />} title="Thông Tin Khóa Học" />}
                                    hoverable
                                    style={{
                                        height: '100%',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        background: '#fafafa'
                                    }}
                                    headStyle={{
                                        background: '#f6f6f6',
                                        borderBottom: '2px solid #1890ff'
                                    }}
                                >
                                    <Descriptions
                                        column={1}
                                        labelStyle={{
                                            fontWeight: 'bold',
                                            padding: '12px 0'
                                        }}
                                        contentStyle={{
                                            padding: '12px 0'
                                        }}
                                    >
                                        <Descriptions.Item label="Tiêu đề">{homePageData.courseTitle}</Descriptions.Item>
                                        <Descriptions.Item label="Mô tả">{homePageData.courseDescription}</Descriptions.Item>
                                        <Descriptions.Item label="Hình ảnh banner">
                                            <img
                                                src={homePageData.courseBannerImageUrl}
                                                alt="Banner khóa học"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Nội dung chính">{homePageData.courseMainContent}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col xs={24}>
                                <Card
                                    title={<CardTitle icon={<MailOutlined />} title="Thông Tin Liên Hệ" />}
                                    hoverable
                                    style={{
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        background: '#fafafa'
                                    }}
                                    headStyle={{
                                        background: '#f6f6f6',
                                        borderBottom: '2px solid #1890ff'
                                    }}
                                >
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={12}>
                                            <Space align="start">
                                                <MailOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                                <div>
                                                    <Text strong>Email:</Text>
                                                    <br />
                                                    <Text>{homePageData.contactEmail}</Text>
                                                </div>
                                            </Space>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Space align="start">
                                                <PhoneOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                                                <div>
                                                    <Text strong>Số điện thoại:</Text>
                                                    <br />
                                                    <Text>{homePageData.phoneNumber}</Text>
                                                </div>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Content>
            </Card>

            <EditHomePageModal
                visible={isModalVisible}
                onCancel={handleCancel}
                data={homePageData}
            />
        </Layout>
    );
};

export default HomePageManagement;



