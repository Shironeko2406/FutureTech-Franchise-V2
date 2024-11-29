import React, { useState } from "react";
import { Modal, Typography, Descriptions, Tag, Space, Button, Form, Input, Select, DatePicker, Spin, Popconfirm } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, BookOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, TeamOutlined, ScheduleOutlined, EditOutlined } from "@ant-design/icons";
import moment from 'moment';

const { Title, Text } = Typography;

// Hàm để định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

export default function StudentRegistrationDetailsModal({
    visible,
    onClose,
    studentDetails,
    studentStatusMapping,
    paymentStatusMapping,
    onUpdate,
    onCancelRegistration,
    courses,
    spinning,
    onCompletePayment, // Add this line
    paymentStatus // Add this line
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    if (!studentDetails) return null;

    const getStatusColor = (status, mapping) => {
        const colors = {
            NotConsult: "default",
            Pending: "warning",
            Waitlisted: "processing",
            Enrolled: "success",
            Cancel: "error",
            Pending_Payment: "warning",
            Advance_Payment: "processing",
            Completed: "success",
            Late_Payment: "error",
        };
        return colors[status] || "default";
    };

    const handleEdit = () => {
        form.setFieldsValue({
            fullName: studentDetails.fullName,
            dateTime: studentDetails.dateTime,
            courseId: studentDetails.courseId,
            paymentDeadline: studentDetails.paymentDeadline ? moment(studentDetails.paymentDeadline) : null,
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            onUpdate({
                ...values,
                studentName: values.fullName,
                paymentDeadline: values.paymentDeadline ? values.paymentDeadline.format('YYYY-MM-DD') : null,
            })
            setIsEditing(false);
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            width={700}
            footer={[
                isEditing ? (
                    <>
                        <Button key="cancel" onClick={handleCancel} disabled={spinning}>
                            Hủy
                        </Button>
                        <Button key="save" type="primary" onClick={handleSave} loading={spinning}>
                            Lưu
                        </Button>
                    </>
                ) : (
                    <>
                        {paymentStatus === 'Advance_Payment' && (
                            <Button
                                key="completePayment"
                                type="primary"
                                onClick={() => onCompletePayment(studentDetails)}
                                disabled={spinning}
                                style={{ float: 'left', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                Thanh toán nốt số tiền còn lại
                            </Button>
                        )}
                        <Button key="edit" type="primary" onClick={handleEdit} icon={<EditOutlined />} disabled={spinning}>
                            Chỉnh sửa
                        </Button>
                        <Button key="close" onClick={onClose} disabled={spinning}>
                            Đóng
                        </Button>
                    </>
                ),
            ]}
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Title level={3}>Thông Tin Chi Tiết Đăng Ký</Title>

                <Spin spinning={spinning}>
                    {isEditing ? (
                        <Form form={form} layout="vertical">
                            <Form.Item name="fullName" label="Tên học viên" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="courseId"
                                label="Khóa học" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    allowClear
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {courses.map(course => (
                                        <Select.Option key={course.id} value={course.id}>{course.code}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="dateTime" label="Lịch học mong muốn">
                                <Input />
                            </Form.Item>
                            <Form.Item name="paymentDeadline" label="Hạn thanh toán">
                                <DatePicker format="YYYY-MM-DD" disabledDate={(current) => current && current < moment().endOf('day')} />
                            </Form.Item>
                        </Form>
                    ) : (
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label={<Space><UserOutlined /> Tên học viên</Space>}>
                                <Text strong>{studentDetails.fullName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                                {studentDetails.email}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
                                {studentDetails.phoneNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><BookOutlined /> Khóa học</Space>}>
                                {studentDetails.courseCode}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><DollarOutlined /> Giá khóa học</Space>}>
                                {formatCurrency(studentDetails.coursePrice)}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><DollarOutlined /> Số tiền đã thanh toán</Space>} >
                                {formatCurrency(studentDetails.studentAmountPaid)}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><CalendarOutlined /> Ngày đăng ký</Space>}>
                                {studentDetails.registerDate}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><ClockCircleOutlined /> Hạn thanh toán</Space>}>
                                {studentDetails.paymentDeadline ? moment(studentDetails.paymentDeadline).format('DD/MM/YYYY') : "Chưa có"}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><DollarOutlined /> Trạng thái thanh toán</Space>}>
                                <Tag color={getStatusColor(studentDetails.paymentStatus, paymentStatusMapping)}>
                                    {paymentStatusMapping[studentDetails.paymentStatus]}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><TeamOutlined /> Trạng thái học viên</Space>}>
                                <Tag color={getStatusColor(studentDetails.studentStatus, studentStatusMapping)}>
                                    {studentStatusMapping[studentDetails.studentStatus]}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><ScheduleOutlined /> Lịch học mong muốn</Space>}>
                                {studentDetails.dateTime || "Chưa có"}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><UserOutlined /> Người tư vấn</Space>}>
                                {studentDetails.consultantName || "Chưa có"}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><ClockCircleOutlined /> Thời gian cập nhật</Space>}>
                                {studentDetails.modificationDate ? moment(studentDetails.modificationDate).format('DD/MM/YYYY HH:mm') : "Chưa có"}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Spin>
            </Space>
        </Modal >
    );
}