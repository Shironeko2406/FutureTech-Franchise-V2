import { Modal, Typography, Descriptions, Tag, Space } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, BookOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, HomeOutlined, ScheduleOutlined, EditOutlined } from "@ant-design/icons";
import moment from 'moment';

const { Title, Text } = Typography;

// Hàm để định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

export default function StudentRegistrationDetailsModal({ visible, onClose, studentDetails, paymentStatusMapping, }) {
    if (!studentDetails) return null;

    const getStatusColor = (status) => {
        const colors = {
            Pending_Payment: "warning",
            Advance_Payment: "processing",
            Completed: "success",
            Late_Payment: "error",
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

        const [days, startTime, endTime] = dayOfWeekString.split("-");

        const translatedDays = days
            .split(", ")
            .map((day) => day.trim())
            .map((day) => dayTranslation[day] || day)
            .join(", ");

        return `${translatedDays} - ${startTime} đến ${endTime}`;
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            width={700}
            footer={[
                // isEditing && (
                //     <>
                //         <Button key="cancel" onClick={handleCancel} disabled={spinning}>
                //             Hủy
                //         </Button>
                //         <Button key="save" type="primary" onClick={handleSave} loading={spinning}>
                //             Lưu
                //         </Button>
                //     </>
                // )
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
                    <Descriptions.Item label={<Space><HomeOutlined /> Tên lớp học</Space>}>
                        {studentDetails.className}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><ScheduleOutlined /> Lịch học</Space>}>
                        {translateDayOfWeek(studentDetails.classSchedule)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><ClockCircleOutlined />Ngày khai giảng và kết thúc</Space>}>
                        {moment(studentDetails.startDate).format('DD/MM/YYYY')} đến {moment(studentDetails.endDate).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><CalendarOutlined /> Thời gian đăng ký khóa học</Space>}>
                        {moment(studentDetails.creationDate).format('HH:mm [ngày] DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><DollarOutlined /> Giá khóa học</Space>}>
                        {formatCurrency(studentDetails.coursePrice)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><DollarOutlined /> Trạng thái thanh toán</Space>}>
                        <Tag color={getStatusColor(studentDetails.paymentStatus, paymentStatusMapping)}>
                            {paymentStatusMapping[studentDetails.paymentStatus]}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><DollarOutlined /> Số tiền đã thanh toán</Space>} >
                        {formatCurrency(studentDetails.studentAmountPaid)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><ClockCircleOutlined /> Ngày thanh toán</Space>}>
                        {moment(studentDetails.paymentDate).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                </Descriptions>
            </Space>
        </Modal >
    );
}