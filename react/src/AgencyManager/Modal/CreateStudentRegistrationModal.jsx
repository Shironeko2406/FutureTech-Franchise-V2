import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";

const { Option } = Select;

const CreateStudentRegistrationModal = ({ visible, onClose, onSubmit, courses, agencyId, loading }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSubmit({ ...values, agencyId });
        });
    };

    return (
        <Modal
            open={visible}
            title="Tạo mới ghi danh"
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} disabled={loading}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
                    Tạo
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="studentName"
                        label="Tên học viên"
                        rules={[{ required: true, message: "Vui lòng nhập tên học viên" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^0\d{9}$/, message: "Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="courseId"
                        label="Khóa học"
                        rules={[{ required: true, message: "Vui lòng chọn khóa học" }]}
                    >
                        <Select>
                            {courses.map((course) => (
                                <Option key={course.id} value={course.id}>
                                    {course.code}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateStudentRegistrationModal;