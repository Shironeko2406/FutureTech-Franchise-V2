// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { Card, Typography, Space, Button, Tag, Descriptions, Upload, Row, Col, Divider, Statistic, message } from "antd";
// import { UploadOutlined, FileOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, EyeOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { imageDB } from "../../../Firebasse/Config";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { useLoading } from "../../../Utils/LoadingContext";
// import { GetAssignmentDetailByIdActionAsync } from "../../../Redux/ReducerAPI/AssignmentReducer";
// import { StudentSubmitAssignmentActionAsync } from "../../../Redux/ReducerAPI/UserReducer";

// const { Title, Paragraph, Text } = Typography;

// const getAssignmentStatus = (assignment) => {
//   const startTime = moment(assignment?.startTime);
//   const endTime = moment(assignment?.endTime);
//   const now = moment();

//   if (now.isBefore(startTime)) {
//     return "Chưa mở";
//   } else if (now.isAfter(endTime)) {
//     return "Đã đóng";
//   } else {
//     return "Đang mở";
//   }
// };

// const AssignmentDetail = () => {
//   const [fileUrl, setFileUrl] = useState("");
//   const [fileName, setFileName] = useState("");
//   const [fileList, setFileList] = useState([]);
//   const dispatch = useDispatch()
//   const { assignmentId } = useParams()
//   const navigate = useNavigate()
//   const {setLoading} = useLoading()
//   const { assignmentDetail } = useSelector((state) => state.AssignmentReducer)
//   const isBeforeStartTime = moment().isBefore(assignmentDetail?.startTime);
//   const isTimeExpired = moment().isAfter(assignmentDetail?.endTime);
//   const canSubmit = !isBeforeStartTime && !isTimeExpired;
//   const status = getAssignmentStatus(assignmentDetail);
  
//   useEffect(() => {
//     setLoading(true)
//     dispatch(GetAssignmentDetailByIdActionAsync(assignmentId)).finally(() => setLoading(false))
//   }, [assignmentId])

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Chưa mở":
//         return "orange";
//       case "Đang mở":
//         return "green";
//       case "Đã đóng":
//         return "red";
//       default:
//         return "default";
//     }
//   };

//   const handleUpload = ({ file, onSuccess, onError }) => {
//     const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
//     if (!isZip) {
//       message.error('Chỉ được phép tải lên file ZIP!');
//       onError(new Error('Chỉ được phép tải lên file ZIP!'));
//       return;
//     }

//     setFileList([
//       {
//         uid: file.uid,
//         name: file.name,
//         status: 'uploading',
//       },
//     ]);

//     const storageRef = ref(imageDB, `assignments/${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {},
//       (error) => {
//         message.error("Upload failed!");
//         console.error(error);
//         onError(error);
//       },
//       async () => {
//         try {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           setFileUrl(downloadURL);
//           setFileName(file.name);
//           setFileList([
//             {
//               uid: file.uid,
//               name: file.name,
//               status: 'done',
//               url: downloadURL,
//             },
//           ]);
//           message.success("Upload successful!");
//           onSuccess(null, file);
//         } catch (err) {
//           message.error("Failed to retrieve file URL.");
//           console.error(err);
//           onError(err);
//         }
//       }
//     );
//   };

//   const handleDeleteFile = () => {    
//     setFileUrl('');
//     setFileName(''); 
//     setFileList([])   
//   };

//   const handleSubmitAssignment = () => {
//     setLoading(true)
//     if (fileUrl && fileName) {
//       dispatch(StudentSubmitAssignmentActionAsync({
//         assignmentId: assignmentId,
//         fileUrl: fileUrl,
//         fileName: fileName
//       })).then((res) => {
//         setLoading(false)
//         if (res) {
//           setFileUrl('');
//           setFileName(''); 
//           setFileList([])
//         }
//       }).catch((err) => {
//         setLoading(false)
//         console.log(err)
//       });
//     } else {
//       message.error("Please upload a file before submitting.");
//     }
//   };

//   const handleViewAssignment = () => {
//     if (assignmentDetail?.fileURL) {
//       window.open(assignmentDetail.fileURL, '_blank');
//     } else {
//       message.error('Không có file đề bài');
//     }
//   };

