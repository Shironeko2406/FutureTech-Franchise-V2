import React, { useState } from "react";
import { Table, Button, Progress, Tag } from "antd";
import { useSelector } from "react-redux";
import CreateAssessmentModal from "../Modal/CreateAssessmentModal";

const ViewAssessment = () => {
  const { assessments } = useSelector((state) => state.CourseReducer);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Số lượng bài",
      dataIndex: "quatity",
      key: "quatity",
    },
    {
      title: "Trọng số",
      dataIndex: "weight",
      key: "weight",
      render: (weight) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress
            percent={weight}
            size="small"
            style={{ width: 60, marginRight: 8 }}
          />
        </div>
      ),
    },
    {
      title: "Tiêu chí hoàn thành",
      dataIndex: "completionCriteria",
      key: "completionCriteria",
      render: (completionCriteria) => (
        <Tag color="blue">≥ {completionCriteria}</Tag>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết đánh giá</h5>
          {assessments.length > 0 ? ( // Kiểm tra nếu có chapters
            <button className="btn btn-warning" onClick={showDrawer}>Sửa đánh giá</button>
          ) : (
            <button className="btn btn-primary" onClick={showDrawer}>Thêm đánh giá</button>
          )}
        </div>
        {/* Bảng hiển thị assessment */}
        <Table
          bordered
          pagination={false}
          dataSource={assessments}
          columns={columns}
          rowKey="id"
        />
      </div>
      <CreateAssessmentModal
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />
    </div>
  );
};

export default ViewAssessment;
