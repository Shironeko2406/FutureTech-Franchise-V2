import { Button } from "antd";
import React from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const ViewChapter = () => {
  const { chapters } = useSelector((state) => state.CourseReducer);
  const navigate = useNavigate();
  const { id } = useParams();

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
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "50%",
    }
  ];


  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các chương</h5>
        </div>
        {/* Bảng hiển thị chapter */}
        <Table
          bordered
          columns={columns}
          dataSource={chapters}
          rowKey="id"
          scroll={{ x: 768 }}
        />
      </div>
    </div>
  );
};

export default ViewChapter;
