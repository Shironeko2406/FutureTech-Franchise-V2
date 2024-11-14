import React from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ViewChapter = () => {
  const { chapters } = useSelector((state) => state.CourseReducer);

  const columns = [
    {
      title: "Số chương",
      dataIndex: "number",
      key: "number",
      width: "10%",
      align: "center",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      width: "30%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "60%",
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
      title={() => <h5>Tài nguyên</h5>}
    />
  );

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Chi tiết các chương</h5>
        {/* Bảng hiển thị chapter */}
        <Table
          bordered
          columns={columns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.chapterMaterials.length > 0,
          }}
          dataSource={chapters}
          rowKey="id"
          scroll={{ x: 768 }}
        />
      </div>
    </div>
  );
};

export default ViewChapter;
