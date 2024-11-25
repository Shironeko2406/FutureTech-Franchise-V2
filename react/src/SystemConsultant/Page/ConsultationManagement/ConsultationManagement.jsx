import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFranchiseRegistrationConsultActionAsync,
  UpdateFranchiseRegistrationConsultActionAsync,
} from "../../../Redux/ReducerAPI/ConsultationReducer";
import { Table, Select, Modal, Button, Space, Card, Typography, Dropdown, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined, ReconciliationOutlined, RocketOutlined } from "@ant-design/icons";
import { GetCityDataActionAsync } from "../../../Redux/ReducerAPI/CityReducer";
import CreateAgencyModal from "../../Modal/CreateAgencyModal";

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
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [createAgencyModalVisible, setCreateAgencyModalVisible] = useState(false);

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
    dispatch(GetCityDataActionAsync())
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

  //Hàm đóng mở modal
  const showModalCreateAgency = (consult) => {
    setCreateAgencyModalVisible(true)
    setSelectedConsult(consult)
  }
  const handleModalCreateAgencyCancel = () => {
    setCreateAgencyModalVisible(false)
    setSelectedConsult(null)
  }
  //--------------------

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
          {record.status === 'Consulted' && (
            <Tooltip title="Tạo đối tác">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModalCreateAgency(record)}
                style={{ backgroundColor: "#1890ff", border: "none" }}
              />
            </Tooltip>
          )}
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

        {/*Modal*/}
        <CreateAgencyModal
          visible={createAgencyModalVisible}
          onClose={handleModalCreateAgencyCancel}
          consult={selectedConsult}
        />
    </Card>
  );
};

export default ConsultationManagement;

