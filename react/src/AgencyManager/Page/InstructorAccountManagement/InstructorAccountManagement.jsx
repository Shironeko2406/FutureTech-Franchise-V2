
import { Table, Input, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAccountsActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
import { SearchOutlined } from "@ant-design/icons";
import { useLoading } from "../../../Utils/LoadingContext";

const { Text } = Typography;

const InstructorAccountManagement = () => {
    const { accounts, totalPagesCount, totalItemsCount } = useSelector((state) => state.UserReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        dispatch(GetAccountsActionAsync(search, isActive, "Instructor", pageIndex, pageSize))
            .finally(() => setLoading(false));
    }, [dispatch, search, isActive, pageIndex, pageSize, setLoading]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setIsActive(filters.isActive ? filters.isActive[0] : null);
    };

    const renderStatusBadge = (status) => {
        const statusConfig = {
            Active: {
                text: 'Hoạt động',
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Inactive: {
                text: 'Không hoạt động',
                color: 'red',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            }
        };

        const config = statusConfig[status] || statusConfig.Inactive;

        return (
            <div
                style={{
                    display: 'inline-block',
                    padding: '4px 12px',
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

    const columns = [
        {
            title: "Tên giảng viên",
            dataIndex: "fullName",
            key: "fullName",
            align: "center",
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "userName",
            key: "userName",
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            align: "center",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center",
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            filters: [
                { text: 'Hoạt động', value: 'Active' },
                { text: 'Không hoạt động', value: 'Inactive' },
            ],
            filterMultiple: false,
            render: (text) => renderStatusBadge(text),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createAt",
            key: "createAt",
            align: "center",
            render: (text) => new Date(text).toLocaleDateString(),
        },
    ];

    const handleSearch = (value) => {
        setSearch(value);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Quản Lý Tài Khoản Giảng Viên</h5>
                <Space style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                    <Input.Search
                        placeholder="Nhập tên đăng nhập, số điện thoại hoặc email"
                        onSearch={handleSearch}
                        style={{ width: 360 }}
                        enterButton={<SearchOutlined />}
                    />
                </Space>
                <Table
                    bordered
                    columns={columns}
                    dataSource={accounts}
                    rowKey={(record) => record.id}
                    pagination={{
                        showTotal: () => `Tổng số giảng viên: ${totalItemsCount}`,
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
};

export default InstructorAccountManagement;