import React, { useEffect, useState } from "react";
import { Button, Select, Table, Input, Dropdown, Tag, Popconfirm, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CreateCourseCloneByIdActionAsync, DeleteCourseByIdActionAsync, GetCourseActionAsync, UpdateStatusCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { BookOutlined, ClockCircleOutlined, CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import CreateCourseModal from "../../Modal/CreateCourseModal";
import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
import { NavLink } from "react-router-dom";
import { useLoading } from "../../../Utils/LoadingContext";
import SendFileCourseDetailModal from "../../Modal/SendFileCourseDetailModal";
import EditCourseModal from "../../Modal/EditCourseModal";


const statusItems = [
  {
    label: "Chờ duyệt",
    key: "PendingApproval",
    icon: <ClockCircleOutlined style={{ color: "orange" }} />,
  },
];

const CourseSystemInstructor = () => {
  const { course, totalPagesCount } = useSelector(
    (state) => state.CourseReducer
  );
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Default page size is 10
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  const handleStatusFilter = (value) => {
    setStatus(value);
    setPageIndex(1); // Reset page index when filter is applied
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
    return status === "Draft" ? statusItems : [];
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

  const showModalEdit = (course) => {
    setIsModalEditVisible(true);
    setSelectedCourse(course)
  };

  const closeModalEdit = () => {
    setIsModalEditVisible(false);
    setSelectedCourse(null)
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
        <NavLink to={`/system-instructor/course-detail/${record.id}`}>
          {text}
        </NavLink>
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
      render: (version, record) => {
        if (["Draft", "PendingApproval"].includes(record.status)) {
          return (
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "6px",
                backgroundColor: "rgba(200, 200, 200, 0.5)", // Màu nền đục như sương mù
                border: "1px solid rgba(180, 180, 180, 0.3)", // Màu viền nhẹ để hài hòa
              }}
            />
          );
        }
        return version;
      },
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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, minWidth: 240 }}>
          <Space>
            <Select
              style={{ width: 160 }}
              onChange={(value) => {
                setSelectedKeys([value]);
                confirm();
                handleStatusFilter(value);
              }}
              value={status}
              options={[
                {value: "", label: 'Tất cả'},
                {value: "Draft", label: 'Nháp'},
                {value: "PendingApproval", label: 'Chờ duyệt'},
                {value: "AvailableForFranchise", label: 'Công khai'},
                {value: "TemporarilySuspended", label: 'Tạm ngừng'},
                {value: "Closed", label: 'Đã đóng'},
              ]}
            />
            <Button
              type="link"
              size="small"
              style={{ width: '100%' }}
              onClick={() => {
                clearFilters();
                handleStatusFilter("");
              }}
            >
              Bỏ lọc
            </Button>
          </Space>
        </div>
      ),
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
            {record.status === "Draft" && (
              <>
                <Dropdown
                  type="primary"
                  menu={{
                    items: getStatusItems(record.status),
                    onClick: (key) => handleMenuClick(record.id, key),
                  }}
                >
                  <Button
                    type="primary"
                    icon={<EllipsisOutlined />}
                    style={{ backgroundColor: "#50e3c2", color: "#0A5A5A" }}
                  />
                </Dropdown>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{ backgroundColor: "#faad14", color: "#fff" }}
                  onClick={() => showModalEdit(record)}
                />
                <Popconfirm
                  title="Bạn muốn xóa khóa học này?"
                  onConfirm={() => handleDeleteCourseById(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </>
            )}

            {["AvailableForFranchise", "TemporarilySuspended", "Closed"].includes(record.status) && (
              <Popconfirm
                title="Bạn có muốn tạo bản sao khóa học?"
                onConfirm={() => handleClone(record.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button type="default" icon={<CopyOutlined />}></Button>
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
          <h5 className="card-title mb-3">Quản lý khóa học</h5>
          <Space style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<BookOutlined />}
                onClick={showDrawer}
              >
                Thêm khóa học
              </Button>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                className="me-2 mb-2 mb-md-0"
                onClick={showModalUpload}
              >
                Thêm File
              </Button>
          </Space>

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
      
      {/* Modal */}

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

      <EditCourseModal
        visible={isModalEditVisible}
        onClose={closeModalEdit}
        selectedCourse={selectedCourse}
        status={status}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default CourseSystemInstructor;