//   const renderSubmissionStatus = () => {
//     if (!assignmentDetail?.asmSubmits) {
//       return (
//         <Card>
//           <Statistic
//             title="Trạng thái nộp bài"
//             value="Chưa nộp"
//             valueStyle={{ color: '#cf1322' }}
//             prefix={<ExclamationCircleOutlined />}
//           />
//         </Card>
//       );
//     }

//     const { fileName, submitDate, scoreNumber, fileSubmitURL } = assignmentDetail.asmSubmits;
//     return (
//       <Card>
//         <Statistic
//           title="Trạng thái nộp bài"
//           value="Đã nộp"
//           valueStyle={{ color: '#3f8600' }}
//           prefix={<CheckCircleOutlined />}
//         />
//         <Divider />
//         <Descriptions column={1}>
//           <Descriptions.Item label="Tên file">
//             <a href={fileSubmitURL} target="_blank" rel="noopener noreferrer">
//               {fileName ?? "N/A"}
//             </a>
//           </Descriptions.Item>
//           <Descriptions.Item label="Thời gian nộp">
//             {submitDate ? moment(submitDate).format("DD/MM/YYYY HH:mm") : "N/A"}
//           </Descriptions.Item>
//           <Descriptions.Item label="Điểm số">
//             {scoreNumber !== null ? scoreNumber : "Chưa chấm điểm"}
//           </Descriptions.Item>
//         </Descriptions>
//       </Card>
//     );
//   };

//   const renderAssignmentType = () => {
//     const isCompulsory = assignmentDetail?.type === "Compulsory";
//     return (
//       <Card>
//         <Statistic
//           title="Loại bài tập"
//           value={isCompulsory ? "Bắt buộc" : "Không bắt buộc"}
//           valueStyle={{ color: isCompulsory ? '#1890ff' : '#52c41a' }}
//           prefix={isCompulsory ? <StarFilled /> : <StarOutlined />}
//         />
//         <Divider />
//         <Paragraph>
//           {isCompulsory ? (
//             <Text strong type="danger">Bài tập này sẽ được tính điểm.</Text>
//           ) : (
//             <Text strong type="secondary">Bài tập này không tính điểm.</Text>
//           )}
//         </Paragraph>
//       </Card>
//     );
//   };

//   return (
//     <Space direction="vertical" size="large" style={{ width: "100%" }}>
//       <Card>
//         <Row justify="space-between" align="middle">
//           <Col>
//             <Title level={2}>{assignmentDetail?.title ?? "Không có tiêu đề"}</Title>
//           </Col>
//           <Col>
//             <Tag color={getStatusColor(status)} style={{ fontSize: '16px', padding: '5px 10px' }}>
//               {status}
//             </Tag>
//           </Col>
//         </Row>
//         <Paragraph>{assignmentDetail?.description ?? "Không có mô tả"}</Paragraph>
//         <Button 
//           type="primary" 
//           icon={<EyeOutlined />} 
//           onClick={handleViewAssignment}
//           style={{ marginTop: '16px' }}
//         >
//           Xem đề bài
//         </Button>
//       </Card>

//       <Row gutter={16}>
//         <Col span={8}>
//           <Card title="Thông tin thời gian">
//             <Descriptions bordered column={1}>
//               <Descriptions.Item label="Thời gian bắt đầu">
//                 {assignmentDetail?.startTime ? moment(assignmentDetail.startTime).format("DD/MM/YYYY HH:mm") : "N/A"}
//               </Descriptions.Item>
//               <Descriptions.Item label="Thời gian kết thúc">
//                 {assignmentDetail?.endTime ? moment(assignmentDetail.endTime).format("DD/MM/YYYY HH:mm") : "N/A"}
//               </Descriptions.Item>
//             </Descriptions>
//           </Card>
//         </Col>
//         <Col span={8}>
//           {renderSubmissionStatus()}
//         </Col>
//         <Col span={8}>
//           {renderAssignmentType()}
//         </Col>
//       </Row>

//       <Card>
//         {canSubmit && (
//           <Space direction="vertical" size="large" style={{ width: "100%" }}>
//             <Upload customRequest={handleUpload} onRemove={handleDeleteFile} fileList={fileList} accept=".zip" beforeUpload={(file) => {
//               const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
//               if (!isZip) {
//                 message.error('Chỉ được phép tải lên file ZIP!');
//               }
//               return isZip || Upload.LIST_IGNORE;
//             }}>
//               <Button icon={<UploadOutlined />} size="large">
//                 Chọn file ZIP để nộp
//               </Button>
//             </Upload>
//             {fileUrl && (
//               <Button type="primary" size="large" onClick={handleSubmitAssignment}>
//                 Nộp bài
//               </Button>
//             )}
//           </Space>
//         )}

