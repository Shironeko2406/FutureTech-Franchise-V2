import { DeleteOutlined, EditOutlined, GlobalOutlined } from "@ant-design/icons";
import { Card, Typography, Table, Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeletePackageActionAsync, GetPackageActionAsync } from "../../../Redux/ReducerAPI/PackageReducer";
import { useLoading } from "../../../Utils/LoadingContext";
import CreatePackageModal from "../../Modal/CreatePackageModal";
import EditPackageModal from "../../Modal/EditPackageModal";

const { Title, Text } = Typography;

const statusMapping = {
  Standard: "Tiêu chuẩn",
  Custom: "Nâng cấp",
};

const renderStatusBadge = (status) => {
  const statusConfig = {
    Standard: {
      text: statusMapping[status],
      color: "green",
      backgroundColor: "#f6ffed",
      borderColor: "#b7eb8f",
    },
    Custom: {
      text: statusMapping[status],
      color: "#3498db",
      backgroundColor: "#e6f7ff",
      borderColor: "#91d5ff",
    },
  };

  const config = statusConfig[status] || statusConfig.Standard;

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
      <Text strong style={{ color: config.color }}>
        {config.text}
      </Text>
    </div>
  );
};

const PackageFranchise = () => {
  const { packageTicket } = useSelector((state) => state.PackageReducer);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const [modalCreateVisible, setCreateModalVisible] = useState(false)
  const [modalEditVisible, setEditModalVisible] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState({})

  useEffect(() => {
    setLoading(true);
    dispatch(GetPackageActionAsync()).finally(() => setLoading(false));
  }, []);

  const openModalEdit = (packageFranchise) =>{
    setSelectedPackage(packageFranchise)
    setEditModalVisible(true)
  }

  const closeModalEdit = () =>{
    setSelectedPackage({})
    setEditModalVisible(false)
  }
  
  const handleDelete = async (id) =>{
    setLoading(true)
    await dispatch(DeletePackageActionAsync(id))
    setLoading(false)
  }

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      filterMode: "menu",
      filterSearch: true,
      filters: packageTicket.map((item) => ({
        text: item.name,
        value: item.name,
      })),
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN"),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Số lượng người dùng",
      dataIndex: "numberOfUsers",
      key: "numberOfUsers",
      render: (users) => users.toLocaleString("vi-VN"),
      sorter: (a, b) => a.numberOfUsers - b.numberOfUsers,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Tiêu chuẩn", value: "Standard" },
        { text: "Nâng cấp", value: "Custom" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => renderStatusBadge(text),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ backgroundColor: "#faad14", color: "#fff" }}
            type="default"
            icon={<EditOutlined />}
            onClick={() => openModalEdit(record)}
          />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>
        <GlobalOutlined /> Gói nhượng quyền
      </Title>
      <Button type="primary" className="mb-3" onClick={() => setCreateModalVisible(true)}>Tạo gỏi dịch vụ</Button>
      <Table
        columns={columns}
        dataSource={packageTicket}
        rowKey="name"
        pagination={{ pageSize: 5 }}
      />

      <CreatePackageModal
        visible={modalCreateVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      <EditPackageModal
        visible={modalEditVisible}
        onClose={closeModalEdit}
        packageFranchise={selectedPackage}
      />
    </Card>
  );
};

export default PackageFranchise;
