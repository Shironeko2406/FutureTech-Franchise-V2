import { Modal, Typography, Descriptions, Tag, Space, Button } from "antd";
import React, { useState } from "react";
import { UserOutlined, MailOutlined, PhoneOutlined, BookOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, HomeOutlined, ScheduleOutlined } from "@ant-design/icons";
import moment from 'moment';
import RefundModal from './RefundModal'; // Import RefundModal
import { useDispatch } from 'react-redux';
import { GetStudentConsultationActionAsync } from '../../Redux/ReducerAPI/RegisterCourseReducer';

const { Title, Text } = Typography;

// Hàm để định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

export default function StudentRegistrationDetailsModal({ visible, onClose, studentDetails, paymentStatusMapping }) {
    const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
    const dispatch = useDispatch();

    if (!studentDetails) return null;

    const getStatusColor = (status) => {
        const colors = {
            Pending_Payment: "warning",
            Advance_Payment: "processing",
            Completed: "success",
            Late_Payment: "error",
            Refund: "purple",
            RequestRefund: "blue"
        };
        return colors[status] || "default";
    };

    // Function translate class schedule to Vietnamese
    const translateDayOfWeek = (dayOfWeekString) => {
        const dayTranslation = {
            Monday: "Thứ Hai",
            Tuesday: "Thứ Ba",
            Wednesday: "Thứ Tư",
            Thursday: "Thứ Năm",
            Friday: "Thứ Sáu",
            Saturday: "Thứ Bảy",
            Sunday: "Chủ Nhật",
        };

        const [days, time] = dayOfWeekString.split(" - ");
        const [startTime, endTime] = time.split("-");

        const translatedDays = days
            .split(",")
            .map((day) => day.trim())
            .map((day) => dayTranslation[day] || day)
            .join(", ");

        return `${translatedDays} - ${startTime} đến ${endTime}`;
    };

    const handleRefundClick = () => {
        setIsRefundModalVisible(true);
    };

    const handleRefundModalClose = () => {
        setIsRefundModalVisible(false);
    };

    const handleRefundSuccess = () => {
        dispatch(GetStudentConsultationActionAsync());
        setIsRefundModalVisible(false);
        onClose();
    };

    return (
        <>
            <Modal
                open={visible}
                onCancel={onClose}
                width={700}
                footer={[
                    // studentDetails.paymentStatus === 'RequestRefund' && (
                    //     <Button key="refund" type="primary" onClick={handleRefundClick}>
                    //         Hoàn tiền
                    //     </Button>
                    // ),
                    <Button key="close" onClick={onClose}>
                        Đóng
                    </Button>
                ]}
            >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Title level={3}>Thông Tin Chi Tiết Đăng Ký Khóa Học</Title>
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
                        {studentDetails.paymentStatus !== 'Refund' && (
                            <>
                                <Descriptions.Item label={<Space><HomeOutlined /> Tên lớp học</Space>}>
                                    {studentDetails.className}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><ScheduleOutlined /> Lịch học</Space>}>
                                    {translateDayOfWeek(studentDetails.classSchedule)}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><ClockCircleOutlined />Ngày khai giảng và kết thúc</Space>}>
                                    {moment(studentDetails.startDate).format('DD/MM/YYYY')} đến {moment(studentDetails.endDate).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label={<Space><CalendarOutlined /> Thời gian đăng ký khóa học</Space>}>
                            {moment(studentDetails.creationDate).format('HH:mm [ngày] DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><DollarOutlined /> Giá khóa học</Space>}>
                            {formatCurrency(studentDetails.coursePrice)}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><DollarOutlined /> Trạng thái thanh toán</Space>}>
                            <Tag color={getStatusColor(studentDetails.paymentStatus)}>
                                {paymentStatusMapping[studentDetails.paymentStatus]}
                            </Tag>
                        </Descriptions.Item>
                        {studentDetails.paymentStatus === 'Refund' && studentDetails.refundAmount && (
                            <>
                                <Descriptions.Item label={<Space><DollarOutlined /> Số tiền đã hoàn</Space>}>
                                    {formatCurrency(studentDetails.refundAmount)}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><ClockCircleOutlined /> Ngày hoàn tiền</Space>}>
                                    {moment(studentDetails.refundDate).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label={<Space><DollarOutlined /> Số tiền đã thanh toán</Space>} >
                            {formatCurrency(studentDetails.studentAmountPaid)}
                        </Descriptions.Item>
                        <Descriptions.Item label={<Space><ClockCircleOutlined /> Ngày thanh toán</Space>}>
                            {moment(studentDetails.paymentDate).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
            </Modal>

            <RefundModal
                visible={isRefundModalVisible}
                onClose={handleRefundModalClose}
                registerCourseId={studentDetails.id}
                onRefundSuccess={handleRefundSuccess}
            />
        </>
    );
}