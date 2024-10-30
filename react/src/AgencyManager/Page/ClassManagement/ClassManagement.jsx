import { Table, Space, Button, Popconfirm, Badge, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetClassesActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import { DeleteOutlined, EditOutlined, RightCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ClassManagement = () => {
    const { classes, totalPagesCount } = useSelector((state) => state.ClassReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        dispatch(GetClassesActionAsync(pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize]);

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            Active: {
                status: 'success',
                text: 'Hoạt động',
                color: '#52c41a'
            },
            Inactive: {
                status: 'error',
                text: 'Không hoạt động',
                color: '#ff4d4f'
            }
        };

        const config = statusConfig[status] || statusConfig.Inactive;

        return (
            <Badge
                status={config.status}
                text={
                    <Text style={{ color: config.color }}>
                        {config.text}
                    </Text>
                }
            />
        );
    };

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            align: "center",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Tên lớp",
            dataIndex: "name",
            key: "name",
            align: "center",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleRowClick(record.id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        height: 'auto',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                    }}
                    className="hover:bg-blue-50"
                >
                    <Text strong style={{ marginRight: '4px' }}>{text}</Text>
                    <RightCircleOutlined style={{ fontSize: '16px' }} />
                </Button>
            ),
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            key: "capacity",
            align: "center",
        },
        {
            title: "SL hiện tại",
            dataIndex: "currentEnrollment",
            key: "currentEnrollment",
            align: "center",
            render: (text, record) => (
                <Text
                    style={{
                        color: record.currentEnrollment >= record.capacity ? '#ff4d4f' : '#52c41a'
                    }}
                    strong
                >
                    {text}
                </Text>
            ),
        },
        {
            title: "Tên khóa",
            dataIndex: "courseName",
            key: "courseName",
            align: "center",
        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: getStatusBadge,
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record.id)}
                        style={{
                            color: '#1890ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (id) => {
        console.log("Edit class with id:", id);
    };

    const handleDelete = (id) => {
        console.log("Delete class with id:", id);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh Sách Lớp Học</h5>
                <Table
                    bordered
                    columns={columns}
                    dataSource={classes}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                />
            </div>
        </div>
    );
};

export default ClassManagement;