import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Descriptions } from "antd";
import CreateSyllabus from "../Modal/CreateSyllabus";

const labelStyle = { textAlign: "right", width: "220px" };

const ViewSyllabus = () => {
  const { courseById } = useSelector((state) => state.CourseReducer);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết syllabus</h5>
          <button className="btn btn-success" onClick={showDrawer}>
            Thêm syllabus
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Descriptions bordered column={1} style={{ minWidth: "600px" }}>
            <Descriptions.Item label="Syllabus ID:" labelStyle={labelStyle}>
              {courseById?.syllabusId ?? "Chưa có syllabus"}
            </Descriptions.Item>
            <Descriptions.Item label="Course Name:" labelStyle={labelStyle}>
              {courseById?.name ?? "null"}
            </Descriptions.Item>
            <Descriptions.Item label="Code:" labelStyle={labelStyle}>
              {courseById?.code ?? "null"}
            </Descriptions.Item>
            <Descriptions.Item label="Time Allocation:" labelStyle={labelStyle}>
              {courseById?.syllabus?.timeAllocation ?? "Chưa có syllabus"}
            </Descriptions.Item>
            <Descriptions.Item label="Description:" labelStyle={labelStyle}>
              {courseById?.syllabus?.description ?? "Chưa có syllabus"}
            </Descriptions.Item>
            <Descriptions.Item label="Student Tasks:" labelStyle={labelStyle}>
              {courseById?.syllabus?.studentTask ?? "Chưa có syllabus"}
            </Descriptions.Item>
            <Descriptions.Item label="Tools Require:" labelStyle={labelStyle}>
              {courseById?.syllabus?.toolsRequire
                ?.split("\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                )) ?? "Chưa có syllabus"}
            </Descriptions.Item>
            <Descriptions.Item label="Scoring Scale:" labelStyle={labelStyle}>
              {courseById?.syllabus?.scale ?? "Chưa có syllabus"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Min Average Mark To Pass:"
              labelStyle={labelStyle}
            >
              {courseById?.syllabus?.minAvgMarkToPass ?? "Chưa có syllabus"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <CreateSyllabus
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />
    </div>
  );
};

export default ViewSyllabus;
