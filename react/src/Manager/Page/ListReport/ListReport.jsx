import { Button, Dropdown, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDataJSONStorage } from '../../../Utils/UtilsFunction';
import { USER_LOGIN } from '../../../Utils/Interceptors';
import { useLoading } from '../../../Utils/LoadingContext';
import { GetReportActionAsync, UpdateReportStatusByIdActionAsync } from '../../../Redux/ReducerAPI/ReportReducer';
import { CheckCircleOutlined, EllipsisOutlined, SyncOutlined } from '@ant-design/icons';
import CreateTaskRepairingEquipmentModal from '../../Modal/CreateTaskRepairingEquipmentModal';

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

const getActionItems = (status) => {
    const items = [
      {
        label: "Xử lý",
        key: "processing",
        icon: <SyncOutlined style={{ color: "#1890ff" }} />,
      },
      {
        label: "Hoàn thành",
        key: "completed",
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
      },
    ];
  
    const statusToHide = {
      'Processing': ['processing'],
      'Completed': ['processing', 'completed'],
    };
  
    // Lọc các mục theo status
    const itemsToDisplay = statusToHide[status] 
      ? items.filter(item => !statusToHide[status].includes(item.key))
      : items;
  
    return itemsToDisplay;
  };
  
  
const ListReport = () => {
    const dispatch = useDispatch();
    const { reportData, totalItemsCount, totalPagesCount } = useSelector(state => state.ReportReducer);
    const { setLoading } = useLoading();
    const [filters, setFilters] = useState({
      statusFilter: null,
    });
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [createTaskRepairingEquipmentModalVisible, setCreateTaskRepairingEquipmentModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

  
    useEffect(() => {
       setLoading(true)
       dispatch(GetReportActionAsync(null, filters.statusFilter, pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, filters, pageIndex, pageSize]);

    const handleMenuClick = (record, key) => {
        const statusMap = {
           processing: "Processing",
           completed: "Completed",
        };
      
        const status = statusMap[key];
        if (status) {
            if (status === "Processing") {
                setCreateTaskRepairingEquipmentModalVisible(true);
                setSelectedReport(record);
                setSelectedStatus(status);
              } else if (status === "Completed") {
                dispatch(UpdateReportStatusByIdActionAsync(record.id, status, filters, pageIndex, pageSize))
              }
          }
      };

    //Hàm đóng mở modal
    const handleCloseModalRepairingEquipment = () => {
        setCreateTaskRepairingEquipmentModalVisible(false);
        setSelectedReport(null)
    }
    //------------------
    
  
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
        title: 'Tên chi nhánh',
        dataIndex: 'agencyName',
        key: 'agencyName',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: (date) => new Date(date).toLocaleString('vi-VN'),
      },
      {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
            <Space size="small">               
                {record.status !== "Completed" && (
                    <Dropdown
                        menu={{
                            items: getActionItems(record.status),
                            onClick: ({ key }) => handleMenuClick(record, key),
                        }}
                        >
                        <Button
                            type="primary"
                            icon={<EllipsisOutlined />}
                            style={{ backgroundColor: "#50e3c2", color: "#0A5A5A" }}
                        />
                    </Dropdown>
            )}
            </Space>
        ),
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
  
    const handleTableChange = (pagination, tableFilters, sorter) => {
      const newStatusFilter = tableFilters.status && tableFilters.status[0];
      const isStatusFilterChanged = newStatusFilter !== filters.statusFilter;

      setPageIndex(isStatusFilterChanged ? 1 : pagination.current);
      setPageSize(pagination.pageSize);
      setFilters(prevFilters => ({
        ...prevFilters,
        statusFilter: newStatusFilter
      }));
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
                    expandRowByClick: false,
                    expandedRowClassName: () => 'expanded-row',
                }}
            />
        </div>   

        <CreateTaskRepairingEquipmentModal
            visible={createTaskRepairingEquipmentModalVisible}
            onClose={handleCloseModalRepairingEquipment}
            selectedReport={selectedReport}
            statusUpdate={selectedStatus}
            filters={filters}
            pageIndex={pageIndex}
            pageSize={pageSize}
        />       
    </div>
  )
}

export default ListReport