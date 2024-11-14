import React from "react";
import { useSelector } from "react-redux";
import { Descriptions } from "antd";

const labelStyle = { textAlign: "right", width: "220px" };

const ViewSyllabus = () => {
  const { courseById } = useSelector((state) => state.CourseReducer);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Chi tiết giáo trình</h5>
        <div style={{ overflowX: "auto" }}>
          <Descriptions bordered column={1} style={{ minWidth: "600px" }}>
            <Descriptions.Item label="Tên khóa học:" labelStyle={labelStyle}>
              {courseById?.name ?? "null"}
            </Descriptions.Item>
            <Descriptions.Item label="Mã khóa học:" labelStyle={labelStyle}>
              {courseById?.code ?? "null"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Phân bổ thời gian:"
              labelStyle={labelStyle}
            >
              {courseById?.syllabus?.timeAllocation ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả:" labelStyle={labelStyle}>
              {courseById?.syllabus?.description ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Nhiệm vụ của sinh viên:"
              labelStyle={labelStyle}
            >
              {courseById?.syllabus?.studentTask ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Công cụ yêu cầu:" labelStyle={labelStyle}>
              {courseById?.syllabus?.toolsRequire
                ?.split("\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                )) ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Thang điểm:" labelStyle={labelStyle}>
              {courseById?.syllabus?.scale ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm trung bình:" labelStyle={labelStyle}>
              {courseById?.syllabus?.minAvgMarkToPass ?? "Chưa có giáo trình"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  );
};

export default ViewSyllabus;
