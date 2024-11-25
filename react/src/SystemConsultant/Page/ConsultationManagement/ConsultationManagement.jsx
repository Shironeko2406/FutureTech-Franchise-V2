// 


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFranchiseRegistrationConsultActionAsync,
  UpdateFranchiseRegistrationConsultActionAsync,
} from "../../../Redux/ReducerAPI/ConsultationReducer";
import { Table, Select, Modal, Button, Space, Card, Typography, Dropdown } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, ReconciliationOutlined, RocketOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const getActionItems = () => [
  {
    label: "Duyệt",
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
  const [filters, setFilters] = useState({
    statusFilter: '',
  });
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    setPageIndex(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    dispatch(GetFranchiseRegistrationConsultActionAsync(filters.statusFilter, pageIndex, pageSize));
  }, [filters, pageIndex, pageSize, dispatch]);

  const handleMenuClick = (record, key) => {
    if (key === 'approve') {
      handleApproveFranchiseRegisById(record.id);
    } else if (key === 'reject') {
      // Handle reject action
    
    }
  };


  const handleApproveFranchiseRegisById = (id) => {
    dispatch(UpdateFranchiseRegistrationConsultActionAsync(
      id,
      filters.statusFilter,
      pageIndex,
      pageSize
    ));
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'cusomterName',
      key: 'cusomterName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số diện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {/* <Button type="primary" onClick={() => handleApproveFranchiseRegisById(record.id)}>
            Approve
          </Button>
          <Button danger>Reject</Button> */}
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
        <Select
          style={{ width: 150 }}
          onChange={(value) => handleFilterChange('statusFilter', value)}
          value={filters.statusFilter}
        >
          <Option value="">Tất cả</Option>
          <Option value="Consulted">Đã tư vấn</Option>
          <Option value="NotConsulted">Chưa tư vấn</Option>
        </Select>
        <Button
            type="primary"
            icon={<RocketOutlined />}
            // onClick={showModalCreateQuiz}
          >
            Tạo quản lý nhượng quyền
          </Button>
      </Space>
      <Table
          columns={columns}
          dataSource={franchiseConsult}
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

export default ConsultationManagement;

