
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetEquipmentActionAsync } from '../../Redux/ReducerAPI/EquipmentReducer';
import { Table, Input, Space, Typography, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const EquipmentList = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { equipmentData, totalItemsCount, totalPagesCount } = useSelector(state => state.EquipmentReducer);
    const [status, setStatus] = useState('active');
    const [search, setSearch] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        dispatch(GetEquipmentActionAsync(id, status, pageIndex, pageSize));
    }, [dispatch, id, status, pageIndex, pageSize]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setStatus(filters.status ? filters.status[0] : 'active');
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

    const columns = [
        {
            title: 'Tên thiết bị',
            dataIndex: 'equipmentName',
            key: 'equipmentName',
        },
        {
            title: 'Số seri',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
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
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Tên đại lý',
            dataIndex: 'agencyName',
            key: 'agencyName',
        },
    ];

    return (
        <div>
            <h1>Danh sách thiết bị</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Space>
                    <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                    <Input.Search
                        placeholder="Tìm kiếm theo tên thiết bị hoặc số seri"
                        onSearch={handleSearch}
                        style={{ width: 360 }}
                        enterButton={<SearchOutlined />}
                    />
                </Space>
                <Select defaultValue="active" onChange={value => setStatus(value)}>
                    <Option value="Available">Sẵn có</Option>
                    <Option value="Repair">Đang sửa chữa</Option>
                    <Option value="none">Không có</Option>
                </Select>
            </div>
            <Table
                dataSource={equipmentData}
                columns={columns}
                rowKey="id"
                pagination={{
                    showTotal: () => `Tổng số thiết bị: ${totalItemsCount}`,
                    current: pageIndex,
                    pageSize,
                    total: totalPagesCount * pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default EquipmentList;