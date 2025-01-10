import { Modal, Descriptions, Button, Tag } from "antd";
import React from "react";
import moment from "moment";

const PaymentDetailsModal = ({ visible, onClose, paymentDetails, renderStatusBadge }) => {
    const formatValue = (value) => (value ? value : "");

    const getStatusColor = (status) => {
        const colors = {
            NotCompleted: "error",
            Completed: "success",
            Fail: "warning"
        };
        return colors[status] || "default";
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
                <Descriptions.Item label="Số tiền">{formatValue(paymentDetails.amount)}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(paymentDetails.status)}>
                        {renderStatusBadge(paymentDetails.status)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Chi nhánh">{formatValue(paymentDetails.agencyName)}</Descriptions.Item>
                <Descriptions.Item label="Doanh thu">{formatValue(paymentDetails.revenue)}</Descriptions.Item>
                <Descriptions.Item label="Hoàn tiền">{formatValue(paymentDetails.refunds)}</Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ chia sẻ doanh thu">{formatValue(paymentDetails.revenueSharePercentage)}</Descriptions.Item>
                <Descriptions.Item label="Lợi nhuận thực tế">{formatValue(paymentDetails.actualProfits)}</Descriptions.Item>
                <Descriptions.Item label="Ngày thanh toán">{formatValue(paymentDetails.paidDate ? moment(paymentDetails.paidDate).format('DD/MM/YYYY HH:mm') : "")}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{formatValue(paymentDetails.creattionDate ? moment(paymentDetails.creattionDate).format('DD/MM/YYYY HH:mm') : "")}</Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default PaymentDetailsModal;
