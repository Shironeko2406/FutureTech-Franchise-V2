// import React from "react";
// import moment from "moment";
// import { Card, Typography, Space, Button, Tag, Descriptions, Upload, Row, Col, Divider, Statistic } from "antd";
// import { UploadOutlined, FileOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// const { Title, Paragraph, Text } = Typography;

// const assignmentDetail = {
//   id: "6af59f6f-79d2-4ae9-5f0b-08dd11f161c0",
//   title: "Bài 2 về nhà",
//   description: "mota",
//   startTime: "2024-11-01T00:00:00",
//   endTime: "2024-12-01T00:00:00",
//   status: "Open",
//   classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//   asmSubmits: {
//     userId: "8fa430dd-732e-4600-a2e4-507d1f936df0",
//     userName: "HieuNT2411",
//     fileName: "Bài tập.doc",
//     fileSubmitURL:
//       "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2Fimages-1732522731055.pdf?alt=media&token=a663d4e1-3ce5-43c2-a9f6-8091e6b1d20e2",
//     submitDate: "2024-11-30T18:21:39.4539133",
//     scoreNumber: 8,
//   },
// };

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
//   const status = getAssignmentStatus(assignmentDetail);
//   const isBeforeStartTime = moment().isBefore(assignmentDetail?.startTime);
//   const isTimeExpired = moment().isAfter(assignmentDetail?.endTime);
//   const canSubmit = !isBeforeStartTime && !isTimeExpired;

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
//       </Card>

//       <Row gutter={16}>
//         <Col span={12}>
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
//         <Col span={12}>
//           {renderSubmissionStatus()}
//         </Col>
//       </Row>

//       <Card>
//         {canSubmit && (
//           <Upload>
//             <Button icon={<UploadOutlined />} type="primary" size="large">
//               Nộp bài
//             </Button>
//           </Upload>
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
import { Card, Typography, Space, Button, Tag, Descriptions, Upload, Row, Col, Divider, Statistic, message } from "antd";
import { UploadOutlined, FileOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../../Firebasse/Config";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../Utils/LoadingContext";
import { GetAssignmentDetailByIdActionAsync } from "../../../Redux/ReducerAPI/AssignmentReducer";
import { StudentSubmitAssignmentActionAsync } from "../../../Redux/ReducerAPI/UserReducer";


const { Title, Paragraph, Text } = Typography;

// const assignmentDetail = {
//   id: "6af59f6f-79d2-4ae9-5f0b-08dd11f161c0",
//   title: "Bài 2 về nhà",
//   description: "mota",
//   startTime: "2024-11-01T00:00:00",
//   endTime: "2024-12-03T00:00:00",
//   status: "Open",
//   classId: "d8c29bff-b1f7-4603-b4b5-08dd112d7331",
//   asmSubmits: {
//     userId: "8fa430dd-732e-4600-a2e4-507d1f936df0",
//     userName: "HieuNT2411",
//     fileName: "Bài tập.doc",
//     fileSubmitURL:
//       "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2Fimages-1732522731055.pdf?alt=media&token=a663d4e1-3ce5-43c2-a9f6-8091e6b1d20e2",
//     submitDate: "2024-11-30T18:21:39.4539133",
//     scoreNumber: 8,
//   },
// };

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
  }, [ assignmentId])

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
    return (
      <Card>
        <Statistic
          title="Trạng thái nộp bài"
          value="Đã nộp"
          valueStyle={{ color: '#3f8600' }}
          prefix={<CheckCircleOutlined />}
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
            {scoreNumber !== null ? scoreNumber : "Chưa chấm điểm"}
          </Descriptions.Item>
        </Descriptions>
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
      </Card>

      <Row gutter={16}>
        <Col span={12}>
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
        <Col span={12}>
          {renderSubmissionStatus()}
        </Col>
      </Row>

      <Card>
        {canSubmit && (
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
      </Card>
    </Space>
  );
};

export default AssignmentDetail;