//         {isBeforeStartTime && (
//           <Paragraph strong type="warning">
//             <ClockCircleOutlined /> Chưa đến thời gian làm bài
//           </Paragraph>
//         )}

//         {isTimeExpired && (
//           <Paragraph strong type="danger">
//             <ClockCircleOutlined /> Đã hết hạn
//           </Paragraph>
//         )}
//       </Card>
//     </Space>
//   );
// };

// export default AssignmentDetail;

import React, { useEffect, useState } from "react";
import moment from "moment";
import { Card, Typography, Space, Button, Tag, Descriptions, Upload, Row, Col, Divider, Statistic, message, Alert } from "antd";
import { UploadOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, EyeOutlined, StarOutlined, StarFilled, CheckSquareOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../../Firebasse/Config";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../Utils/LoadingContext";
import { GetAssignmentDetailByIdActionAsync } from "../../../Redux/ReducerAPI/AssignmentReducer";
import { StudentSubmitAssignmentActionAsync } from "../../../Redux/ReducerAPI/UserReducer";

const { Title, Paragraph, Text } = Typography;

const getAssignmentStatus = (assignment) => {
  const startTime = moment(assignment?.startTime);
  const endTime = moment(assignment?.endTime);
  const now = moment();

  if (now.isBefore(startTime)) {
    return "Chưa mở";
  } else if (now.isAfter(endTime)) {
    return "Đã đóng";
  } else {
    return "Đang mở";
  }
};

const AssignmentDetail = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch()
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const {setLoading} = useLoading()
  const { assignmentDetail } = useSelector((state) => state.AssignmentReducer)
  const isBeforeStartTime = moment().isBefore(assignmentDetail?.startTime);
  const isTimeExpired = moment().isAfter(assignmentDetail?.endTime);
  const canSubmit = !isBeforeStartTime && !isTimeExpired;
  const status = getAssignmentStatus(assignmentDetail);
  
  useEffect(() => {
    setLoading(true)
    dispatch(GetAssignmentDetailByIdActionAsync(assignmentId)).finally(() => setLoading(false))
  }, [assignmentId, dispatch, setLoading])

  const getStatusColor = (status) => {
    switch (status) {
      case "Chưa mở":
        return "orange";
      case "Đang mở":
        return "green";
      case "Đã đóng":
        return "red";
      default:
        return "default";
    }
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!isZip) {
      message.error('Chỉ được phép tải lên file ZIP!');
      onError(new Error('Chỉ được phép tải lên file ZIP!'));
      return;
    }

    setFileList([
      {
        uid: file.uid,
        name: file.name,
        status: 'uploading',
      },
    ]);

    const storageRef = ref(imageDB, `assignments/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        message.error("Upload failed!");
        console.error(error);
        onError(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileUrl(downloadURL);
          setFileName(file.name);
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'done',
              url: downloadURL,
            },
          ]);
          message.success("Upload successful!");
          onSuccess(null, file);
        } catch (err) {
          message.error("Failed to retrieve file URL.");
          console.error(err);
          onError(err);
        }
      }
    );
  };

  const handleDeleteFile = () => {    
    setFileUrl('');
    setFileName(''); 
    setFileList([])   
  };

  const handleSubmitAssignment = () => {
    setLoading(true)
    if (fileUrl && fileName) {
      dispatch(StudentSubmitAssignmentActionAsync({
        assignmentId: assignmentId,
        fileUrl: fileUrl,
        fileName: fileName
      })).then((res) => {
        setLoading(false)
        if (res) {
          setFileUrl('');
          setFileName(''); 
          setFileList([])
        }
      }).catch((err) => {
        setLoading(false)
        console.log(err)
      });
    } else {
      message.error("Please upload a file before submitting.");
    }
  };

  const handleViewAssignment = () => {
    if (assignmentDetail?.fileURL) {
      window.open(assignmentDetail.fileURL, '_blank');
    } else {
      message.error('Không có file đề bài');
    }
  };

  const renderSubmissionStatus = () => {
    if (!assignmentDetail?.asmSubmits) {
      return (
        <Card>
          <Statistic
            title="Trạng thái nộp bài"
            value="Chưa nộp"
            valueStyle={{ color: '#cf1322' }}
            prefix={<ExclamationCircleOutlined />}
          />
        </Card>
      );
    }

    const { fileName, submitDate, scoreNumber, fileSubmitURL } = assignmentDetail.asmSubmits;
    const isGraded = scoreNumber !== null;

    return (
      <Card>
        <Statistic
          title="Trạng thái nộp bài"
          value={isGraded ? "Đã chấm điểm" : "Đã nộp"}
          valueStyle={{ color: isGraded ? '#722ed1' : '#3f8600' }}
          prefix={isGraded ? <CheckSquareOutlined /> : <CheckCircleOutlined />}
        />
        <Divider />
        <Descriptions column={1}>
          <Descriptions.Item label="Tên file">
            <a href={fileSubmitURL} target="_blank" rel="noopener noreferrer">
              {fileName ?? "N/A"}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian nộp">
            {submitDate ? moment(submitDate).format("DD/MM/YYYY HH:mm") : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm số">
            {isGraded ? scoreNumber : "Chưa chấm điểm"}
          </Descriptions.Item>
        </Descriptions>
        {isGraded && (
          <Alert
            message="Bài làm đã được chấm điểm"
            description="Bạn không thể nộp lại bài tập này."
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}
      </Card>
    );
  };

  const renderAssignmentType = () => {
    const isCompulsory = assignmentDetail?.type === "Compulsory";
    return (
      <Card>
        <Statistic
          title="Loại bài tập"
          value={isCompulsory ? "Bắt buộc" : "Không bắt buộc"}
          valueStyle={{ color: isCompulsory ? '#1890ff' : '#52c41a' }}
          prefix={isCompulsory ? <StarFilled /> : <StarOutlined />}
        />
        <Divider />
        <Paragraph>
          {isCompulsory ? (
            <Text strong type="danger">Bài tập này sẽ được tính điểm.</Text>
          ) : (
            <Text strong type="secondary">Bài tập này không tính điểm.</Text>
          )}
        </Paragraph>
      </Card>
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>{assignmentDetail?.title ?? "Không có tiêu đề"}</Title>
          </Col>
          <Col>
            <Tag color={getStatusColor(status)} style={{ fontSize: '16px', padding: '5px 10px' }}>
              {status}
            </Tag>
          </Col>
        </Row>
        <Paragraph>{assignmentDetail?.description ?? "Không có mô tả"}</Paragraph>
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={handleViewAssignment}
          style={{ marginTop: '16px' }}
        >
          Xem đề bài
        </Button>
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thông tin thời gian">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Thời gian bắt đầu">
                {assignmentDetail?.startTime ? moment(assignmentDetail.startTime).format("DD/MM/YYYY HH:mm") : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian kết thúc">
                {assignmentDetail?.endTime ? moment(assignmentDetail.endTime).format("DD/MM/YYYY HH:mm") : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          {renderSubmissionStatus()}
        </Col>
        <Col span={8}>
          {renderAssignmentType()}
        </Col>
      </Row>

      <Card>
        {canSubmit && !assignmentDetail?.asmSubmits?.scoreNumber && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Upload customRequest={handleUpload} onRemove={handleDeleteFile} fileList={fileList} accept=".zip" beforeUpload={(file) => {
              const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
              if (!isZip) {
                message.error('Chỉ được phép tải lên file ZIP!');
              }
              return isZip || Upload.LIST_IGNORE;
            }}>
              <Button icon={<UploadOutlined />} size="large">
                Chọn file ZIP để nộp
              </Button>
            </Upload>
            {fileUrl && (
              <Button type="primary" size="large" onClick={handleSubmitAssignment}>
                Nộp bài
              </Button>
            )}
          </Space>
        )}

        {isBeforeStartTime && (
          <Paragraph strong type="warning">
            <ClockCircleOutlined /> Chưa đến thời gian làm bài
          </Paragraph>
        )}

        {isTimeExpired && (
          <Paragraph strong type="danger">
            <ClockCircleOutlined /> Đã hết hạn
          </Paragraph>
        )}

        {canSubmit && assignmentDetail?.asmSubmits?.scoreNumber && (
          <Alert
            message="Bài làm đã được chấm điểm"
            description="Bạn không thể nộp lại bài tập này."
            type="info"
            showIcon
          />
        )}
      </Card>
    </Space>
  );
};

export default AssignmentDetail;

