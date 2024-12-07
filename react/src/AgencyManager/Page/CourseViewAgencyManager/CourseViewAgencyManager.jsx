
import React, { useEffect, useState } from "react";
import { Table, Input, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { GetCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../../Utils/LoadingContext";
import { RightCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CourseViewAgencyManager = () => {
    const { course, totalPagesCount } = useSelector((state) => state.CourseReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [searchTerm, setSearchTerm] = useState("");
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        dispatch(GetCourseActionAsync(searchTerm, "AvailableForFranchise", pageIndex, pageSize))
            .finally(() => setLoading(false));
    }, [searchTerm, pageIndex, pageSize]);

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    const handleColumnSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchTerm(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchTerm("");
    };

    const handleRowClick = (id) => {
        navigate(`/agency-manager/course-detail/${id}`);
    };

    const getColumnSearchProps = () => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Tìm tên khóa học`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleColumnSearch(selectedKeys, confirm)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Button
                    type="primary"
                    onClick={() => handleColumnSearch(selectedKeys, confirm)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Tìm kiếm
                </Button>
                <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Xóa lọc
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
    });

    const columns = [
        {
            title: "STT",
            dataIndex: "no",
            key: "no",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Tên môn học",
            dataIndex: "name",
            key: "name",
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
            ...getColumnSearchProps(),
        },
        {
            title: "Mã môn",
            dataIndex: "code",
            key: "code",
            align: "center",
        },
        {
            title: "Phiên bản",
            dataIndex: "version",
            key: "version",
            align: "center",
        },
        {
            title: "Số bài học",
            dataIndex: "numberOfLession",
            key: "numberOfLession",
            align: "center",
        },
        {
            title: "Giá ",
            dataIndex: "price",
            key: "price",
            align: "center",
            render: (price) => `${price.toLocaleString()} VND`,
        }
    ];

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title">Quản lý khóa học</h5>
                    </div>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={course}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: pageIndex,
                            pageSize,
                            total: totalPagesCount * pageSize,
                            onChange: handlePageChange,
                            showSizeChanger: true,
                            pageSizeOptions: ["7", "10"],
                        }}
                        scroll={{ x: 768 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseViewAgencyManager;