import { Button, Select, Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
import CreateCourseModalAdmin from "../../Modal/CreateCourseModalAdmin";

const CourseManageAdmin = () => {
  const { course, totalPagesCount } = useSelector(
    (state) => state.CourseReducer
  );
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Draft");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Default page size is 10
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [searchedText, setSearchedText] = useState(""); // Text to search in the column
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    dispatch(GetCourseActionAsync(searchTerm, status, pageIndex, pageSize));
    dispatch(GetCourseCategoryActionAsync());
  }, [status, pageIndex, pageSize, searchTerm]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setPageIndex(1); // Reset page to 1 when status changes
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  // Function to handle searching within the column
  const handleColumnSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchTerm(selectedKeys[0]); // Trigger API search with the entered keyword
  };

  // Function to reset the search filter
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchTerm(""); // Reset search term
  };

  const getColumnSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search Course Name`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
    },
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps(), // Apply search props to the column
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Number of Lessons",
      dataIndex: "numberOfLession",
      key: "numberOfLession",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            className="me-2"
            onClick={() => handleApproveCourse(record.id)}
          >
            Approve
          </Button>
          <Button type="danger" onClick={() => handleRejectCourse(record.id)}>
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">Course Management</h5>
            <Select
              defaultValue={status}
              style={{ width: 150 }}
              onChange={handleStatusChange}
            >
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="PendingApproval">
                PendingApproval
              </Select.Option>
              {/* Add more options as needed */}
            </Select>
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
              pageSizeOptions: ["10", "20", "50"],
            }}
          />
        </div>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        onClick={showDrawer}
        style={{
          position: "fixed",
          bottom: 50,
          right: 30,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      />
      <CreateCourseModalAdmin
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
        status={status}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default CourseManageAdmin;
