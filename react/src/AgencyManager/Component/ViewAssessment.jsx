// import React from "react";
// import { Table } from "antd";
// import { useSelector } from "react-redux";
// const ViewAssessment = () => {
//   const { assessments } = useSelector((state) => state.CourseReducer);

//   const columns = [
//     {
//       title: "STT",
//       dataIndex: "number",
//       key: "number",
//     },
//     {
//       title: "Loại",
//       dataIndex: "type",
//       key: "type",
//     },
//     {
//       title: "Nội dung",
//       dataIndex: "content",
//       key: "content",
//     },
//     {
//       title: "Trọng số",
//       dataIndex: "weight",
//       key: "weight",
//     },
//     {
//       title: "Tiêu chí hoàn thành",
//       dataIndex: "completionCriteria",
//       key: "completionCriteria",
//     },
//     {
//       title: "Thời gian",
//       dataIndex: "duration",
//       key: "duration",
//     },
//     {
//       title: "Loại câu hỏi",
//       dataIndex: "questionType",
//       key: "questionType",
//     },
//   ];

//   return (
//     <div className="card">
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="card-title">Chi tiết đánh giá</h5>
//         </div>
//         {/* Bảng hiển thị assessment */}
//         <Table
//           bordered
//           pagination={false}
//           dataSource={assessments}
//           columns={columns}
//           rowKey="id"
//         />
//       </div>
//     </div>
//   );
// };

// export default ViewAssessment;





import React from "react";
import { Table, Progress, Tag } from "antd";
import { useSelector } from "react-redux";

const ViewAssessment = () => {
  const { assessments } = useSelector((state) => state.CourseReducer);

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
    </div>
  );
};

export default ViewAssessment;
