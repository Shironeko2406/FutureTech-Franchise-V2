import { Table, Button, Typography, Spin, Input, DatePicker, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RightCircleOutlined } from "@ant-design/icons";
import { GetContractsActionAsync } from "../../../Redux/ReducerAPI/ContractReducer";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ContractDetailModal from "../../Modal/ContractDetailModal"; // Import the modal
import CreateContractModal from "../../Modal/CreateContractModal"; // Import the modal

const { Text } = Typography;

const ManageContractPage = () => {
    const { contracts, totalPagesCount } = useSelector((state) => state.ContractReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(""); // Add search input state
    const [dateRange, setDateRange] = useState([null, null]); // Add date range state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [contractToRenew, setContractToRenew] = useState(null);
    const navigate = useNavigate();

    const refreshContracts = () => {
        setLoading(true);
        const [startDate, endDate] = dateRange || [null, null];
        dispatch(GetContractsActionAsync(pageIndex, pageSize, startDate, endDate, searchInput)).finally(() => setLoading(false));
    };

    useEffect(() => {
        refreshContracts();
    }, [dispatch, pageIndex, pageSize, searchInput, dateRange]); // Add dateRange dependency

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    const handleSearch = (value) => {
        setSearchInput(value);
        setPageIndex(1); // Reset to first page on search
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
        setPageIndex(1); // Reset to first page on date change
    };

    const handleBranchClick = (contract) => {
        setSelectedContract(contract);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedContract(null);
    };

    const handleRenewClick = (contract) => {
        setContractToRenew(contract);
        setIsCreateModalVisible(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalVisible(false);
        setContractToRenew(null);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "no",
            key: "no",
            align: "center",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Mã hợp đồng",
            dataIndex: "contractCode",
            key: "contractCode",
            align: "center",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleBranchClick(record)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        height: 'auto',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                    }}
                    className="hover:bg-blue-50"
                >
                    <Text strong style={{ marginRight: '4px' }}>{text}</Text>
                    <RightCircleOutlined style={{ fontSize: '16px' }} />
                </Button>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            align: "center",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Tên chi nhánh",
            dataIndex: "agencyName",
            key: "agencyName",
            align: "center",
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
            render: (text) => moment(text).format("DD/MM/YYYY"),
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
            render: (text) => moment(text).format("DD/MM/YYYY"),
        },
        {
            title: "Tổng giá trị hợp đồng",
            dataIndex: "total",
            key: "total",
            align: "center",
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (text, record) => {
                const endDate = moment(record.endTime);
                const currentDate = moment();
                const isWithinTwoMonths = endDate.diff(currentDate, 'months') <= 2;

                return isWithinTwoMonths ? (
                    <Button type="primary" onClick={() => handleRenewClick(record)}>
                        Gia hạn hợp đồng
                    </Button>
                ) : null;
            },
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh Sách Hợp Đồng</h5>
                <Space style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                    <Input.Search
                        placeholder="Tìm kiếm theo tiêu đề hoặc tên chi nhánh"
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                    <DatePicker.RangePicker
                        onChange={handleDateChange}
                        style={{ marginLeft: 16 }}
                    />
                </Space>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        bordered
                        columns={columns}
                        dataSource={contracts}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: pageIndex,
                            pageSize,
                            total: totalPagesCount * pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                        }}
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                        onChange={handleTableChange}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                    />
                )}
                <ContractDetailModal
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    contractDetail={selectedContract}
                />
                <CreateContractModal
                    visible={isCreateModalVisible}
                    onClose={handleCreateModalClose}
                    agencyId={contractToRenew?.agencyId}
                    onContractCreated={() => {
                        handleCreateModalClose();
                        refreshContracts(); // Refresh contracts list
                    }}
                />
            </div>
        </div>
    );
};

export default ManageContractPage;
