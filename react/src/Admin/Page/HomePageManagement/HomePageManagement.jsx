// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { GetHomePageActionAsync, UpdateHomePageActionAsync } from "../../../Redux/ReducerAPI/HomePageReducer";
// import { Form, Input, Button, Card, Typography, Space, Divider } from "antd";
// import { SaveOutlined } from "@ant-design/icons";
// import "./HomePageManagement.css";

// const { Title } = Typography;
// const { TextArea } = Input;

// const HomePageManagement = () => {
//     const dispatch = useDispatch();
//     const homePageData = useSelector((state) => state.HomePageReducer.homePageData);

//     useEffect(() => {
//         dispatch(GetHomePageActionAsync());
//     }, [dispatch]);

//     const onFinish = (values) => {
//         dispatch(UpdateHomePageActionAsync(homePageData.id, values));
//     };

//     return (
//         <Card className="home-page-management">
//             <Title level={2}>Quản lý Trang Chủ</Title>
//             <Form
//                 name="homePageManagement"
//                 initialValues={homePageData}
//                 onFinish={onFinish}
//                 layout="vertical"
//                 className="management-form"
//             >
//                 <Space direction="vertical" size="large" style={{ width: '100%' }}>
//                     <Card title="Thông tin Nhượng quyền" className="section-card">
//                         <Form.Item label="Tiêu đề nhượng quyền" name="franchiseTitle">
//                             <Input />
//                         </Form.Item>
//                         <Form.Item label="Mô tả nhượng quyền" name="franchiseDescription">
//                             <TextArea rows={4} />
//                         </Form.Item>
//                         <Form.Item label="URL hình ảnh banner nhượng quyền" name="franchiseBannerImageUrl">
//                             <Input />
//                         </Form.Item>
//                         <Form.Item label="Nội dung chính nhượng quyền" name="franchiseMainContent">
//                             <TextArea rows={6} />
//                         </Form.Item>
//                     </Card>

//                     <Card title="Thông tin Khóa học" className="section-card">
//                         <Form.Item label="Tiêu đề khóa học" name="courseTitle">
//                             <Input />
//                         </Form.Item>
//                         <Form.Item label="Mô tả khóa học" name="courseDescription">
//                             <TextArea rows={4} />
//                         </Form.Item>
//                         <Form.Item label="URL hình ảnh banner khóa học" name="courseBannerImageUrl">
//                             <Input />
//                         </Form.Item>
//                         <Form.Item label="Nội dung chính khóa học" name="courseMainContent">
//                             <TextArea rows={6} />
//                         </Form.Item>
//                     </Card>

//                     <Card title="Thông tin Liên hệ" className="section-card">
//                         <Form.Item label="Email liên hệ" name="contactEmail">
//                             <Input />
//                         </Form.Item>
//                         <Form.Item label="Số điện thoại" name="phoneNumber">
//                             <Input />
//                         </Form.Item>
//                     </Card>

//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
//                             Lưu thay đổi
//                         </Button>
//                     </Form.Item>
//                 </Space>
//             </Form>
//         </Card>
//     );
// };

// export default HomePageManagement;

import React, { useState } from 'react';
import { Card, Descriptions, Button, Modal, Form, Input, message, Typography, Layout, Space, Row, Col, Divider } from 'antd';
import { EditOutlined, HomeOutlined, ReadOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

const HomePageManagement = () => {
    const [data, setData] = useState({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        franchiseTitle: "Tiêu đề nhượng quyền mẫu",
        franchiseDescription: "Đây là mô tả nhượng quyền mẫu",
        franchiseBannerImageUrl: "data:image/jpeg;base64,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",
        franchiseMainContent: "Nội dung chính cho nhượng quyền",
        courseTitle: "Khóa học mẫu",
        courseDescription: "Đây là mô tả khóa học mẫu",
        courseBannerImageUrl: "data:image/jpeg;base64,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",
        courseMainContent: "Nội dung chính cho khóa học",
        contactEmail: "lienhe@example.com",
        phoneNumber: "0123456789"
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        form.setFieldsValue(data);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            setData({ ...data, ...values });
            setIsModalVisible(false);
            message.success('Thông tin trang chủ đã được cập nhật thành công');
        });
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
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Row justify="space-between" align="middle" style={{ height: '100%' }}>
                    <Col>
                        <Space size="large">
                            <HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Title level={3} style={{ margin: 0 }}>Quản Lý Trang Chủ</Title>
                        </Space>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<EditOutlined />} onClick={showModal}>
                            Chỉnh sửa
                        </Button>
                    </Col>
                </Row>
            </Header>
            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card
                            title={<CardTitle icon={<HomeOutlined />} title="Thông Tin Nhượng Quyền" />}
                            hoverable
                        >
                            <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
                                <Descriptions.Item label="Tiêu đề">{data.franchiseTitle}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả">{data.franchiseDescription}</Descriptions.Item>
                                <Descriptions.Item label="Hình ảnh banner">
                                    <img src={data.franchiseBannerImageUrl} alt="Banner nhượng quyền" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Nội dung chính">{data.franchiseMainContent}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card
                            title={<CardTitle icon={<ReadOutlined />} title="Thông Tin Khóa Học" />}
                            hoverable
                        >
                            <Descriptions column={1} labelStyle={{ fontWeight: 'bold' }}>
                                <Descriptions.Item label="Tiêu đề">{data.courseTitle}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả">{data.courseDescription}</Descriptions.Item>
                                <Descriptions.Item label="Hình ảnh banner">
                                    <img src={data.courseBannerImageUrl} alt="Banner khóa học" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Nội dung chính">{data.courseMainContent}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card
                            title={<CardTitle icon={<MailOutlined />} title="Thông Tin Liên Hệ" />}
                            hoverable
                        >
                            <Descriptions column={2}>
                                <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>{data.contactEmail}</Descriptions.Item>
                                <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>{data.phoneNumber}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Chỉnh Sửa Thông Tin Trang Chủ"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width={800}
                    okText="Lưu"
                    cancelText="Hủy"
                >
                    <Form form={form} layout="vertical">
                        <Divider orientation="left">Thông Tin Nhượng Quyền</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="franchiseTitle" label="Tiêu đề nhượng quyền" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề nhượng quyền' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="franchiseBannerImageUrl" label="URL hình ảnh banner nhượng quyền" rules={[{ required: true, type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="franchiseDescription" label="Mô tả nhượng quyền" rules={[{ required: true, message: 'Vui lòng nhập mô tả nhượng quyền' }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="franchiseMainContent" label="Nội dung chính nhượng quyền" rules={[{ required: true, message: 'Vui lòng nhập nội dung chính nhượng quyền' }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Divider orientation="left">Thông Tin Khóa Học</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="courseTitle" label="Tiêu đề khóa học" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề khóa học' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="courseBannerImageUrl" label="URL hình ảnh banner khóa học" rules={[{ required: true, type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="courseDescription" label="Mô tả khóa học" rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="courseMainContent" label="Nội dung chính khóa học" rules={[{ required: true, message: 'Vui lòng nhập nội dung chính khóa học' }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Divider orientation="left">Thông Tin Liên Hệ</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="contactEmail" label="Email liên hệ" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
                                    <Input prefix={<MailOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                                    <Input prefix={<PhoneOutlined />} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default HomePageManagement;



