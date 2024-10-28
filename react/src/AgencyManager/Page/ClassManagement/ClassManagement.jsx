import { Button, Select, Table, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const ClassManagement = () => {
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Kích thước trang mặc định là 10
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        // Fetch data
    }, [pageIndex, pageSize, searchName, dispatch]);

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Tên học viên",
            dataIndex: "studentName",
            key: "studentName",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Số tiền (VNĐ)",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => amount.toLocaleString("vi-VN"), // Định dạng số tiền
        },
        {
            title: "Thời gian thanh toán",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (dateTime) => new Date(dateTime).toLocaleString("vi-VN"), // Định dạng ngày giờ
        },
    ];

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">Thông Tin Thanh Toán</h5>
                    <div style={{ marginBottom: 16 }}>
                        <span style={{ marginRight: 8 }}>Tìm kiếm:</span> {/* Thêm chữ "Search" */}
                        <Input
                            placeholder="Tìm kiếm tên học viên"
                            onChange={handleSearchChange}
                            style={{ width: 300 }}
                            suffix={<SearchOutlined />}
                        />
                    </div>
                    <Table
                        bordered
                        columns={columns}
                        // dataSource={paymentInfo}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: pageIndex,
                            pageSize,
                            // total: totalPagesCount * pageSize,
                            onChange: handlePageChange,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                        }}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
