import React from "react";
import { Table, Button } from "antd";
import { useSelector } from "react-redux";

const ViewSession = () => {
  const { sessions } = useSelector((state) => state.CourseReducer);
  // Tạo danh sách filters tự động dựa trên dữ liệu của chapter
  const uniqueChapters = [...new Set(sessions.map((item) => item.chapter))]; // Lấy các chương không trùng lặp
  const chapterFilters = uniqueChapters.map((chapter) => ({
    text: chapter,
    value: chapter,
  }));
  console.log(sessions)

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
      width: "5%",
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      width: "40%",
    },
    {
      title: "Chapter",
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các session</h5>
          <Button type="primary">Thêm syllabus</Button>
        </div>
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
