import React, { useState } from 'react';
import { Modal, Space, Table, Typography, Button, Upload, message } from 'antd';
import { DownloadOutlined, UploadOutlined, InboxOutlined, FileZipOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { useLoading } from '../../Utils/LoadingContext';
import { useDispatch } from 'react-redux';
import { InstructorGradeForAssignmentActionAsync } from '../../Redux/ReducerAPI/UserReducer';
import { useParams } from 'react-router-dom';

const { Title, Text, Link } = Typography;
const { Dragger } = Upload;

const ShowListSubmitAssignmentAndScores = ({ visible, onClose, assignment }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const {setLoading} = useLoading()
  const {className, id} = useParams()
  const dispatch = useDispatch()

  const columns = [
    {
      title: "Xếp hạng",
      key: "rank",
      render: (_, __, index) => {
        let color;
        if (index === 0) color = "#FFD700"; // Gold
        else if (index === 1) color = "#C0C0C0"; // Silver
        else if (index === 2) color = "#CD7F32"; // Bronze

        return (
          <Space>
            <Text strong style={{ color: color }}>
              {index + 1}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      render: (score) =>
        score !== null ? (
          <Text strong>{score.toFixed(2)}</Text>
        ) : (
          <Text>Chưa có điểm</Text>
        ),
    },
    {
      title: "File Nộp",
      dataIndex: "submitUrl",
      key: "submitUrl",
      render: (url, record) =>
        url ? (
          <Link href={url} target="_blank" rel="noopener noreferrer">
            {record.submitFileName || "Xem chi tiết"}
          </Link>
        ) : (
          <Text>Chưa nộp</Text>
        ),
    },
  ];

  const sortedScores = Array.isArray(assignment.userScores) 
  ? [...assignment.userScores].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  : [];  


  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleDownload = () => {
    const selectedUsers = sortedScores.filter((user) => selectedRowKeys.includes(user.userId));
    const data = selectedUsers.map((user) => ({
      "Mã người dùng": user.userId,
      "Tên": user.name,
      "Tên đăng nhập": user.username,
      "Tên file nộp": user.submitFileName || '',
      "Điểm": user.score,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, `user_scores_${assignment.title}.xlsx`);
  };

  const handleDownloadAllFiles = async () => {
    const selectedUsers = sortedScores.filter((user) => selectedRowKeys.includes(user.userId));
    const zip = new JSZip();

    setLoading(true);
    try {
      for (const user of selectedUsers) {
        if (user.submitUrl && user.submitFileName) {
          const response = await fetch(user.submitUrl);
          const blob = await response.blob();
          const customFileName = `${user.name}_${user.submitFileName}`;
          zip.file(customFileName, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${className}_${assignment.title}_submit.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
      setLoading(false);
      message.success('Files downloaded successfully');
    } catch (error) {
      console.error('Error downloading files:', error);
      setLoading(false);
      message.error('Error downloading files');
    }
  };

  const handleUpload = () => {
    setIsUploadModalVisible(true);
    onClose()
  };

  const handleUploadModalClose = () => {
    setIsUploadModalVisible(false);
    setFileList([]);
  };

  const processUploadedFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoading(true)
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const usersScores = jsonData.map(row => ({
        scoreNumber: parseFloat(row['Điểm']) || 0,
        userId: row['Mã người dùng'] || '',
        assignmentId: assignment.id,
      }));

      dispatch(InstructorGradeForAssignmentActionAsync(usersScores, id)).then((res)=>{
        setLoading(false)
        if (res) {
          handleUploadModalClose();    
        }
      }).catch((err)=>{
        setLoading(false)
      })
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <Modal
        title={<Title level={3}>Danh sách nộp bài tập</Title>}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={selectedRowKeys.length === 0}
            >
              Tải xuống Excel
            </Button>
            <Button
              type="primary"
              icon={<FileZipOutlined />}
              onClick={handleDownloadAllFiles}
              disabled={selectedRowKeys.length === 0}
            >
              Tải về tất cả file
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUpload}
            >
              Thêm file điểm
            </Button>
          </Space>
          <Table
            rowSelection={rowSelection}
            dataSource={sortedScores}
            columns={columns}
            rowKey="userId"
            pagination={false}
          />
        </Space>
      </Modal>

      <Modal
        title="Tải lên file điểm"
        open={isUploadModalVisible}
        onCancel={handleUploadModalClose}
        footer={[
          <Button key="cancel" onClick={handleUploadModalClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (fileList.length > 0) {
                processUploadedFile(fileList[0]);
              } else {
                message.error('Vui lòng chọn một file để tải lên');
              }
            }}
          >
            Tải lên
          </Button>,
        ]}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này để tải lên</p>
          <p className="ant-upload-hint">
            Chỉ hỗ trợ tải lên file Excel (.xlsx)
          </p>
        </Dragger>
      </Modal>
    </>
  );
};

export default ShowListSubmitAssignmentAndScores;