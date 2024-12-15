import { Button, Card, Input, Select, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAgencyActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";
import { EditOutlined, RightCircleOutlined, SearchOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const statusMapping = {
  Processing: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Active: 'Đang hoạt động',
  Suspended: 'Tạm ngưng hoạt động',
  Inactive: 'Không hoạt động',
};

const renderStatusBadge = (status) => {
  const statusConfig = {
    Processing: {
      text: statusMapping[status],
      color: 'orange',
      backgroundColor: '#fff7e6',
      borderColor: '#ffd591',
    },
    Approved: {
      text: statusMapping[status],
      color: 'green',
      backgroundColor: '#f6ffed',
      borderColor: '#b7eb8f',
    },
    Active: {
      text: statusMapping[status],
      color: '#3498db',
      backgroundColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    Suspended: {
      text: statusMapping[status],
      color: 'red',
      backgroundColor: '#fff2f0',
      borderColor: '#ffa39e',
    },
    Inactive: {
      text: statusMapping[status],
      color: 'gray',
      backgroundColor: '#f0f0f0',
      borderColor: '#d9d9d9',
    },
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

const AgencyManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { agencyData, totalPagesCount } = useSelector((state) => state.AgencyReducer);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  //Function state filter and pagination
  const handleStatusChange = (value) => {
    setStatus(value);
    setPageIndex(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPageIndex(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    dispatch(GetAgencyActionAsync(pageIndex, pageSize, status, search))
  }, [status, pageIndex, pageSize, search]);

  //-----------------------------

  //Render columm table
  const columns = [
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/manager/agency/${record.id}/task-detail`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            height: "auto",
            fontSize: "14px",
            transition: "all 0.3s ease",
          }}
          className="hover:bg-blue-50"
        >
          <Text strong style={{ marginRight: "4px" }}>
            {text}
          </Text>
          <RightCircleOutlined style={{ fontSize: "16px" }} />
        </Button>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        `${record.address || ''}, ${record.ward || ''}, ${record.district || ''}, ${record.city || ''}`
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => renderStatusBadge(text),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => navigate(`/manager/agency/edit/${record.id}`)}
          style={{
            fontSize: "16px",
            color: "#1890ff",
            transition: "all 0.3s ease",
          }}
          className="hover:text-blue-500"
        />
      ),
    },
  ];
  //----------------------------------

  return (
    <Card>
      <Title level={4}>
        <ShopOutlined /> Quản lý nhượng quyền
      </Title>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          onPressEnter={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          aria-label="Search agencies"
        />
        <Select
          placeholder="Filter by Status"
          style={{ width: 180 }}
          onChange={handleStatusChange}
          value={status}
          options={[
            { value: "", label: 'Tất cả' },
            { value: "Processing", label: 'Chờ duyệt' },
            { value: "Approved", label: 'Đã duyệt' },
            { value: "Active", label: 'Đang hoạt động' },
            { value: "Suspended", label: 'Tạm ngưng hoạt động' },
            { value: "Inactive", label: 'Không hoạt động' },
          ]}
        />
      </Space>
      <Table
        bordered
        columns={columns}
        dataSource={agencyData}
        rowKey="id"
        pagination={{
          current: pageIndex,
          pageSize,
          total: totalPagesCount * pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10"],
        }}
        scroll={{ x: 'max-content' }} // Add this line for horizontal scroll
      />
    </Card>
  );
};

export default AgencyManagement;
