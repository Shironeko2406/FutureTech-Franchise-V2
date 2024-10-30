import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Table,
  Input,
  Dropdown,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateCourseCloneByIdActionAsync,
  DeleteCourseByIdActionAsync,
  GetCourseActionAsync,
  UpdateStatusCourseActionAsync,
} from "../../../Redux/ReducerAPI/CourseReducer";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PauseOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CreateCourseModal from "../../Modal/CreateCourseModal";
import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
import { NavLink } from "react-router-dom";
import { useLoading } from "../../../Utils/LoadingContext";
import SendFileCourseDetailModal from "../../Modal/SendFileCourseDetailModal";

const statusItems = [
  {
    label: "Chờ duyệt",
    key: "PendingApproval",
    icon: <ClockCircleOutlined style={{ color: "orange" }} />,
  },
  {
    label: "Công khai",
    key: "AvailableForFranchise",
    icon: <CheckCircleOutlined style={{ color: "green" }} />,
  },
  {
    label: "Tạm đóng",
    key: "TemporarilySuspended",
    icon: <PauseOutlined style={{ color: "gray" }} />,
  },
  {
    label: "Đóng",
    key: "Closed",
    icon: <CloseCircleOutlined style={{ color: "red" }} />,
  },
];

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
  const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true); // Bật loading trước khi gọi API
    Promise.all([
      dispatch(GetCourseActionAsync(searchTerm, status, pageIndex, pageSize)),
      dispatch(GetCourseCategoryActionAsync()),
    ])
      .catch((error) => console.error(error))
      .finally(() => setLoading(false)); //
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

  const getStatusItems = (status) => {
    switch (status) {
      case "Draft":
        return statusItems.filter((item) => item.key === "PendingApproval");
      case "PendingApproval":
        return statusItems.filter((item) =>
          ["AvailableForFranchise", "Closed"].includes(item.key)
        );
      case "AvailableForFranchise":
        return statusItems.filter((item) =>
          ["TemporarilySuspended", "Closed"].includes(item.key)
        );
      case "TemporarilySuspended":
        return statusItems.filter((item) =>
          ["AvailableForFranchise", "Closed"].includes(item.key)
        );
      case "Closed":
        return [];
      default:
        return statusItems;
    }
  };

  const handleMenuClick = (courseId, { key }) => {
    setLoading(true); // Bật loading
    dispatch(
      UpdateStatusCourseActionAsync(
        courseId,
        key,
        searchTerm,
        status,
        pageIndex,
        pageSize
      )
    )
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleClone = async (id) => {
    setLoading(true);
    try {
      await dispatch(
        CreateCourseCloneByIdActionAsync(
          id,
          status,
          pageIndex,
          pageSize,
          searchTerm
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourseById = async (id) => {
    setLoading(true);
    try {
      await dispatch(
        DeleteCourseByIdActionAsync(id, status, pageIndex, pageSize, searchTerm)
      );
    } finally {
      setLoading(false);
    }
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

  const showModalUpload = () => {
    setIsModalUploadVisible(true);
  };

  const closeModalUpload = () => {
    setIsModalUploadVisible(false);
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
      render: (text, record) => (
        <NavLink to={`/manager/course-detail/${record.id}`}>{text}</NavLink>
      ),
      ...getColumnSearchProps(), // Apply search props to the column
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
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <Space>
            <Dropdown.Button
              type="primary"
              menu={{
                items: getStatusItems(record.status),
                onClick: (key) => handleMenuClick(record.id, key),
              }}
            >
              Duyệt
            </Dropdown.Button>
            <Button
              type="default"
              icon={<EditOutlined />}
              style={{ backgroundColor: "#faad14", color: "#fff" }} // Warning color
            ></Button>

            <Popconfirm
              title="Bạn muốn xóa khóa học này?" 
              onConfirm={() => handleDeleteCourseById(record.id)} 
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>

            {record.status === "TemporarilySuspended" && ( // Chỉ hiển thị nút tạo bản sao nếu trạng thái là TemporarilySuspended
              <Popconfirm
                title="Bạn có muốn tạo bản sao khóa học?" 
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type="default" 
                  icon={<CopyOutlined />} 
                ></Button>
              </Popconfirm>
            )}
          </Space>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            <h5 className="card-title mb-2 mb-md-0">Quản lý khóa học</h5>
            <div className="d-flex align-items-center flex-wrap">
              <Button
                type="primary"
                icon={<UploadOutlined />}
                className="me-2 mb-2 mb-md-0"
                onClick={showModalUpload}
              >
                Thêm File
              </Button>

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
      <SendFileCourseDetailModal
        visible={isModalUploadVisible}
        onClose={closeModalUpload}
        status={status}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchTerm={searchTerm}
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
