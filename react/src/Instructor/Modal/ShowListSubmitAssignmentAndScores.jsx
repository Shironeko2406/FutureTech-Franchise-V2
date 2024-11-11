import React, { useState } from 'react';
import { Modal, Space, Table, Typography, Button, Upload, message } from 'antd';
import { DownloadOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title, Text, Link } = Typography;
const { Dragger } = Upload;

const ShowListSubmitAssignmentAndScores = ({ visible, onClose, scores }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

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

  const sortedScores = [...scores].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

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
      "Đường dẫn file nộp": user.submitUrl || '',
      "Điểm": '', // Leave blank for scoring
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'user_scores.xlsx');
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
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const processedData = jsonData.map(row => ({
        scoreNumber: parseFloat(row['Điểm']) || 0,
        userId: row['Mã người dùng'] || '',
      }));

      console.log(processedData);
      message.success('File processed successfully');
      handleUploadModalClose();
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
              Tải xuống Excel để chấm điểm
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