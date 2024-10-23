import { Button, Select, Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { GetStudentConsultationActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import { GetAllCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";

const StudentConsultationRegistration = () => {
    const { studentConsultations, totalPagesCount } = useSelector(
        (state) => state.ClassReducer
    );
    const { courseOptions } = useSelector((state) => state.CourseReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size is 7
    // const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        // Fetch data with search term, page index, and page size
        // dispatch(GetStudentConsultationActionAsync(searchTerm, pageIndex, pageSize));
        dispatch(GetStudentConsultationActionAsync(pageIndex, pageSize, selectedCourse));
        // }, [pageIndex, pageSize, searchTerm]);
    }, [pageIndex, pageSize, selectedCourse]);

    useEffect(() => {
        // Fetch the list of courses from CourseReducer to be used as filter options
        dispatch(GetAllCourseActionAsync());
    }, []);

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    const handleCourseFilter = (value) => {
        setSelectedCourse(value);
    };
    // const handleColumnSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setSearchTerm(selectedKeys[0]); // Trigger API search with entered keyword
    // };

    // const handleReset = (clearFilters) => {
    //     clearFilters();
    //     setSearchTerm(""); // Reset search term
    // };

    // const getColumnSearchProps = () => ({
    //     filterDropdown: ({
    //         setSelectedKeys,
    //         selectedKeys,
    //         confirm,
    //         clearFilters,
    //     }) => (
    //         <div style={{ padding: 8 }}>
    //             <Input
    //                 placeholder={`Search Student Name`}
    //                 value={selectedKeys[0]}
    //                 onChange={(e) =>
    //                     setSelectedKeys(e.target.value ? [e.target.value] : [])
    //                 }
    //                 onPressEnter={() => handleColumnSearch(selectedKeys, confirm)}
    //                 style={{ marginBottom: 8, display: "block" }}
    //             />
    //             <Button
    //                 type="primary"
    //                 onClick={() => handleColumnSearch(selectedKeys, confirm)}
    //                 icon={<SearchOutlined />}
    //                 size="small"
    //                 style={{ width: 90, marginRight: 8 }}
    //             >
    //                 Search
    //             </Button>
    //             <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
    //                 Reset
    //             </Button>
    //         </div>
    //     ),
    //     filterIcon: (filtered) => (
    //         <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    //     ),
    //     onFilter: (value, record) =>
    //         record.studentName.toString().toLowerCase().includes(value.toLowerCase()),
    // });

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Student Name",
            dataIndex: "studentName",
            key: "studentName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center",
        },
        {
            title: "Desired Course",
            dataIndex: "desiredCourse",
            key: "desiredCourse",
            align: "center",
            filters: courseOptions.map((course) => ({
                text: course.name,
                value: course.id,
            })),
            onFilter: (value) => handleCourseFilter(value),
        },
        {
            title: "Preferred Class Schedule",
            dataIndex: "preferredSchedule",
            key: "preferredSchedule",
            align: "center",
        },
        {
            title: "Consultation Date",
            dataIndex: "consultationDate",
            key: "consultationDate",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
        },
    ];

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Student Consultation Registration</h5>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={studentConsultations}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: pageIndex,
                            pageSize,
                            total: totalPagesCount * pageSize,
                            onChange: handlePageChange,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentConsultationRegistration;
