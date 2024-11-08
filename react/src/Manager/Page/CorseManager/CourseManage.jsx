import React, { useEffect, useState } from "react";
import { Button, Select, Table, Input, Dropdown, Tag, Space, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, CopyOutlined, EllipsisOutlined, PauseOutlined, SearchOutlined } from "@ant-design/icons";

import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
import { CreateCourseCloneByIdActionAsync, GetCourseActionAsync, UpdateStatusCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../../Utils/LoadingContext";


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
            {record.status !== "Closed" && (
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
            )}

            {[
              "AvailableForFranchise",
              "TemporarilySuspended",
              "Closed",
            ].includes(record.status) && (
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
              pageSizeOptions: ["7", "10"],
            }}
            scroll={{ x: 768 }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseManage;
