import { Table, Input, Space, Typography, Button, Tooltip, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAdminAccountsActionAsync, ToggleAccountStatusByAdminActionAsync, CreateAccountByAdminActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
import { SearchOutlined, PlusOutlined, EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { useLoading } from "../../../Utils/LoadingContext";
import CreateAccountModal from "../../Modal/CreateAccountModal";
import EditUserModal from "../../Modal/EditUserModal";

const { Text } = Typography;

const AccountManagement = () => {
    const { accounts, totalPagesCount, totalItemsCount } = useSelector((state) => state.UserReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState(null);
    const [role, setRole] = useState(null);
    const { setLoading } = useLoading();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const agencyId = null; // Example AgencyId

    useEffect(() => {
        setLoading(true);
        dispatch(GetAdminAccountsActionAsync(search, isActive, agencyId, role, pageIndex, pageSize))
            .finally(() => setLoading(false));
    }, [dispatch, search, isActive, role, pageIndex, pageSize, setLoading]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setIsActive(filters.isActive ? filters.isActive[0] : null);
        setRole(filters.role ? filters.role[0] : null);
    };

    const handleToggleStatus = async (id) => {
        setLoading(true);
        const success = await dispatch(ToggleAccountStatusByAdminActionAsync(id));
        if (success) {
            dispatch(GetAdminAccountsActionAsync(search, isActive, agencyId, role, pageIndex, pageSize));
        }
        setLoading(false);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    };

    const handleEditModalClose = (updated) => {
        setEditModalVisible(false);
        setSelectedUser(null);
        if (updated) {
            dispatch(GetAdminAccountsActionAsync(search, isActive, agencyId, role, pageIndex, pageSize));
        }
    };

    const renderStatusBadge = (lockoutEnd) => {
        const isLocked = lockoutEnd !== null;
        const statusConfig = {
            Active: {
                text: 'Hoạt động',
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Locked: {
                text: 'Đã khóa',
                color: 'red',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            }
        };

        const config = isLocked ? statusConfig.Locked : statusConfig.Active;

        return (
            <div
                style={{
                    display: 'inline-block',
                    padding: '3px 10px',
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

    const renderRoleBadge = (role) => {
        const roleLabels = {
            Student: {
                text: "Học sinh",
                color: "blue",
                backgroundColor: "#e6f7ff",
                borderColor: "#91d5ff",
            },
            Instructor: {
                text: "Giảng viên chi nhánh",
                color: "purple",
                backgroundColor: "#f9f0ff",
                borderColor: "#d3adf7",
            },
            SystemInstructor: {
                text: "Giảng viên trung tâm",
                color: "purple",
                backgroundColor: "#f9f0ff",
                borderColor: "#d3adf7",
            },
            SystemConsultant: {
                text: "Tư vấn viên",
                color: "cyan",
                backgroundColor: "#e6fffb",
                borderColor: "#87e8de",
            },
            SystemTechnician: {
                text: "Kỹ thuật viên",
                color: "geekblue",
                backgroundColor: "#f0f5ff",
                borderColor: "#adc6ff",
            },
            AgencyStaff: {
                text: "Nhân viên chi nhánh",
                color: "orange",
                backgroundColor: "#fff7e6",
                borderColor: "#ffd591",
            },
            Administrator: {
                text: "Quản trị viên",
                color: "red",
                backgroundColor: "#fff1f0",
                borderColor: "#ffa39e",
            },
            Manager: {
                text: "Quản lý hệ thống",
                color: "green",
                backgroundColor: "#f6ffed",
                borderColor: "#b7eb8f",
            },
            AgencyManager: {
                text: "Quản lý chi nhánh",
                color: "gold",
                backgroundColor: "#fffbe6",
                borderColor: "#ffe58f",
            }
        };
        const config = roleLabels[role];
        return (
            <div
                style={{
                    display: 'inline-block',
                    padding: '3px 10px',
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

    const columns = [
        {
            title: "Tên người dùng",
            dataIndex: "fullName",
            key: "fullName",
            align: "center",
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "userName",
            key: "userName",
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            align: "center",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center",
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            align: "center",
            filters: [
                { text: 'Học sinh', value: 'Student' },
                { text: 'Giảng viên chi nhánh', value: 'Instructor' },
                { text: 'Giảng viên trung tâm', value: 'SystemInstructor' },
                { text: 'Tư vấn viên', value: 'SystemConsultant' },
                { text: 'Kỹ thuật viên', value: 'SystemTechician' },
                { text: 'Nhân viên chi nhánh', value: 'AgencyStaff' },
                { text: 'Quản trị viên', value: 'Administrator' },
                { text: 'Quản lý hệ thống', value: 'Manager' },
                { text: 'Quản lý chi nhánh', value: 'AgencyManager' },
            ],
            filterMultiple: false,
            render: (text) => renderRoleBadge(text),
        },
        {
            title: "Trạng thái",
            dataIndex: "lockoutEnd",
            key: "lockoutEnd",
            align: "center",
            filters: [
                { text: 'Hoạt động', value: 'Active' },
                { text: 'Đã khóa', value: 'Inactive' },
            ],
            filterMultiple: false,
            render: (text) => renderStatusBadge(text),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createAt",
            key: "createAt",
            align: "center",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            style={{ backgroundColor: "#faad14", color: "#fff" }}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title={record.lockoutEnd ? "Mở khóa tài khoản" : "Khóa tài khoản"}>
                        <Button
                            type="default"
                            icon={record.lockoutEnd ? <UnlockOutlined /> : <LockOutlined />}
                            style={{
                                backgroundColor: record.lockoutEnd ? "#52c41a" : "#ff4d4f",
                                color: "#fff",
                            }}
                            onClick={() => handleToggleStatus(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleCreateAccount = async (accountData) => {
        const success = await dispatch(CreateAccountByAdminActionAsync(accountData));
        if (success) {
            dispatch(GetAdminAccountsActionAsync(search, isActive, agencyId, role, pageIndex, pageSize));
        }
        return success;
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Quản Lý Tài Khoản</h5>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <Space>
                        <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                        <Input.Search
                            placeholder="Nhập tên đăng nhập, số điện thoại hoặc email"
                            onSearch={handleSearch}
                            style={{ width: 360 }}
                            enterButton={<SearchOutlined />}
                        />
                    </Space>
                    <Button type="primary" onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                        Tạo tài khoản
                    </Button>
                </div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={accounts}
                    rowKey={(record) => record.id}
                    pagination={{
                        showTotal: () => `Tổng số người dùng: ${totalItemsCount}`,
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content' }}
                />
                <CreateAccountModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSubmit={handleCreateAccount}
                    isAgencyManagement={false}
                />
                <EditUserModal
                    visible={editModalVisible}
                    onClose={handleEditModalClose}
                    user={selectedUser}
                />
            </div>
        </div>
    );
};

export default AccountManagement;