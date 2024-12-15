import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFranchiseRegistrationConsultActionAsync,
  UpdateFranchiseRegistrationConsultActionAsync,
} from "../../../Redux/ReducerAPI/ConsultationReducer";
import { Table, Select, Modal, Button, Space, Card, Typography, Dropdown, Tooltip, Input } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined, ReconciliationOutlined, SearchOutlined } from "@ant-design/icons";
import { GetCityDataActionAsync } from "../../../Redux/ReducerAPI/CityReducer";
import CreateAgencyModal from "../../Modal/CreateAgencyModal";

const { Title } = Typography;

const renderStatusBadge = (status, type) => {
  // Cấu hình trạng thái tư vấn và trạng thái khách hàng
  const statusConfig = {
    NotConsulted: {
      text: "Chưa tư vấn",
      color: "gray",
      backgroundColor: "#f0f0f0",
      borderColor: "#d9d9d9",
    },
    Consulted: {
      text: "Đã tư vấn",
      color: "green",
      backgroundColor: "#f6ffed",
      borderColor: "#b7eb8f",
    },
    ProspectivePartner: {
      text: "Đối tác tiềm năng",
      color: "blue",
      backgroundColor: "#e6f7ff",
      borderColor: "#91d5ff",
    },
    Approved: {
      text: "Đã duyệt",
      color: "green",
      backgroundColor: "#f6ffed",
      borderColor: "#b7eb8f",
    },
    Reject: {
      text: "Từ chối",
      color: "red",
      backgroundColor: "#fff2f0",
      borderColor: "#ffa39e",
    },
  };

  const config = statusConfig[status] || {
    backgroundColor: "#ffffff",
    borderColor: "#d9d9d9",
  };

  return (
    <div
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "6px",
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <span style={{ color: config.color, fontWeight: "bold" }}>
        {config.text}
      </span>
    </div>
  );
};

const getActionItems = () => [
  {
    label: "Tư vấn",
    key: "approve",
    icon: <EditOutlined style={{ color: "#faad14" }} />,
  },
  {
    label: "Từ chối",
    key: "reject",
    icon: <DeleteOutlined style={{ color: "red" }} />,
  },
];

const ConsultationManagement = () => {
  const { franchiseConsult, totalPagesCount } = useSelector(
    (state) => state.ConsultationReducer
  );
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState(null);
  const [customerStatusFilter, setCustomerStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [createAgencyModalVisible, setCreateAgencyModalVisible] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value)
    setPageIndex(1)
  };

  const handleTableChange = (pagination, filters) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
    setStatusFilter(filters.status ? filters.status[0] : null);
    setCustomerStatusFilter(filters.customerStatus ? filters.customerStatus[0] : null);
  };

  useEffect(() => {
    dispatch(GetFranchiseRegistrationConsultActionAsync(searchTerm, statusFilter, customerStatusFilter, pageIndex, pageSize));
  }, [searchTerm, statusFilter, customerStatusFilter, pageIndex, pageSize, dispatch]);

  useEffect(() => {
    dispatch(GetCityDataActionAsync())
  }, []);

  const handleMenuClick = (record, key) => {
    const statusMap = {
      approve: "Approved",
      reject: "Reject",
    };

    const status = statusMap[key];
    if (status) {
      dispatch(UpdateFranchiseRegistrationConsultActionAsync(record.id, status, searchTerm, statusFilter, customerStatusFilter, pageIndex, pageSize));
    }
  };

  const showModalCreateAgency = (consult) => {
    setCreateAgencyModalVisible(true)
    setSelectedConsult(consult)
  }
  const handleModalCreateAgencyCancel = () => {
    setCreateAgencyModalVisible(false)
    setSelectedConsult(null)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'cusomterName',
      key: 'cusomterName',
      fixed: 'left',
      align: 'center'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: 'Số diện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center'
    },
    {
      title: 'Trạng thái tư vấn',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => renderStatusBadge(status, "status"),
      filters: [
        { text: 'Chưa tư vấn', value: 'NotConsulted' },
        { text: 'Đã tư vấn', value: 'Consulted' },
        { text: 'Đối tác tiềm năng', value: 'ProspectivePartner' },
      ],
      filterMultiple: false,
    },
    {
      title: 'Trạng thái khách hàng',
      dataIndex: 'customerStatus',
      key: 'customerStatus',
      align: 'center',
      render: (customerStatus) => renderStatusBadge(customerStatus, "customerStatus"),
      filters: [
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Từ chối', value: 'Reject' },
      ],
      filterMultiple: false,
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'creationDate',
      key: 'creationDate',
      align: 'center',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày chỉnh sửa',
      dataIndex: 'modificationDate',
      key: 'modificationDate',
      align: 'center',
      render: (date) => date ? new Date(date).toLocaleDateString() : null,
    },
    {
      title: 'Người tư vấn',
      dataIndex: 'consultantName',
      key: 'consultantName',
      fixed: 'right',
      align: 'center'
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'Consulted' && record.customerStatus === 'Approved' && (
            <Tooltip title="Tạo đối tác">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModalCreateAgency(record)}
                style={{ backgroundColor: "#1890ff", border: "none" }}
              />
            </Tooltip>
          )}
          {record.status === 'NotConsulted' && (
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
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>
        <ReconciliationOutlined /> Danh sách tư vấn nhượng quyền
      </Title>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          allowClear
          onPressEnter={(e) => handleSearch(e.target.value)}
        />
      </Space>
      <Table
        bordered
        columns={columns}
        dataSource={franchiseConsult}
        rowKey="id"
        pagination={{
          current: pageIndex,
          pageSize,
          total: totalPagesCount * pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["7", "10"],
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      <CreateAgencyModal
        visible={createAgencyModalVisible}
        onClose={handleModalCreateAgencyCancel}
        consult={selectedConsult}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        customerStatusFilter={customerStatusFilter}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </Card>
  );
};

export default ConsultationManagement;

