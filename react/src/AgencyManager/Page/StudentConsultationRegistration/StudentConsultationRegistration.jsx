import { Button, Select, Table, Input, Popconfirm, Space, Typography, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, UsergroupAddOutlined, CloseCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetStudentConsultationActionAsync, UpdateStudentStatusAsync, UpdateStudentRegistrationAsync } from "../../../Redux/ReducerAPI/RegisterCourseReducer";
import { GetAllCoursesAvailableActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import CreatePaymentCourseModal from "../../Modal/CreatePaymentCourseModal";
import { CreateStudentPaymentActionAsync } from "../../../Redux/ReducerAPI/PaymentReducer";
import AddToClassModal from "../../Modal/AddToClassModal";
import StudentRegistrationDetailsModal from "../../Modal/StudentRegistrationDetailsModal";

const { Text } = Typography;

const StudentConsultationRegistration = () => {
    const { studentConsultations, totalPagesCount } = useSelector(
        (state) => state.RegisterCourseReducer
    );
    const { course } = useSelector((state) => state.CourseReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size is 10
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudentStatus, setSelectedStudentStatus] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected rows
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRegisterCourseId, setSelectedRegisterCourseId] = useState(null);
    const [selectedCourseDetails, setselectedCourseDetails] = useState(null);
    const [isAddToClassModalVisible, setIsAddToClassModalVisible] = useState(false);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse))
            .finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize, selectedStudentStatus, selectedCourse]);

    useEffect(() => {
        dispatch(GetAllCoursesAvailableActionAsync());
        console.log("Get all courses available", course);
    }, [dispatch]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        const newCourse = filters.courseCode ? filters.courseCode[0] : null;
        // Reset selected rows if course filter changes
        if (newCourse !== selectedCourse) {
            setSelectedRowKeys([]); // Clear selected rows
        }
        setSelectedCourse(newCourse);
        setIsFilterApplied(!!newCourse);
        setSelectedStudentStatus(filters.studentStatus ? filters.studentStatus[0] : null);
        console.log(filters.studentStatus);
    };

    //handle edit
    const handleUpdate = () => {
        // Hiển thị modal với dữ liệu của slot đang chỉnh sửa
    };

    const handleDelete = (id) => {
    };

    // Row selection logic
    const onSelectChange = (newSelectedRowKeys) => {
        console.log("Selected rows:", selectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = isFilterApplied
        ? {
            selectedRowKeys,
            onChange: onSelectChange,
            preserveSelectedRowKeys: true, // Keep selected rows across pages
            getCheckboxProps: (record) => ({
                disabled: record.studentStatus !== 'Waitlisted', // Disable rows that are not "Waitlisted"
            }),
        } : null;

    const hasSelected = selectedRowKeys.length > 0;

    // Function to handle reload and reset selected rows
    const handleReload = () => {
        setLoading(true);
        setSelectedRowKeys([]); // Reset selected rows
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse))
            .finally(() => setLoading(false)); // Reload data
    };

    // Function
    const handleReloadTableAfterCreateClass = () => {
        setLoading(true);
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse))
            .finally(() => setLoading(false));
    };

    const studentStatusMapping = {
        NotConsult: 'Chưa tư vấn',
        Pending: 'Đang tư vấn',
        Waitlisted: 'Chờ xếp lớp',
        Enrolled: 'Đã vào lớp',
        Cancel: 'Đã hủy',
    };

    const paymentStatusMapping = {
        Pending_Payment: 'Chờ thanh toán',
        Advance_Payment: 'Đã đặt cọc',
        Completed: 'Đã hoàn thành',
        Late_Payment: 'Thanh toán trễ',
    };

    //render color 
    const renderStatusBadge = (status, type) => {
        const statusConfig = {
            NotConsult: {
                text: studentStatusMapping[status],
                color: 'gray',
                backgroundColor: '#f0f0f0',
                borderColor: '#d9d9d9'
            },
            Pending: {
                text: studentStatusMapping[status],
                color: 'orange',
                backgroundColor: '#fff7e6',
                borderColor: '#ffd591'
            },
            Waitlisted: {
                text: studentStatusMapping[status],
                color: '#3498db',
                backgroundColor: '#e6f7ff',
                borderColor: '#91d5ff'
            },
            Enrolled: {
                text: studentStatusMapping[status],
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Cancel: {
                text: studentStatusMapping[status],
                color: 'red',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            },
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

    // Function to display and handle payment course modal (waitlisted status)
    const handleWaitlistedClick = (id, courseCode, coursePrice, courseId) => {
        setSelectedRegisterCourseId(id);
        setPaymentModalVisible(true);
        setselectedCourseDetails({ courseCode, coursePrice, courseId });
        setIsDetailModalVisible(false); // Ensure detail modal is closed
    };

    const handlePaymentSubmit = (paymentData, paymentType) => {
        setLoading(true);
        console.log("Payment data:",
            paymentData);
        dispatch(CreateStudentPaymentActionAsync(paymentData, paymentType)).then(() => {
            dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
            setLoading(false);
            setPaymentModalVisible(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    // Function to handle status registration
    const renderActionButtons = (status, record) => {
        const handleUpdateStatus = (newStatus) => {
            dispatch(UpdateStudentStatusAsync(record.userId, newStatus, record.courseId))
                .then(() => {
                    dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
                })
                .catch((error) => {
                    console.error("Error updating student status:", error);
                    // Optionally, show an error message to the user
                });
        };

        const handleJoinClass = () => {
            setSelectedRowKeys([record.userId]);
            setIsAddToClassModalVisible(true);
        };

        const handleCancelRegistration = () => {
            dispatch(UpdateStudentStatusAsync(record.userId, 'Cancel', record.courseId))
                .then(() => {
                    dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
                });
        };

        switch (status) {
            case 'NotConsult':
                return (
                    <>
                        <Button onClick={() => handleUpdateStatus('Pending')} type="primary">Đang tư vấn</Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn hủy đăng ký này không?"
                            onConfirm={handleCancelRegistration}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button type="default" style={{ marginLeft: 8 }}>Hủy</Button>
                        </Popconfirm>
                    </>
                );

            case 'Pending':
                return (
                    <>
                        <Button onClick={() => handleWaitlistedClick(record.id, record.courseCode, record.coursePrice, record.courseId)} type="primary">Chờ xếp lớp</Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn hủy đăng ký này không?"
                            onConfirm={handleCancelRegistration}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button type="default" style={{ marginLeft: 8 }}>Hủy</Button>
                        </Popconfirm>
                    </>
                );

            case 'Waitlisted':
                return (
                    <>
                        <Button onClick={handleJoinClass} type="primary">Vào lớp</Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn hủy đăng ký này không?"
                            onConfirm={handleCancelRegistration}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button type="default" style={{ marginLeft: 8 }}>Hủy</Button>
                        </Popconfirm>
                    </>
                );

            default:
                return null;
        }
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

    const handleCompletePayment = (studentDetails) => {
        setSelectedRegisterCourseId(studentDetails.id);
        setPaymentModalVisible(true);
        setselectedCourseDetails({
            courseCode: studentDetails.courseCode,
            coursePrice: studentDetails.coursePrice,
            studentAmountPaid: studentDetails.studentAmountPaid,
            courseId: studentDetails.courseId
        });
        setIsDetailModalVisible(false); // Ensure detail modal is closed
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
            title: "Lịch học mong muốn",
            dataIndex: "dateTime",
            key: "preferredSchedule",
            align: "center",
        },
        {
            title: "Trạng thái thanh toán",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            align: "center",
            render: (text) => renderStatusBadge(text, 'payment'),
        },
        {
            title: "Trạng thái",
            dataIndex: "studentStatus",
            key: "studentStatus",
            align: "center",
            render: (text) => renderStatusBadge(text, 'student'),
            filters: [
                { text: 'Chưa tư vấn', value: 'NotConsult' },
                { text: 'Đang tư vấn', value: 'Pending' },
                { text: 'Chờ xếp lớp', value: 'Waitlisted' },
                { text: 'Đã vào lớp', value: 'Enrolled' },
                { text: 'Đã hủy', value: 'Cancel' },
            ],
            filterMultiple: false,
        },
        {
            title: "Chuyển trạng thái",
            dataIndex: "studentStatus",
            key: "action",
            render: (text, record) => renderActionButtons(text, record),
        }
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh Sách Học Sinh Đăng Ký Khóa Học</h5>
                <Space style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={() => setIsAddToClassModalVisible(true)}
                        disabled={!hasSelected}
                        icon={<UsergroupAddOutlined />}
                    >
                        Thêm vào lớp
                    </Button>
                    <Button
                        type="default"
                        variant="solid"
                        disabled={!hasSelected}
                        onClick={handleReload}
                        icon={<CloseCircleOutlined />}
                        style={{ marginLeft: 4 }}
                    >
                        Bỏ chọn
                    </Button>
                    <span style={{ marginLeft: 4, color: 'black' }}>
                        {hasSelected ? `Đã chọn ${selectedRowKeys.length} học sinh` : ''}
                    </span>
                </Space>
                <Spin spinning={loading}>
                    <Table
                        bordered
                        rowSelection={rowSelection}
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
                        loading={loading}
                    />
                </Spin>

                <CreatePaymentCourseModal
                    visible={isPaymentModalVisible}
                    onClose={() => setPaymentModalVisible(false)}
                    onSubmit={handlePaymentSubmit}
                    spinning={loading}
                    courseDetails={selectedCourseDetails}
                    registerCourseId={selectedRegisterCourseId}
                />

                <AddToClassModal
                    visible={isAddToClassModalVisible}
                    onClose={() => setIsAddToClassModalVisible(false)}
                    listStudents={selectedRowKeys} // Truyền danh sách học sinh đã chọn vào modal
                    courseId={selectedCourse}
                    onClassCreated={handleReloadTableAfterCreateClass} // Thêm dòng này
                />

                <StudentRegistrationDetailsModal
                    visible={isDetailModalVisible}
                    onClose={handleDetailModalClose}
                    studentDetails={selectedStudentDetails}
                    studentStatusMapping={studentStatusMapping}
                    paymentStatusMapping={paymentStatusMapping}
                    onUpdate={handleUpdateRegistrationDetails}
                    onCancelRegistration={handleCancelRegistration}
                    courses={course}
                    spinning={isEditing}
                    onCompletePayment={handleCompletePayment} // Add this line
                    paymentStatus={selectedStudentDetails?.paymentStatus} // Add this line
                />
            </div>
        </div>
    );
};

export default StudentConsultationRegistration;
