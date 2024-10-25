import { Button } from "antd";
import React, { useState } from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";
import CreateChapterModal from "../Modal/CreateChapterModal";
import { Link } from "react-router-dom";

const ViewChapter = () => {
  const { chapters } = useSelector((state) => state.CourseReducer);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  // Cột cho bảng chính
  const columns = [
    {
      title: "Số Chapter",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Mô tả", // Thêm cột Mô tả
      dataIndex: "description",
      key: "description",
    },
  ];

  // Cột cho bảng expandedRowRender
  const expandColumns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự (index + 1)
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (_,record, index) => (
        <Link to={record.url} target="_blank" rel="noopener noreferrer">
          Tài liệu {index+1}
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
      title={() => <h5>Chapter Material</h5>} // Tiêu đề cho bảng mở rộng
    />
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các chapter</h5>
          <Button type="primary" onClick={showDrawer}>Thêm chapter</Button>
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
    </div>
  );
};

export default ViewChapter;
