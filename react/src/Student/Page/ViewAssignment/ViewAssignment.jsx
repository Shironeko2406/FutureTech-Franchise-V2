// import React from "react";
// import { List, Typography, Card, Tag, Space, Tooltip, ConfigProvider, Button } from "antd";
// import { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// const themeConfig = {
//   components: {
//     Card: {
//       headerBg: '#1890ff',
//       headerFontSize: 16,
//       headerFontSizeSM: 14,
//     },
//     List: {
//       borderRadiusLG: 8,
//     },
//   },
// };

// const assignmentData = [
//   {
//     id: "fdd1a992-23a7-42dd-8298-08dd112dbcc3",
//     title: "Bài nè",
//     description: "xong ne",
//     startTime: "2024-11-30T00:00:00",
//     endTime: "2024-12-06T00:00:00",
//     status: "Open",
//     classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//     asmSubmits: null,
//   },
//   {
//     id: "d1c7ffaa-91c2-4b20-8299-08dd112dbcc3",
//     title: "Ass 2",
//     description: "làm bài tập",
//     startTime: "2024-11-30T00:00:00",
//     endTime: "2024-12-06T00:00:00",
//     status: "Close",
//     classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//     asmSubmits: {
//       userId: "8fa430dd-732e-4600-a2e4-507d33936df0",
//       userName: "HieuNT2411",
//       fileSubmitURL:
//         "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2Fimages-1732522731055.pdf?alt=media&token=a663d4e1-3ce5-43c2-a9f6-8091e6b1d20e",
//       submitDate: "2024-11-30T17:13:00.8148691",
//       scoreNumber: 8,
//     },
//   },
//   {
//     id: "85a3ff63-94ed-4cd2-f36e-08dd11613901",
//     title: "Ass 1.1",
//     description: "Bài tập về nhà",
//     startTime: "2024-12-01T00:00:00",
//     endTime: "2024-12-05T00:00:00",
//     status: "Open",
//     classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//     asmSubmits: {
//       userId: "8fa430dd-732e-4600-a2e4-507d1f936df0",
//       userName: "HieuNT2411",
//       fileSubmitURL:
//         "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2Fimages-1732522731055.pdf?alt=media&token=a663d4e1-3ce5-43c2-a9f6-8091e6b1d20e",
//       submitDate: "2024-11-30T17:13:00.8148691",
//       scoreNumber: null,
//     },
//   },
// ];

// const getStatusColor = (status) => {
//   return status === "Open" ? "blue" : "volcano";
// };

// const getStatusText = (status) => {
//   return status === "Open" ? "Đang mở" : "Đã đóng";
// };

// const getSubmissionStatus = (asmSubmits) => {
//   if (!asmSubmits) return "Chưa nộp";
//   if (asmSubmits.scoreNumber !== null) return "Đã chấm điểm";
//   return "Đã nộp";
// };

// const getScoreColor = (score) => {
//   if (score < 5) return "red";
//   if (score < 8) return "orange";
//   return "green";
// };

// const renderAssignmentItem = (item) => {
//   const submissionStatus = getSubmissionStatus(item.asmSubmits);

//   return (
//     <List.Item>
//       <Card
//         title={
//           <Space>
//             <FileTextOutlined />
//             <Text strong>{item.title}</Text>
//           </Space>
//         }
//         extra={<Tag color={getStatusColor(item.status)}>{getStatusText(item.status)}</Tag>}
//         hoverable
//       >
//         <Space direction="vertical" size="small" style={{ width: '100%' }}>
//           <Text>{item.description}</Text>
//           <Text type="secondary">
//             <ClockCircleOutlined /> Bắt đầu: {new Date(item.startTime).toLocaleString()}
//           </Text>
//           <Text type="secondary">
//             <ClockCircleOutlined /> Kết thúc: {new Date(item.endTime).toLocaleString()}
//           </Text>
//           <Space>
//             {submissionStatus === "Chưa nộp" && (
//               <Tag icon={<CloseCircleOutlined />} color="error">
//                 Chưa nộp
//               </Tag>
//             )}
//             {submissionStatus === "Đã nộp" && (
//               <Tag icon={<CheckCircleOutlined />} color="processing">
//                 Đã nộp (Chưa chấm điểm)
//               </Tag>
//             )}
//             {submissionStatus === "Đã chấm điểm" && (
//               <Tooltip title={`Điểm số: ${item.asmSubmits?.scoreNumber}/10`}>
//                 <Tag icon={<CheckCircleOutlined />} color="success">
//                   Đã chấm điểm
//                 </Tag>
//               </Tooltip>
//             )}
//             {item.asmSubmits?.scoreNumber !== null && item.asmSubmits?.scoreNumber !== undefined && (
//               <Tag color={getScoreColor(item.asmSubmits.scoreNumber)}>
//                 {item.asmSubmits.scoreNumber}/10
//               </Tag>
//             )}
//           </Space>
//           <Button
//             type="primary"
//             icon={item.status === "Open" ? <UploadOutlined /> : <EyeOutlined />}
//           >
//             {item.status === "Open" ? "Nộp bài" : "Xem chi tiết"}
//           </Button>
//         </Space>
//       </Card>
//     </List.Item>
//   );
// };

