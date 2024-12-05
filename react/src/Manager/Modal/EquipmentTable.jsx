
import React, { useEffect } from 'react';
import { Table, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { GetEquipmentDetailsActionAsync } from '../../Redux/ReducerAPI/EquipmentReducer';

const EquipmentTable = ({ data }) => {
    const dispatch = useDispatch();
    const equipmentDetails = useSelector(state => state.EquipmentReducer.equipmentDetails);

    const expandedRowRender = (record) => {
        const details = equipmentDetails[record.id] || [];
        const columns = [
            { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber' },
            { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
            { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
        ];
        return <Table columns={columns} dataSource={details} pagination={false} rowKey="id" />;
    };

    const handleExpand = async (expanded, record) => {
        if (expanded && !equipmentDetails[record.id]) {
            try {
                await dispatch(GetEquipmentDetailsActionAsync(record.id));
            } catch (error) {
                message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
        }
    };

    const columns = [
        { title: 'Equipment Name', dataIndex: 'equipmentName', key: 'equipmentName' },
        { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            expandable={{ expandedRowRender, onExpand: handleExpand }}
            rowKey="id"
        />
    );
};

export default EquipmentTable;