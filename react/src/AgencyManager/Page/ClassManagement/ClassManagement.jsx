import { Table, Space, Button, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetClassesActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ClassManagement = () => {
    const { classes, totalPagesCount } = useSelector((state) => state.ClassReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(GetClassesActionAsync(pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize]);

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
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
            render: (status) => (
                <span style={{ color: status === "Active" ? "green" : "red" }}>
                    {status}
                </span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (id) => {
        // Thực hiện logic chỉnh sửa tại đây
        console.log("Edit class with id:", id);
    };

    const handleDelete = (id) => {
        // Thực hiện logic xóa tại đây
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
                />
            </div>
        </div>
    );
};

export default ClassManagement;