// const ViewAssignment = () => {
//   return (
//     <ConfigProvider theme={themeConfig}>
//       <div style={{ padding: '24px' }}>
//         <Title level={3} style={{ marginBottom: '24px' }}>
//           <FileTextOutlined /> Danh sách bài tập
//         </Title>
//         <List
//           grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
//           dataSource={assignmentData}
//           renderItem={renderAssignmentItem}
//         />
//       </div>
//     </ConfigProvider>
//   );
// };

// export default ViewAssignment;




import React, { useEffect } from "react";
import { List, Typography, Card, Tag, Space, Tooltip, ConfigProvider, Button } from "antd";
import { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, UploadOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../../Utils/LoadingContext";
import { GetStudentAssignmentsByClassIdActionAsync } from "../../../Redux/ReducerAPI/AssignmentReducer";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

const themeConfig = {
  components: {
    Card: {
      headerBg: '#1890ff',
      headerFontSize: 16,
      headerFontSizeSM: 14,
    },
    List: {
      borderRadiusLG: 8,
    },
  },
};

// const studentAssignmentOfClass = [
//   {
//     id: "fdd1a992-23a7-42dd-8298-08dd112dbcc3",
//     title: "Bài nè",
//     description: "xong ne",
//     startTime: "2024-11-30T00:00:00",
//     endTime: "2024-12-06T00:00:00",
//     classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//     asmSubmits: null,
//   },
//   {
//     id: "d1c7ffaa-91c2-4b20-8299-08dd112dbcc3",
//     title: "Ass 2",
//     description: "làm bài tập",
//     startTime: "2024-11-30T00:00:00",
//     endTime: "2024-12-06T00:00:00",
//     classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//     asmSubmits: {
//       userId: "8fa430dd-732e-4600-a2e4-507d33936df0",
//       userName: "HieuNT2411",
//       fileSubmitURL:
//         "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2Fimages-1732522731055.pdf?alt=media&token=a663d4e1-3ce5-43c2-a9f6-8091e6b1d20e",
//       submitDate: "2024-11-30T17:13:00.8148691",
//       scoreNumber: 8,
//     },
//   },
//   {
//     id: "85a3ff63-94ed-4cd2-f36e-08dd11613901",
//     title: "Ass 1.1",
//     description: "Bài tập về nhà",
//     startTime: "2024-12-01T02:30:00",
//     endTime: "2024-12-05T00:00:00",
//     classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//     asmSubmits: {
//       userId: "8fa430dd-732e-4600-a2e4-507d1f936df0",
//       userName: "HieuNT2411",
//       fileSubmitURL:
//         "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2Fimages-1732522731055.pdf?alt=media&token=a663d4e1-3ce5-43c2-a9f6-8091e6b1d20e",
//       submitDate: "2024-11-30T17:13:00.8148691",
//       scoreNumber: null,
//     },
//   },
// ];

const getAssignmentStatus = (assignment) => {
  const startTime = moment(assignment.startTime);
  const endTime = moment(assignment.endTime);
  const now = moment();

  if (now.isBefore(startTime)) {
    return "Not open";
  } else if (now.isAfter(endTime)) {
    return "Closed";
  } else {
    return "Open";
  }
};

const renderAssignmentStatus = (assignment) => {
  const status = getAssignmentStatus(assignment);
  const statusConfig = {
    "Not open": { color: "orange", icon: <LockOutlined />, text: "Chưa mở" },
    "Open": { color: "green", icon: <UnlockOutlined />, text: "Đang mở" },
    "Closed": { color: "red", icon: <LockOutlined />, text: "Đã đóng" }
  };

  const { color, icon, text } = statusConfig[status];

  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

const getSubmissionStatus = (asmSubmits) => {
  if (!asmSubmits) return "Chưa nộp";
  if (asmSubmits.scoreNumber !== null) return "Đã chấm điểm";
  return "Đã nộp";
};

const getScoreColor = (score) => {
  if (score < 5) return "red";
  if (score < 8) return "orange";
  return "green";
};

const renderSubmissionStatus = (submissionStatus, asmSubmits) => {
  if (submissionStatus === "Chưa nộp") {
    return (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Chưa nộp
      </Tag>
    );
  } else if (submissionStatus === "Đã nộp") {
    return (
      <Tag icon={<CheckCircleOutlined />} color="processing">
        Đã nộp (Chưa chấm điểm)
      </Tag>
    );
  } else {
    return (
      <>
        <Tooltip title={`Điểm số: ${asmSubmits?.scoreNumber}/10`}>
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã chấm điểm
          </Tag>
        </Tooltip>
        {asmSubmits?.scoreNumber !== null && asmSubmits?.scoreNumber !== undefined && (
          <Tag color={getScoreColor(asmSubmits.scoreNumber)}>
            {asmSubmits.scoreNumber}/10
          </Tag>
        )}
      </>
    );
  }
};

const renderButton = (item, assignmentStatus, submissionStatus, navigate) => {
  if (assignmentStatus === "Not open") {
    return <Button disabled icon={<LockOutlined />}>Chưa mở</Button>;
  } else if (assignmentStatus === "Open") {
    if (submissionStatus === "Chưa nộp") {
      return <Button type="primary" icon={<UploadOutlined />} onClick={() => navigate(`/student/assignment/${item.id}`)}>Nộp bài</Button>;
    } else {
      return <Button icon={<EyeOutlined />} onClick={() => navigate(`/student/assignment/${item.id}`)}>Xem bài nộp</Button>;
    }
  } else { // Closed
    return <Button icon={<EyeOutlined />} onClick={() => navigate(`/student/assignment/${item.id}`)}>Xem chi tiết</Button>;
  }
};

const ViewAssignment = () => {
  const { studentAssignmentOfClass } = useSelector((state) => state.AssignmentReducer)
  const {setLoading} = useLoading()
  const dispatch = useDispatch()
  const {id} = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    dispatch(GetStudentAssignmentsByClassIdActionAsync(id)).finally(() => setLoading(false))
  }, [dispatch, id, setLoading])

  return (
    <ConfigProvider theme={themeConfig}>
      <div style={{ padding: '24px' }}>
        <Title level={3} style={{ marginBottom: '24px' }}>
          <FileTextOutlined /> Danh sách bài tập
        </Title>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={studentAssignmentOfClass}
          renderItem={(item) => {
            const assignmentStatus = getAssignmentStatus(item);
            const submissionStatus = getSubmissionStatus(item.asmSubmits);
            
            return (
              <List.Item>
                <Card
                  title={
                    <Space>
                      <FileTextOutlined />
                      <Text strong>{item.title}</Text>
                    </Space>
                  }
                  extra={renderAssignmentStatus(item)}
                  hoverable
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text>{item.description}</Text>
                    <Text type="secondary">
                      <ClockCircleOutlined /> Bắt đầu: {moment(item.startTime).format('LLL')}
                    </Text>
                    <Text type="secondary">
                      <ClockCircleOutlined /> Kết thúc: {moment(item.endTime).format('LLL')}
                    </Text>
                    <Space>
                      {renderSubmissionStatus(submissionStatus, item.asmSubmits)}
                    </Space>
                    {renderButton(item, assignmentStatus, submissionStatus, navigate)}
                  </Space>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default ViewAssignment;



