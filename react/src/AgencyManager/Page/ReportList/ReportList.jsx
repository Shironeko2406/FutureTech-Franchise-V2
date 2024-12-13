import { Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDataJSONStorage } from '../../../Utils/UtilsFunction';
import { USER_LOGIN } from '../../../Utils/Interceptors';
import { useLoading } from '../../../Utils/LoadingContext';
import { GetReportActionAsync } from '../../../Redux/ReducerAPI/ReportReducer';

const { Text } = Typography;

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
      Pending: {
        text: 'Chờ xác nhận',
        color: 'gold',
        backgroundColor: '#fffbe6',
        borderColor: '#ffe58f'
      },
      Processing: {
        text: 'Đang xử lý',
        color: 'blue',
        backgroundColor: '#e6f7ff',
        borderColor: '#91d5ff'
      },
      Completed: {
        text: 'Đã giải quyết',
        color: 'green',
        backgroundColor: '#f6ffed',
        borderColor: '#b7eb8f'
      },
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



const ReportList = () => {
  const dispatch = useDispatch();
  const agencyId = getDataJSONStorage(USER_LOGIN).agencyId
  const { reportData, totalItemsCount, totalPagesCount } = useSelector(state => state.ReportReducer);
  const { setLoading } = useLoading();
  const [status, setStatus] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
     setLoading(true)
     dispatch(GetReportActionAsync(agencyId, status, pageIndex, pageSize)).finally(() => setLoading(false));
  }, [dispatch, agencyId, status, pageIndex, pageSize]);

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Chờ xác nhận', value: 'Pending' },
        { text: 'Đang xử lý', value: 'Processing' },
        { text: 'Đã giải quyết', value: 'Completed' },
      ],
      filterMultiple: false,
      render: (text) => renderStatusBadge(text),
    },
    {
      title: 'Tên đại lý',
      dataIndex: 'agencyName',
      key: 'agencyName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
  ];

  const expandedRowRender = (record) => {
    const equipmentColumns = [
      { title: 'Tên thiết bị', dataIndex: 'equipmentName', key: 'equipmentName' },
      { title: 'Số seri', dataIndex: 'serialNumber', key: 'serialNumber' },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (text) => renderStatusBadge(text), },
      { title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString('vi-VN')} VND` },
    ];

    return (
      <Table
        columns={equipmentColumns}
        dataSource={record.equipments}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
    setStatus(filters.status && filters.status[0]);
  };

  return (
    <div className="card">
      <div className="card-body">
          <h5 className="card-title mb-3">Danh sách báo cáo</h5>
          <Table
          bordered
          columns={columns}
          dataSource={reportData}
          rowKey={(record) => record.id}
          pagination={{
            showTotal: () => `Tổng số báo cáo: ${totalItemsCount}`,
            current: pageIndex,
            pageSize,
            total: totalPagesCount * pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
            expandedRowClassName: () => 'expanded-row',
          }}
        />
      </div>          
    </div>
  )
}

export default ReportList