import React, { useEffect, useState } from "react";
import { Modal, Input, Form, Button, Spin, Select, Typography } from "antd";

const { Option } = Select;
const { Text } = Typography;

// Hàm để định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const CreatePaymentCourseModal = ({ visible, onClose, onSubmit, registerCourseId, spinning, courseDetails }) => {
    const [form] = Form.useForm();
    const [paymentType, setPaymentType] = useState("Completed");
    const [formattedAmount, setFormattedAmount] = useState("");

    useEffect(() => {
        if (visible && courseDetails) {
            const remainingAmount = courseDetails.coursePrice - (courseDetails.studentAmountPaid || 0);
            form.setFieldsValue({
                title: `Thanh toán khóa học ${courseDetails.courseCode}`,
                amount: remainingAmount,
                paymentType: "Completed" // Auto set to Completed
            });
            setFormattedAmount(formatCurrency(remainingAmount));
        }
        if (!visible) {
            form.resetFields();
            setFormattedAmount("");
        }
    }, [visible, courseDetails, form]);

    const handleFinish = (values) => {
        const amountNumber = parseInt(values.amount, 10);
        onSubmit({ description: values.description, title: values.title, amount: amountNumber, registerCourseId: registerCourseId }, paymentType);
        form.resetFields();
    };

    const handlePaymentTypeChange = (value) => {
        setPaymentType(value);
        if (value === "Completed" && courseDetails) {
            form.setFieldsValue({
                amount: courseDetails.coursePrice,
            });
            setFormattedAmount(formatCurrency(courseDetails.coursePrice));
        } else {
            form.setFieldsValue({
                amount: "",
            });
            setFormattedAmount("");
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Only allow integers
            setFormattedAmount(formatCurrency(value));
        }
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
                        label="Loại thanh toán"
                        name="paymentType"
                        rules={[{ required: true, message: "Vui lòng chọn loại thanh toán" }]}
                        style={{ display: courseDetails && courseDetails.studentAmountPaid ? 'none' : 'block' }} // Hide when handling remaining payment
                    >
                        <Select onChange={handlePaymentTypeChange} defaultValue="Completed" disabled={courseDetails && courseDetails.studentAmountPaid}>
                            <Option value="Advance_Payment">Đặt cọc</Option>
                            <Option value="Completed">Hoàn thành</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Ghi chú"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                    >
                        <Input.TextArea placeholder="Nhập ghi chú" />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                Số tiền
                                {courseDetails && (
                                    <Text type="secondary" style={{ marginLeft: 8 }}>
                                        (Giá khóa học: {formatCurrency(courseDetails.coursePrice)})
                                    </Text>
                                )}
                            </span>
                        }
                        name="amount"
                        rules={[
                            { required: true, message: "Vui lòng nhập số tiền" },
                            { pattern: /^\d+$/, message: "Vui lòng nhập số nguyên" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (paymentType === "Advance_Payment" && value && parseInt(value, 10) > courseDetails.coursePrice) {
                                        return Promise.reject(new Error("Số tiền đặt cọc không được vượt quá giá khóa học"));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                        style={{ marginBottom: 12 }}
                    >
                        <Input type="text" onChange={handleAmountChange} disabled={paymentType === "Completed"} />
                    </Form.Item>
                    {formattedAmount && (
                        <Form.Item
                            style={{ marginBottom: 12 }}>
                            <Text type="secondary">Số tiền: {formattedAmount}</Text>
                        </Form.Item>
                    )}
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
