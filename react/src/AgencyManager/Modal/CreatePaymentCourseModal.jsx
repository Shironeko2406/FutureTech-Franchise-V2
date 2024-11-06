import React, { useEffect } from "react";
import { Modal, Input, Form, Button, Spin } from "antd";

// Hàm để định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const CreatePaymentCourseModal = ({ visible, onClose, onSubmit, userId, spinning, courseDetails }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && courseDetails) {
            // Cập nhật dữ liệu vào form khi modal mở
            form.setFieldsValue({
                title: `Thanh toán khóa học ${courseDetails.courseCode}`,
                amount: formatCurrency(courseDetails.coursePrice),
            });
        }
        // Reset form fields when modal is closed
        if (!visible) {
            form.resetFields();
        }
    }, [visible, courseDetails, form]);

    const handleFinish = (values) => {
        // Chuyển đổi amount từ định dạng chuỗi về kiểu số
        const amountNumber = parseInt(values.amount.replace(/\./g, '').replace(' VNĐ', ''), 10);
        onSubmit({ ...values, userId, amount: amountNumber, courseId: courseDetails.courseId });
        form.resetFields();
    };

    return (
        <Modal
            title="Tạo Thông Tin Thanh Toán"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Spin spinning={spinning}>
                <Form form={form} onFinish={handleFinish} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Form.Item
                        label="Ghi chú"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                    >
                        <Input.TextArea placeholder="Nhập ghi chú" />
                    </Form.Item>
                    <Form.Item
                        label="Số tiền"
                        name="amount"
                    >
                        <Input
                            readOnly
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo Thanh Toán
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreatePaymentCourseModal;
