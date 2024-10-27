import { Button, Select, Table, Input, Popconfirm, Space } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetStudentConsultationActionAsync, UpdateStudentStatusAsync } from "../../../Redux/ReducerAPI/RegisterCourseReducer";
import { GetAllCoursesAvailableActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import CreatePaymentCourseModal from "../../Modal/CreatePaymentCourseModal"
import { CreateStudentPaymentActionAsync } from "../../../Redux/ReducerAPI/PaymentReducer";


const StudentConsultationRegistration = () => {
    const { studentConsultations, totalPagesCount } = useSelector(
        (state) => state.RegisterCourseReducer
    );
    const { course } = useSelector((state) => state.CourseReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(3); // Default page size is 10
    // const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudentStatus, setSelectedStudentStatus] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected rows
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedCourseDetails, setselectedCourseDetails] = useState(null);


    useEffect(() => {
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
    }, [dispatch, pageIndex, pageSize, selectedStudentStatus, selectedCourse]);

    useEffect(() => {
        dispatch(GetAllCoursesAvailableActionAsync());
    }, [dispatch]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setSelectedCourse(filters.courseName ? filters.courseName[0] : null);
        setSelectedStudentStatus(filters.studentStatus ? filters.studentStatus[0] : null);
        console.log(filters.studentStatus)
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
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true, // Keep selected rows across pages
    };

    const hasSelected = selectedRowKeys.length > 0;

    // Function to handle reload and reset selected rows
    const handleReload = () => {
        setSelectedRowKeys([]); // Reset selected rows
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse)); // Reload data
    };

    //render color 
    const renderStatusBadge = (status) => {
        let color;
        switch (status) {
            case 'NotConsult':
                color = 'gray';
                break;
            case 'Pending':
                color = 'orange';
                break;
            case 'Waitlisted':
                color = '#3498db';
                break;
            case 'Cancel':
                color = 'red';
                break;
            default:
                color = 'White';
        }

        return (
            <span
                style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: color,
                    color: 'white',
                }}
            >
                {status}
            </span>
        );
    };

    // Function to display and handle payment course modal (waitlisted status)
    const handleWaitlistedClick = (userId, courseName, coursePrice) => {
        setSelectedUserId(userId);
        setPaymentModalVisible(true);
        setselectedCourseDetails({ courseName, coursePrice });
    };

    const handlePaymentSubmit = (paymentData) => {
        setLoading(true);
        console.log("Payment data:", paymentData);
        dispatch(CreateStudentPaymentActionAsync(paymentData)).then(() => {
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
            dispatch(UpdateStudentStatusAsync(record.id, newStatus))
                .then(() => {
                    dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedStudentStatus, selectedCourse));
                })
                .catch((error) => {
                    console.error("Error updating student status:", error);
                    // Optionally, show an error message to the user
                });
        };

        const handleJoinClass = () => {
            // Logic to handle joining the class (you'll need to dispatch an action)
            console.log(`Joining class for ${record.fullName}`);
            // Dispatch your action here
        };

        switch (status) {
            case 'NotConsult':
                return (
                    <>
                        <Button onClick={() => handleUpdateStatus('Pending')} type="primary">Pending</Button>
                        <Button onClick={() => handleUpdateStatus('Cancel')} type="default" style={{ marginLeft: 8 }}>Cancel</Button>
                    </>
                );

            case 'Pending':
                return (
                    <>
                        <Button onClick={() => handleWaitlistedClick(record.id, record.courseName, record.coursePrice)} type="primary">Waitlisted</Button>
                        <Button onClick={() => handleUpdateStatus('Cancel')} type="default" style={{ marginLeft: 8 }}>Cancel</Button>
                    </>
                );

            case 'Waitlisted':
                return (
                    <Button onClick={handleJoinClass} type="primary">Join Class</Button>
                );

            default:
                return null; // No action buttons for other statuses
        }
    };

    // Function to render action2 buttons
    const renderAction2Buttons = (record, handleUpdate, handleDelete) => {
        return (
            <Space size="middle">
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleUpdate(record)} // Sửa thông tin slot
                />
                <Popconfirm
                    title="Xác nhận xóa slot này?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button type="link" icon={<DeleteOutlined />} danger />
                </Popconfirm>
            </Space>
        );
    };
    const columns = [
        // {
        //     title: "No",
        //     dataIndex: "no",
        //     key: "no",
        //     align: "center",
        //     fixed: 'left',
        //     render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        // },
        {
            title: "Tên học viên",
            dataIndex: "fullName",
            key: "fullName",
            align: "center",
            fixed: 'left',
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
            dataIndex: "courseName",
            key: "courseName",
            align: "center",
            filterSearch: true,
            filters: course.map((course) => ({
                text: course.name,
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
            title: "Trạng thái",
            dataIndex: "studentStatus",
            key: "studentStatus",
            align: "center",
            render: renderStatusBadge,
            filters: [
                {
                    text: 'NotConsult',
                    value: 'NotConsult',
                },
                {
                    text: 'Pending',
                    value: 'Pending',
                },
                {
                    text: 'WaitListed',
                    value: 'Waitlisted',
                },
                {
                    text: 'Cancel',
                    value: 'Cancel',
                },
            ],
            filterMultiple: false,
        },
        {
            title: "Ngày đăng ký",
            dataIndex: "registerDate",
            key: "registerDate",
            align: "center",
            render: (registerDate) => {
                const date = new Date(registerDate);
                return date.toLocaleDateString("vi-VN");
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Action 1",
            dataIndex: "studentStatus",
            key: "action",
            render: (text, record) => renderActionButtons(text, record),
            fixed: 'right',
        },
        {
            title: "Action 2",
            dataIndex: "operation",
            key: "operation",
            fixed: 'right',
            render: (text, record) => renderAction2Buttons(record, handleUpdate, handleDelete),
        },
    ];

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">Danh Sách Học Sinh Đăng Ký Khóa Học</h5>
                    <Button
                        className="mb-3"
                        type="primary"
                        disabled={!hasSelected}
                        onClick={handleReload}
                    >
                        Reload
                    </Button>
                    {hasSelected && (
                        <span style={{ marginLeft: 8, color: 'black' }}>
                            {`Selected ${selectedRowKeys.length} items`}
                        </span>
                    )}
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
                    />
                </div>
            </div>
            <CreatePaymentCourseModal
                visible={isPaymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                onSubmit={handlePaymentSubmit}
                userId={selectedUserId}
                spinning={loading}
                courseDetails={selectedCourseDetails}
            />
        </div>
    );
};

export default StudentConsultationRegistration;
