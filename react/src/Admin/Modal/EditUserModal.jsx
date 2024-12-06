import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Spin, message, Card, Divider } from "antd";
import { UploadOutlined, UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from "react-redux";
import { UpdateUserByAdminActionAsync } from "../../Redux/ReducerAPI/UserReducer";
import dayjs from "dayjs";

const { Option } = Select;

const EditUserModal = ({ visible, onClose, user, agencyId }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                userName: user.userName,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                gender: user.gender,
            });
            setFileList(user.urlImage ? [{ uid: '-1', name: 'avatar', status: 'done', url: user.urlImage }] : []);
        }
    }, [user, form]);

    const handleUpdateUser = async (values) => {
        setLoading(true);
        const userData = {
            ...values,
            urlImage: fileList[0]?.url || "",
            agencyId: agencyId
        };
        try {
            const success = await dispatch(UpdateUserByAdminActionAsync(user.id, userData));
            if (success) {
                form.resetFields();
                setFileList([]);
                onClose(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ được tải lên file ảnh!");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Ảnh phải nhỏ hơn 2MB!");
            return Upload.LIST_IGNORE;
        }

        setLoading(true);
        try {
            const storageRef = ref(imageDB, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFileList([{ uid: file.uid, name: file.name, status: 'done', url: url }]);
            message.success("Tải ảnh lên thành công!");
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải ảnh lên!");
        } finally {
            setLoading(false);
        }
        return false;
    };

    const handleRemove = () => {
        setFileList([]);
    };

    return (
        <Modal
            title="Chỉnh sửa tài khoản"
            open={visible}
            onCancel={() => onClose(false)}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={800}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
                    <Card title="Thông tin cá nhân" className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="userName" label="Tên đăng nhập" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
                                <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
                            </Form.Item>
                            <Form.Item name="fullName" label="Tên đầy đủ" rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ!" }]}>
                                <Input prefix={<UserOutlined />} placeholder="Nhập tên đầy đủ" />
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
                                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "Vui lòng nhập số điện thoại hợp lệ!" }]}>
                                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại 10 số" />
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="dateOfBirth" label="Ngày sinh">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Chọn ngày sinh"
                                    format="DD/MM/YYYY"
                                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                                />
                            </Form.Item>
                            <Form.Item name="gender" label="Giới tính">
                                <Select placeholder="Chọn giới tính">
                                    <Option value="Male">Nam</Option>
                                    <Option value="Female">Nữ</Option>
                                    <Option value="Other">Khác</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </Card>

                    <Divider />

                    <Card title="Ảnh đại diện" className="mb-4">
                        <Form.Item
                            name="avatar"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={handleUpload}
                                onRemove={handleRemove}
                                accept="image/*"
                            >
                                {fileList.length >= 1 ? null : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Card>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditUserModal;