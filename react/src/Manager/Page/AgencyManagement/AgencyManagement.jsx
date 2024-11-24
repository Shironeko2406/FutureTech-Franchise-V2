import { Button, Card, Input, Select, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAgencyActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";
import { RightCircleOutlined, SearchOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;


const AgencyManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { agencyData, totalPagesCount } = useSelector((state) => state.AgencyReducer);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(1);
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
    },
  ];
  //----------------------------------

  return (
    <Card>
      <Title level={4}>
        <ShopOutlined/> Quản lý chi nhánh
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
            {value: "", label: 'Tất cả'},
            {value: "Processing", label: 'Chờ duyệt'},
            {value: "Approved", label: 'Đã duyệt'},
            {value: "Active", label: 'Đang hoạt động'},
            {value: "Suspended", label: 'Tạm ngưng hoạt động'},
            {value: "Inactive", label: 'Không hoạt động'},
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
            pageSizeOptions: ["7", "10"],
          }}
      />
    </Card>
  );
};

export default AgencyManagement;
