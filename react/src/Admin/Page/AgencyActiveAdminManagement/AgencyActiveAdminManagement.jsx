import { Button, Card, Input, Select, Space, Table, Typography, DatePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAgencyActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";
import { RightCircleOutlined, SearchOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ExportAgencyRevenueReportAsync } from "../../../Redux/ReducerAPI/AgencyDashboardReducer";

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

const AgencyActiveAdminManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { agencyData, totalPagesCount } = useSelector((state) => state.AgencyReducer);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  //Function state filter and pagination
  const handleSearch = (value) => {
    setSearch(value);
    setPageIndex(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const handleExportReport = () => {
    if (selectedMonth && selectedYear) {
      dispatch(ExportAgencyRevenueReportAsync(selectedMonth, selectedYear));
    } else {
      message.error("Vui lòng chọn tháng và năm!");
    }
  };

  useEffect(() => {
    dispatch(GetAgencyActionAsync(pageIndex, pageSize, 'Active', search))
  }, [pageIndex, pageSize, search]);

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
          onClick={() => navigate(`/admin/agency-active/${record.id}`)}
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
  ];
  //----------------------------------

  return (
    <Card>
      <Title level={4}>
        <ShopOutlined /> Quản lý chi nhánh hoạt động
      </Title>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            onPressEnter={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
            aria-label="Search agencies"
          />
          <Space>
            <DatePicker
              picker="month"
              onChange={(date, dateString) => {
                const [year, month] = dateString.split('-');
                setSelectedMonth(month);
                setSelectedYear(year);
              }}
              placeholder="Chọn tháng và năm"
            />
            <Button type="primary" onClick={handleExportReport}>
              Xuất báo cáo doanh thu
            </Button>
          </Space>
        </Space>
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
  )
}

export default AgencyActiveAdminManagement;