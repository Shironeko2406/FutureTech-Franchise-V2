import { Button, Table, Space, Typography, DatePicker, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMonthlyDuePaymentsActionAsync } from "../../../Redux/ReducerAPI/PaymentReducer";
import { useLoading } from "../../../Utils/LoadingContext";
import moment from "moment";
import PaymentDetailsModal from "../../Modal/PaymentDetailsModal";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const PaymentMonthlyAgencyManager = () => {
    const { paymentInfo, totalPagesCount, totalItemsCount } = useSelector((state) => state.PaymentReducer);
    const { userLogin } = useSelector((state) => state.AuthenticationReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState(null);
    const { setLoading } = useLoading();
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);

    useEffect(() => {
        setLoading(true);
        dispatch(GetMonthlyDuePaymentsActionAsync(startDate, endDate, status, userLogin.agencyId, pageIndex, pageSize))
            .finally(() => setLoading(false));
    }, [dispatch, startDate, endDate, status, userLogin.agencyId, pageIndex, pageSize]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setStatus(filters.status ? filters.status[0] : null);
    };

    const handleDateChange = (dates) => {
        setStartDate(dates ? moment(dates[0]).format('YYYY-MM-DD') : null);
        setEndDate(dates ? moment(dates[1]).format('YYYY-MM-DD') : null);
    };

    const handleRowClick = (record) => {
        setSelectedPaymentDetails(record);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false);
        setSelectedPaymentDetails(null);
    };

    const renderStatusBadge = (status) => {
        const statusConfig = {
            NotCompleted: {
                text: 'Chưa hoàn thành',
                color: 'red',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            },
            Completed: {
                text: 'Hoàn thành',
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Fail: {
                text: 'Thất bại',
                color: 'orange',
                backgroundColor: '#fff7e6',
                borderColor: '#ffd591'
            }
        };

        const config = statusConfig[status] || statusConfig.Completed;

        return (
            <div
                style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    backgroundColor: config.backgroundColor,
                    border: `1px solid ${config.borderColor}`,
                }}
            >
                <Text strong style={{ color: config.color }}>
                    {config.text}
                </Text>
            </div>
        );
    };

    const handlePayment = (paymentUrl) => {
        window.open(paymentUrl, '_blank');
    };

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '';
    };

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            align: "center",
            render: (text, record) => (
                <Button type="link" onClick={() => handleRowClick(record)}>
                    {text}
                </Button>
            ),
        },
        // {
        //     title: "Mô tả",
        //     dataIndex: "description",
        //     key: "description",
        //     align: "center",
        //     render: (text) => (
        //         <Tooltip title={text}>
        //             <span>
        //                 {text.length > 20 ? `${text.substring(0, 20)}...` : text}
        //             </span>
        //         </Tooltip>
        //     ),
        // },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            align: "center",
            render: (amount) => formatCurrency(amount),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            filters: [
                { text: 'Chưa hoàn thành', value: 'NotCompleted' },
                { text: 'Hoàn thành', value: 'Completed' },
                { text: 'Thất bại', value: 'Fail' },
            ],
            filterMultiple: false,
            render: (status) => renderStatusBadge(status),
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "paidDate",
            key: "paidDate",
            align: "center",
            render: (date) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
        },
        {
            title: "Ngày tạo",
            dataIndex: "creattionDate",
            key: "creattionDate",
            align: "center",
            render: (date) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                record.status === 'NotCompleted' && (
                    <Button type="primary" onClick={() => handlePayment(record.paymentUrl)}>
                        Thanh toán
                    </Button>
                )
            ),
        }
    ];

    return (
        <div className="card">
            <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h5 className="card-title mb-3">Danh sách thanh toán hàng tháng</h5>
                    <Space>
                        <Text strong>Lọc theo ngày thanh toán:</Text>
                        <RangePicker onChange={handleDateChange} />
                    </Space>
                </div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={paymentInfo}
                    rowKey={(record) => record.id}
                    pagination={{
                        showTotal: () => `Tổng số giao dịch: ${totalItemsCount}`,
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    onChange={handleTableChange}
                />
                {selectedPaymentDetails && (
                    <PaymentDetailsModal
                        visible={isDetailModalVisible}
                        onClose={handleDetailModalClose}
                        paymentDetails={selectedPaymentDetails}
                    />
                )}
            </div>
        </div>
    );
};

export default PaymentMonthlyAgencyManager;
