import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetEquipmentActionAsync, UpdateEquipmentActionAsync, GetEquipmentDetailsActionAsync } from '../../../Redux/ReducerAPI/EquipmentReducer';
import { Table, Button, Space, Typography, Input } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../../Utils/LoadingContext';
import EquipmentEditModal from '../../Modal/EquipmentEditModal';
import moment from 'moment';

const { Text } = Typography;

const ExpandedRow = ({ record }) => {
    const dispatch = useDispatch();
    const details = useSelector(state => {
        const equipment = state.EquipmentReducer.equipmentData.find(e => e.id === record.id);
        return equipment ? equipment.details : [];
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            await dispatch(GetEquipmentDetailsActionAsync(record.id));
            setLoading(false);
        };
        fetchDetails();
    }, [dispatch, record.id]);

    const columns = [
        { title: 'Số seri', dataIndex: 'serialNumber', key: 'serialNumber' },
        {
            title: 'Ngày bắt đầu sử dụng',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: 'Ngày kết thúc sử dụng',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
    ];

    return <Table columns={columns} dataSource={details} pagination={false} rowKey="id" loading={loading} />;
};

const EquipmentManagementPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { equipmentData, totalItemsCount, totalPagesCount } = useSelector(state => state.EquipmentReducer);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { setLoading } = useLoading();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    useEffect(() => {
        setLoading(true);
        dispatch(GetEquipmentActionAsync(id, status, pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, id, status, pageIndex, pageSize]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setStatus(filters.status ? filters.status[0] : null);
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
            // none: {
            //     text: 'Chưa sử dụng',
            //     color: 'gray',
            //     backgroundColor: '#f0f0f0',
            //     borderColor: '#d9d9d9'
            // }
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

    const handleEditClick = (record) => {
        setSelectedEquipment(record);
        setEditModalVisible(true);
    };

    const handleEditSave = async (values) => {
        await dispatch(UpdateEquipmentActionAsync(selectedEquipment.id, values));
        await dispatch(GetEquipmentActionAsync(id, status, pageIndex, pageSize));
        await dispatch(GetEquipmentDetailsActionAsync(selectedEquipment.id)); // Refetch details after edit
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
                { text: 'Đang sử dụng', value: 'Available' },
                { text: 'Đang sửa chữa', value: 'Repair' },
                // { text: 'Chưa sử dụng', value: 'none' },
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
            width: 140,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        style={{ backgroundColor: "#faad14", color: "#fff" }}
                        onClick={() => handleEditClick(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh sách thiết bị</h5>
                {/* <Space style={{ marginBottom: 16 }}> */}
                {/* <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                    <Input.Search
                        placeholder="Tìm kiếm theo tên thiết bị hoặc số seri"
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    /> */}
                {/* </Space> */}
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
                    expandable={{ expandedRowRender: (record) => <ExpandedRow record={record} /> }}
                />
                <EquipmentEditModal
                    visible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    equipmentData={selectedEquipment}
                    onSave={handleEditSave}
                />
            </div>
        </div>
    );
};

export default EquipmentManagementPage;