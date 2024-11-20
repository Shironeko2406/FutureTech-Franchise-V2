import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button, Spin, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";


const CreateAccountModal = ({ visible, onClose, onSubmit, role }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = async (values) => {
        setLoading(true);
        const accountData = {
            ...values,
            role,
            urlImage: fileList[0]?.url || "",
        };
        try {
            const success = await onSubmit(accountData);
            if (success) {
                form.resetFields();
                setFileList([]);
                onClose();
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
            title={`Tạo tài khoản ${role === "Instructor" ? "giảng viên" : "nhân viên"}`}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={600}
            className="instructorManagement"
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" onFinish={handleCreateAccount}>
                    <Form.Item name="fullName" label="Tên đầy đủ" rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ!" }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nhập tên đầy đủ" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
                        <Input prefix={<span>@</span>} placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "Vui lòng nhập số điện thoại hợp lệ!" }]}>
                        <Input placeholder="Nhập số điện thoại 10 số và bắt đầu bằng số 0" />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        label="Ngày sinh"
                        rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày sinh"
                            disabledDate={(current) => current && current > new Date()}
                        />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}>
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="Male">Nam</Select.Option>
                            <Select.Option value="Female">Nữ</Select.Option>
                            <Select.Option value="Other">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                        <Input.TextArea placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="Ảnh đại diện"
                        rules={[{ required: true, message: "Vui lòng tải lên ảnh đại diện!" }]}
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
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateAccountModal;