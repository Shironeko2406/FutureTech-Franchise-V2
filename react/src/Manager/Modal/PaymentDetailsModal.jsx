import { Modal, Descriptions, Button, Tag } from "antd";
import React from "react";
import moment from "moment";

const PaymentDetailsModal = ({ visible, onClose, paymentDetails }) => {
    const formatValue = (value, isPercentage = false) => {
        return value ? (isPercentage ? `${value}%` : value) : "";
    };

    const getStatusColor = (status) => {
        const colors = {
            NotCompleted: "error",
            Completed: "success",
            Fail: "warning"
        };
        return colors[status] || "default";
    };

    const getStatusText = (status) => {
        const statusText = {
            NotCompleted: 'Chưa hoàn thành',
            Completed: 'Hoàn thành',
            Fail: 'Thất bại'
        };
        return statusText[status] || 'Hoàn thành';
    };

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '';
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={<Button onClick={onClose}>Đóng</Button>}
            title="Chi tiết thanh toán"
        >
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Tiêu đề">{formatValue(paymentDetails.title)}</Descriptions.Item>
                <Descriptions.Item label="Mô tả">{formatValue(paymentDetails.description)}</Descriptions.Item>
                <Descriptions.Item label="Số tiền">{formatCurrency(paymentDetails.amount)}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(paymentDetails.status)}>
                        {getStatusText(paymentDetails.status)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Chi nhánh">{formatValue(paymentDetails.agencyName)}</Descriptions.Item>
                <Descriptions.Item label="Doanh thu">{formatCurrency(paymentDetails.revenue)}</Descriptions.Item>
                <Descriptions.Item label="Hoàn tiền">{formatCurrency(paymentDetails.refunds)}</Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ chia sẻ doanh thu">{formatValue(paymentDetails.revenueSharePercentage, true)}</Descriptions.Item>
                <Descriptions.Item label="Lợi nhuận thực tế">{formatCurrency(paymentDetails.actualProfits)}</Descriptions.Item>
                <Descriptions.Item label="Ngày thanh toán">{formatValue(paymentDetails.paidDate ? moment(paymentDetails.paidDate).format('DD/MM/YYYY HH:mm') : "")}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{formatValue(paymentDetails.creattionDate ? moment(paymentDetails.creattionDate).format('DD/MM/YYYY HH:mm') : "")}</Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default PaymentDetailsModal;
