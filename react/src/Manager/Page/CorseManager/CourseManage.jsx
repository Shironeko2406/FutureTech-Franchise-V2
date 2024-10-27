import React, { useEffect, useState } from "react";
import { Button, Select, Table, Input, Dropdown, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetCourseActionAsync, UpdateStatusCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, PauseOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateCourseModal from "../../Modal/CreateCourseModal";
import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
import { NavLink } from "react-router-dom";

const statusItems = [
  { label: "Chờ duyệt", key: "PendingApproval", icon: <ClockCircleOutlined style={{ color: "orange" }} /> }, 
  { label: "Công khai", key: "AvailableForFranchise", icon: <CheckCircleOutlined style={{ color: "green" }} /> }, 
  { label: "Tạm đóng", key: "TemporarilySuspended", icon: <PauseOutlined style={{ color: "gray" }} /> }, 
  { label: "Đóng", key: "Closed", icon: <CloseCircleOutlined style={{ color: "red" }} /> }, 
];

const getStatusItems = (status) => {
  switch (status) {
    case "Draft":
      return statusItems.filter(item => item.key === "PendingApproval"); 
    case "PendingApproval":
      return statusItems.filter(item => ["AvailableForFranchise", "Closed"].includes(item.key)); 
    case "AvailableForFranchise":
      return statusItems.filter(item => ["TemporarilySuspended", "Closed"].includes(item.key)); 
    case "TemporarilySuspended":
      return statusItems.filter(item => ["AvailableForFranchise", "Closed"].includes(item.key)); 
    case "Closed":
      return []; 
    default:
      return statusItems;
  }
};


const CourseManage = () => {
  const { course, totalPagesCount } = useSelector(
    (state) => state.CourseReducer
  );
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Default page size is 10
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    dispatch(GetCourseActionAsync(searchTerm, status, pageIndex, pageSize));
    dispatch(GetCourseCategoryActionAsync());
  }, [status, pageIndex, pageSize, searchTerm]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setPageIndex(1);
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

  const handleMenuClick = (courseId, { key }) => {
    dispatch(UpdateStatusCourseActionAsync(courseId, key, searchTerm, status, pageIndex, pageSize))
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
          placeholder={`Tìm tên khóa học`}
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
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
      render: (text, record)=>(<NavLink to={`/manager/course-detail/${record.id}`}>{text}</NavLink>),
      ...getColumnSearchProps(), // Apply search props to the column
    },
    {
      title: "Mã môn",
      dataIndex: "code",
      key: "code",
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
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "";
        let text = "";
    
        switch (status) {
          case "Draft":
            color = "default";
            text = "Nháp";
            break;
          case "PendingApproval":
            color = "orange";
            text = "Chờ duyệt";
            break;
          case "AvailableForFranchise":
            color = "green";
            text = "Công khai";
            break;
          case "TemporarilySuspended":
            color = "red";
            text = "Tạm ngừng";
            break;
          case "Closed":
            color = "gray";
            text = "Đã đóng";
            break;
          default:
            color = "default";
            text = "Không xác định";
        }
    
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Dropdown.Button
            type="primary"
            menu={{
              items: getStatusItems(record.status),
              onClick: (key) => handleMenuClick(record.id, key),
            }}
          >
            Duyệt
          </Dropdown.Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">Quản lý khóa học</h5>
            <Select
              defaultValue={status}
              style={{ width: 150 }}
              onChange={handleStatusChange}
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="Draft">Nháp</Select.Option>
              <Select.Option value="PendingApproval">Chờ duyệt</Select.Option>
              <Select.Option value="AvailableForFranchise">
                Công khai
              </Select.Option>
              <Select.Option value="TemporarilySuspended">
                Tạm đóng
              </Select.Option>
              <Select.Option value="Closed">Đóng</Select.Option>
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
            scroll={{ x: 768 }}
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
      <CreateCourseModal
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

export default CourseManage;
