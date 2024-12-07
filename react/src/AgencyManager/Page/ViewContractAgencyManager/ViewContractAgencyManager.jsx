import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetContractsWithAgencyIdActionAsync } from '../../../Redux/ReducerAPI/ContractReducer';
import { GetUserLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { Table, Button, Typography, Input, DatePicker, Space } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import { useLoading } from '../../../Utils/LoadingContext';
import moment from 'moment';
import ContractDetailModal from "../../Modal/ContractDetailModal"; // Import the modal


const { Text } = Typography;

const ViewContractAgencyManager = () => {
    const dispatch = useDispatch();
    const { contracts, totalPagesCount } = useSelector(state => state.ContractReducer);
    const { userProfile } = useSelector(state => state.UserReducer);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(GetUserLoginActionAsync());
            if (userProfile.agencyId) {
                await dispatch(GetContractsWithAgencyIdActionAsync(userProfile.agencyId, pageIndex, pageSize));
            }
            setLoading(false);
        };
        fetchData();
    }, [dispatch, userProfile.agencyId, pageIndex, pageSize]);

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleBranchClick = (contract) => {
        setSelectedContract(contract);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedContract(null);
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
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            align: "center",
            render: (text, record) => (
                <Button
                    onClick={() => handleBranchClick(record)}
                    type="link"
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
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh sách hợp đồng</h5>
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
                    onChange={handleTableChange}
                />
            </div>
            <ContractDetailModal
                visible={isModalVisible}
                onClose={handleModalClose}
                contractDetail={selectedContract}
            />
        </div>
    );
};

export default ViewContractAgencyManager;