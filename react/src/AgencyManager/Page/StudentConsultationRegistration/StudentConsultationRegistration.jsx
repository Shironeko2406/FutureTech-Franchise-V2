import React, { useEffect, useState } from "react";
import { Button, Table, Space, Typography, Spin, Input } from "antd";
import { SearchOutlined, RightCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetStudentConsultationActionAsync, UpdateStudentStatusAsync, UpdateStudentRegistrationAsync } from "../../../Redux/ReducerAPI/RegisterCourseReducer";
import { GetAllCoursesAvailableActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import StudentRegistrationDetailsModal from "../../Modal/StudentRegistrationDetailsModal";
import RefundModal from "../../Modal/RefundModal";
import moment from 'moment';
import { useLoading } from "../../../Utils/LoadingContext";

const { Text } = Typography;

const StudentConsultationRegistration = () => {
    const { studentConsultations, totalPagesCount } = useSelector(
        (state) => state.RegisterCourseReducer
    );
    const { course } = useSelector((state) => state.CourseReducer);
    const dispatch = useDispatch();
    const { setLoading } = useLoading();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size is 10
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudentStatus, setSelectedStudentStatus] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse, sortOrder, searchInput))
            .finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize, selectedStudentStatus, selectedCourse, sortOrder, searchInput, setLoading]);

    useEffect(() => {
        dispatch(GetAllCoursesAvailableActionAsync());
        console.log("Get all courses available", course);
    }, [dispatch]);

    const handleTableChange = (pagination, filters, sorter) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        const newCourse = filters.courseCode ? filters.courseCode[0] : null;
        setSelectedCourse(newCourse);
        setSelectedStudentStatus(filters.studentStatus ? filters.studentStatus[0] : null);
        setSortOrder(sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null);
        console.log(filters.studentStatus);
    };

    const paymentStatusMapping = {
        Pending_Payment: 'Chờ thanh toán',
        Advance_Payment: 'Đã đặt cọc',
        Completed: 'Đã hoàn thành',
        Late_Payment: 'Thanh toán trễ',
    };

    //render color 
    const renderStatusBadge = (status) => {
        const statusConfig = {
            Pending_Payment: {
                text: paymentStatusMapping[status],
                color: 'orange',
                backgroundColor: '#fff7e6',
                borderColor: '#ffd591'
            },
            Advance_Payment: {
                text: paymentStatusMapping[status],
                color: '#3498db',
                backgroundColor: '#e6f7ff',
                borderColor: '#91d5ff'
            },
            Completed: {
                text: paymentStatusMapping[status],
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Late_Payment: {
                text: paymentStatusMapping[status],
                color: 'red',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            }
        };

        const config = statusConfig[status] || statusConfig.NotConsult;

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

    const handleRowClick = (record) => {
        setSelectedStudentDetails(record);
        setIsDetailModalVisible(true);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false);
        setSelectedStudentDetails(null);
    };

    // Function handle update registration
    const handleUpdateRegistrationDetails = (updatedDetails) => {
        setIsEditing(true);
        dispatch(UpdateStudentRegistrationAsync(selectedStudentDetails.id, updatedDetails))
            .then(() => {
                dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
            })
            .finally(() => {
                setIsEditing(false);
                setIsDetailModalVisible(false);
            });
    };

    // Function handle cancel registration
    const handleCancelRegistration = () => {
        dispatch(UpdateStudentStatusAsync(selectedStudentDetails.userId, 'Cancel', selectedStudentDetails.courseId))
            .then(() => {
                dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
            })
            .finally(() => {
                setIsDetailModalVisible(false);
            });
    };

    // Function translate class schedule to Vietnamese
    const translateDayOfWeek = (dayOfWeekString) => {
        const dayTranslation = {
            Monday: "Thứ Hai",
            Tuesday: "Thứ Ba",
            Wednesday: "Thứ Tư",
            Thursday: "Thứ Năm",
            Friday: "Thứ Sáu",
            Saturday: "Thứ Bảy",
            Sunday: "Chủ Nhật",
        };

        const [days, startTime, endTime] = dayOfWeekString.split("-");

        const translatedDays = days
            .split(", ")
            .map((day) => day.trim())
            .map((day) => dayTranslation[day] || day)
            .join(", ");

        return `${translatedDays} - ${startTime} đến ${endTime}`;
    };

    const handleSearch = (value) => {
        setSearchInput(value);
    };

    const handleRefund = (refundData) => {
        // Implement the refund logic here
        console.log("Refund data: ", refundData);
    };

    const handleRefundClick = (record) => {
        setSelectedStudentDetails(record);
        setIsRefundModalVisible(true);
    };

    const handleRefundModalClose = () => {
        setIsRefundModalVisible(false);
        setSelectedStudentDetails(null);
    };

    const columns = [
        {
            title: "Tên học viên",
            dataIndex: "fullName",
            key: "fullName",
            align: "center",
            fixed: 'left',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleRowClick(record)}
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
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center",
            fixed: 'left',
        },
        {
            title: "Khóa học",
            dataIndex: "courseCode",
            key: "courseCode",
            align: "center",
            filterSearch: true,
            filters: course.map((course) => ({
                text: course.code,
                value: course.id,
            })),
            filterMultiple: false,
        },
        {
            title: "Lịch học",
            dataIndex: "classSchedule",
            key: "classSchedule",
            align: "center",
            render: (text) => translateDayOfWeek(text),
        },
        {
            title: "Trạng thái thanh toán",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            align: "center",
            render: (text) => renderStatusBadge(text, 'payment'),
        },
        {
            title: "Ngày đăng ký",
            dataIndex: "creationDate",
            key: "creationDate",
            align: "center",
            sorter: true,
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: "Thao tác",
            dataIndex: "studentStatus",
            key: "action",
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={() => handleRefundClick(record)}
                >
                    Hoàn tiền
                </Button>
            ),
        }
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh Sách Học Sinh Đăng Ký Khóa Học</h5>
                <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Space>
                            <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                            <Input.Search
                                placeholder="Nhập tên học viên hoặc số điện thoại"
                                onSearch={handleSearch}
                                style={{ width: 360 }}
                                enterButton={<SearchOutlined />}
                            />
                        </Space>
                    </div>
                </Space>
                <Table
                    bordered
                    columns={columns}
                    dataSource={studentConsultations}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    scroll={{ x: 'max-content' }}
                    onChange={handleTableChange}
                />

                <StudentRegistrationDetailsModal
                    visible={isDetailModalVisible}
                    onClose={handleDetailModalClose}
                    studentDetails={selectedStudentDetails}
                    paymentStatusMapping={paymentStatusMapping}
                    onUpdate={handleUpdateRegistrationDetails}
                    onCancelRegistration={handleCancelRegistration}
                    spinning={isEditing}
                    paymentStatus={selectedStudentDetails?.paymentStatus}
                />

                <RefundModal
                    visible={isRefundModalVisible}
                    onClose={handleRefundModalClose}
                    onRefund={handleRefund}
                />
            </div>
        </div>
    );
};

export default StudentConsultationRegistration;