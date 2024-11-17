import { Table, Button, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { GetContractsActionAsync } from "../../../Redux/ReducerAPI/ContractReducer";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ManageContractPage = () => {
    // const { contracts, totalPagesCount } = useSelector((state) => state.ContractReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        dispatch(GetContractsActionAsync(pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize]);

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            align: "center",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleRowClick(record.id)}
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
                </Button>
            ),
        },
        {
            title: "Agency Name",
            dataIndex: "agencyName",
            key: "agencyName",
            align: "center",
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "center",
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Contract List</h5>
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
                    loading={loading}
                    onChange={handleTableChange}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                />
            </div>
        </div>
    );
};

export default ManageContractPage;
