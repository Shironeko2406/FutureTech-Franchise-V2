import { Button, Select, Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { GetStudentConsultationActionAsync } from "../../../Redux/ReducerAPI/RegisterCourseReducer";
import { GetAllCoursesAvailableActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";


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
    };

    // Row selection logic
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        console.log("Selected rows:", selectedRowKeys);
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
            title: "Email",
            dataIndex: "email",
            key: "email",
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
            ],
            filterMultiple: false,
        },
        // {
        //     title: "Consultation Date",
        //     dataIndex: "consultationDate",
        //     key: "consultationDate",
        //     align: "center",
        // },
        {
            title: "Action 1",
            dataIndex: "action",
            key: "action",
            fixed: 'right',
        },
        {
            title: "Action 2",
            dataIndex: "operation",
            key: "operation",
            fixed: 'right', // Cố định cột ở bên phải
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
        </div>
    );
};

export default StudentConsultationRegistration;
