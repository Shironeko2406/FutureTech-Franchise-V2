import React from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";

const ViewSession = () => {
  const { sessions } = useSelector((state) => state.CourseReducer);
  // Tạo danh sách filters tự động dựa trên dữ liệu của chapter
  const uniqueChapters = [...new Set(sessions.map((item) => item.chapter))]; // Lấy các chương không trùng lặp
  const chapterFilters = uniqueChapters.map((chapter) => ({
    text: chapter,
    value: chapter,
  }));

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
      width: "5%",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      width: "40%",
    },
    {
      title: "Chương",
      dataIndex: "chapter",
      key: "chapter",
      width: "20%",
      filters: chapterFilters,
      onFilter: (value, record) => record.chapter.includes(value),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
          <h5 className="card-title">Chi tiết các buổi học</h5>
        {/* Bảng hiển thị session */}
        <Table
          bordered
          dataSource={sessions}
          columns={columns}
          rowKey="id"
          pagination={true}
        />
      </div>
    </div>
  );
};

export default ViewSession;
