import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Upload, message, Spin } from 'antd';
import { MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from 'react-redux';
import { UpdateHomePageActionAsync } from '../../Redux/ReducerAPI/HomePageReducer';

const EditHomePageModal = ({ visible, onCancel, data }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const franchiseBannerImageUrlRef = useRef(null);
    const courseBannerImageUrlRef = useRef(null);

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                franchiseBannerImageUrl: data.franchiseBannerImageUrl ? [{
                    uid: '-1',
                    name: 'Ảnh banner nhượng quyền hiện tại',
                    status: 'done',
                    url: data.franchiseBannerImageUrl,
                }] : [],
                courseBannerImageUrl: data.courseBannerImageUrl ? [{
                    uid: '-1',
                    name: 'Ảnh banner khóa học hiện tại',
                    status: 'done',
                    url: data.courseBannerImageUrl,
                }] : [],
            });
        }
    }, [data, form]);

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const updatedData = {
                ...values,
                franchiseBannerImageUrl: franchiseBannerImageUrlRef.current || data.franchiseBannerImageUrl,
                courseBannerImageUrl: courseBannerImageUrlRef.current || data.courseBannerImageUrl,
            };
            await dispatch(UpdateHomePageActionAsync(data.id, updatedData));
            onCancel();
        } catch (error) {
            console.error("Error updating home page: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `images/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            onSuccess({ url }, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
        }
    };

    return (
        <Modal
            title="Chỉnh Sửa Thông Tin Trang Chủ"
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
            width={800}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" initialValues={data}>
                    <Divider orientation="left">Thông Tin Nhượng Quyền</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="franchiseTitle" label="Tiêu đề nhượng quyền" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề nhượng quyền' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="franchiseBannerImageUrl" label="Hình ảnh banner nhượng quyền" rules={[{ required: true, message: 'Vui lòng upload tài liệu' }]}>
                                <Upload
                                    name="franchiseBannerImage"
                                    customRequest={(options) => handleUpload(options, franchiseBannerImageUrlRef)}
                                    accept="image/*"
                                    maxCount={1}
                                    onChange={({ file }) => {
                                        if (file.status === 'done') {
                                            franchiseBannerImageUrlRef.current = file.response.url;
                                        }
                                    }}
                                    defaultFileList={data.franchiseBannerImageUrl ? [{
                                        uid: '-1',
                                        name: 'Ảnh banner nhượng quyền hiện tại',
                                        status: 'done',
                                        url: data.franchiseBannerImageUrl,
                                    }] : []}
                                >
                                    <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="franchiseDescription" label="Mô tả nhượng quyền" rules={[{ required: true, message: 'Vui lòng nhập mô tả nhượng quyền' }]}>
                        <Input />
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
                            <Form.Item name="courseBannerImageUrl" label="Hình ảnh banner khóa học" rules={[{ required: true, message: 'Vui lòng upload tài liệu' }]}>
                                <Upload
                                    name="courseBannerImage"
                                    customRequest={(options) => handleUpload(options, courseBannerImageUrlRef)}
                                    accept="image/*"
                                    maxCount={1}
                                    onChange={({ file }) => {
                                        if (file.status === 'done') {
                                            courseBannerImageUrlRef.current = file.response.url;
                                        }
                                    }}
                                    defaultFileList={data.courseBannerImageUrl ? [{
                                        uid: '-1',
                                        name: 'Ảnh banner khóa học hiện tại',
                                        status: 'done',
                                        url: data.courseBannerImageUrl,
                                    }] : []}
                                >
                                    <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="courseDescription" label="Mô tả khóa học" rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}>
                        <Input />
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
            </Spin>
        </Modal>
    );
};

export default EditHomePageModal;