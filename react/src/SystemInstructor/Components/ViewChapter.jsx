import { Button, Popconfirm, Space } from "antd";
import React, { useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CreateChapterModal from "../Modal/CreateChapterModal";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { DeleteChapterActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import EditChapterModal from "../Modal/EditChapterModal";
import { useLoading } from "../../Utils/LoadingContext";

const ViewChapter = () => {
  const { chapters } = useSelector((state) => state.CourseReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isModalEditChapterVisible, setIsModalEditChapterVisible] =
    useState(false);
  const { setLoading } = useLoading();

  const handleDelete = async (chapterId) => {
    setLoading(true);
    try {
      await dispatch(DeleteChapterActionAsync(chapterId, id));
    } finally {
      setLoading(false);
    }
  };

  const showModalEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setIsModalEditChapterVisible(true);
  };

  const closeModalEditChapter = () => {
    setIsModalEditChapterVisible(false);
    setSelectedChapter(null);
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const columns = [
    {
      title: "Số chương",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            className="me-3"
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => showModalEditChapter(record)}
          />
          <Popconfirm
            title="Bạn muốn xóa chương này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandColumns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tài liệu",
      dataIndex: "url",
      key: "url",
      render: (_, record, index) => (
        <Link to={record.url} target="_blank" rel="noopener noreferrer">
          Tài liệu {index + 1}
        </Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  // Render nội dung mở rộng (expandedRowRender)
  const expandedRowRender = (record) => (
    <Table
      bordered
      columns={expandColumns}
      dataSource={record.chapterMaterials}
      pagination={false}
      rowKey="id"
      title={() => <h5>Tài nguyên</h5>} // Tiêu đề cho bảng mở rộng
    />
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các chương</h5>
          <button className="btn btn-primary" onClick={showDrawer}>
              Thêm chương
            </button>
        </div>
        {/* Bảng hiển thị chapter */}
        <Table
          bordered
          columns={columns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.chapterMaterials.length > 0, // Chỉ mở rộng nếu có materials
          }}
          dataSource={chapters}
          rowKey="id" // Đảm bảo mỗi hàng có một khóa duy nhất
        />
      </div>
      <CreateChapterModal
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />
      <EditChapterModal
        visible={isModalEditChapterVisible}
        onClose={closeModalEditChapter}
        chapter={selectedChapter}
      />
    </div>
  );
};

export default ViewChapter;
