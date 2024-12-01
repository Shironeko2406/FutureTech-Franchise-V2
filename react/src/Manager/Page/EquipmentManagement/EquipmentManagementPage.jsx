import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetEquipmentActionAsync } from '../../../Redux/ReducerAPI/EquipmentReducer';
import { Table, Button, Space, Typography, Input, Modal, Tooltip, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, EllipsisOutlined, DownloadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../../Utils/LoadingContext'; // Import useLoading

const { Text } = Typography;

const EquipmentManagementPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { equipmentData, totalItemsCount, totalPagesCount } = useSelector(state => state.EquipmentReducer);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { setLoading } = useLoading(); // Use global loading

    useEffect(() => {
        setLoading(true);
        dispatch(GetEquipmentActionAsync(id, status, pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, id, status, pageIndex, pageSize]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setStatus(filters.status ? filters.status[0] : null);
    };

    const handleSearch = (value) => {
        setSearch(value);
        dispatch(GetEquipmentActionAsync(id, status, 1, pageSize));
    };

    const renderStatusBadge = (status) => {
        const statusConfig = {
            Available: {
                text: 'Đang sử dụng',
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Repair: {
                text: 'Đang sửa chữa',
                color: 'orange',
                backgroundColor: '#fff7e6',
                borderColor: '#ffd591'
            },
            none: {
                text: 'Không có',
                color: 'gray',
                backgroundColor: '#f0f0f0',
                borderColor: '#d9d9d9'
            }
        };

        const config = statusConfig[status] || statusConfig.none;

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

    const getActionItems = () => [
        {
            label: "Sửa",
            key: "edit",
            icon: <EditOutlined style={{ color: "#faad14" }} />,
        },
        {
            label: "Xóa",
            key: "delete",
            icon: <DeleteOutlined style={{ color: "red" }} />,
        },
    ];

    const handleMenuClick = async (record, key) => {
        if (key === "edit") {
            // Handle edit action
        } else if (key === "delete") {
            Modal.confirm({
                title: "Bạn có chắc chắn muốn xóa thiết bị này?",
                content: "Hành động này không thể hoàn tác.",
                okText: "Xóa",
                okType: "danger",
                cancelText: "Hủy",
                onOk: async () => {
                    // Handle delete action
                },
            });
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            align: 'center',
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'equipmentName',
            key: 'equipmentName',
            align: 'center',
        },
        {
            title: 'Số seri',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            filters: [
                { text: 'Sẵn có', value: 'Available' },
                { text: 'Đang sửa chữa', value: 'Repair' },
                { text: 'Không có', value: 'none' },
            ],
            filterMultiple: false,
            render: (text) => renderStatusBadge(text),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            align: 'center',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Dropdown
                        menu={{
                            items: getActionItems(),
                            onClick: ({ key }) => handleMenuClick(record, key),
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<EllipsisOutlined />}
                            style={{ backgroundColor: "#50e3c2", color: "#0A5A5A" }}
                        />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh sách thiết bị</h5>
                {/* <Space style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                    <Input.Search
                        placeholder="Tìm kiếm theo tên thiết bị hoặc số seri"
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                </Space> */}
                <Table
                    bordered
                    columns={columns}
                    dataSource={equipmentData}
                    rowKey={(record) => record.id}
                    pagination={{
                        showTotal: () => `Tổng số thiết bị: ${totalItemsCount}`,
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

export default EquipmentManagementPage;