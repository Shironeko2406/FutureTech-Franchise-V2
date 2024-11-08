import React from "react";
import { Modal, Table, Typography, Space } from "antd";

const { Title, Text } = Typography;

const ViewScoreQuizModal = ({ visible, onClose, scores }) => {
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
      render: (score) => <Text strong>{score.toFixed(2)}</Text>,
    },
  ];

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <Modal
      title={<Title level={3}>Điểm bài kiểm tra</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Table
        dataSource={sortedScores}
        columns={columns}
        rowKey="userId"
        pagination={false}
        className="mt-4"
      />
    </Modal>
  );
};

export default ViewScoreQuizModal;
