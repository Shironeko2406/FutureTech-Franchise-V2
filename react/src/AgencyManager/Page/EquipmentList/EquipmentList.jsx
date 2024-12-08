import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetEquipmentActionAsync, UpdateEquipmentActionAsync, GetEquipmentDetailsActionAsync } from '../../../Redux/ReducerAPI/EquipmentReducer';
import { Table, Button, Space, Typography } from 'antd';
import { useLoading } from '../../../Utils/LoadingContext';
import { GetUserLoginActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
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
            setLoading(true);
            await dispatch(GetEquipmentDetailsActionAsync(record.id));
            setLoading(false);
        };
        fetchDetails();
    }, [dispatch, record.id, setLoading]);

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

const EquipmentList = () => {
    const dispatch = useDispatch();
    const { userProfile } = useSelector((state) => state.UserReducer);
    const { equipmentData, totalItemsCount, totalPagesCount } = useSelector(state => state.EquipmentReducer);
    const [status, setStatus] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { setLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(GetUserLoginActionAsync());
            if (userProfile.agencyId) {
                await dispatch(GetEquipmentActionAsync(userProfile.agencyId, status, pageIndex, pageSize));
            }
            setLoading(false);
        };
        fetchData();
    }, [dispatch, userProfile.agencyId, status, pageIndex, pageSize]);

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
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh sách thiết bị</h5>
                {/* <Space style={{ marginBottom: 16 }}> */}
                {/* <span style={{ marginRight: 8 }}                  onSearch={handleSearch}
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
            </div>
        </div>
    );
};

export default EquipmentList;