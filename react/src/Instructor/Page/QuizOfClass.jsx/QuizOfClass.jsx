import {
  DeleteOutlined,
  EditOutlined,
  RightCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import CreateQuizModal from "../../Modal/CreateQuizModal";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  GetChapterFilterByClassIdActionAsync,
  GetQuizDataAndScoreByClassIdActionAsync,
} from "../../../Redux/ReducerAPI/ClassReducer";
import { useLoading } from "../../../Utils/LoadingContext";
import ViewScoreQuizModal from "../../Modal/ViewScoreQuizModal";
import { DeleteQuizByIdActionAsync } from "../../../Redux/ReducerAPI/QuizReducer";
import EditQuizModal from "../../Modal/EditQuizModal";

const { Text } = Typography;

const renderStatusBadge = (startTime, duration) => {
  // Calculate the quiz status based on startTime and duration
  const quizStartTime = moment(startTime);
  const quizEndTime = quizStartTime.clone().add(duration, "minutes");
  const isBeforeStartTime = moment().isBefore(quizStartTime);
  const isTimeExpired = moment().isAfter(quizEndTime);

  // Determine the status
  let status;
  if (isBeforeStartTime) {
    status = "NotOpen"; // Chưa mở
  } else if (!isTimeExpired) {
    status = "Open"; // Đang mở
  } else {
    status = "Closed"; // Đã đóng
  }

  // Define configuration for each status
  const statusConfig = {
    NotOpen: {
      text: "Chưa mở",
      color: "gray",
      backgroundColor: "#f0f0f0",
      borderColor: "#d9d9d9",
    },
    Open: {
      text: "Đang mở",
      color: "green",
      backgroundColor: "#f6ffed",
      borderColor: "#b7eb8f",
    },
    Closed: {
      text: "Đã đóng",
      color: "red",
      backgroundColor: "#fff2f0",
      borderColor: "#ffa39e",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "6px",
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <Text strong style={{ color: config.color }}>
        {config.text}
      </Text>
    </div>
  );
};

const renderTypeBadge = (type) => {
  const typeConfig = {
    Compulsory: {
      text: "Lấy điểm",
      color: "blue",
      backgroundColor: "#e6f7ff",
      borderColor: "#91d5ff",
    },
    Optional: {
      text: "Không lấy điểm",
      color: "green",
      backgroundColor: "#f6ffed",
      borderColor: "#b7eb8f",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "6px",
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <Text strong style={{ color: config.color }}>
        {config.text}
      </Text>
    </div>
  );
};

const QuizOfClass = () => {
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { id } = useParams();
  const { quizData } = useSelector((state) => state.ClassReducer);
  const [selectedQuiz, setSelectedQuiz] = useState([]);
  const [selectedQuizEdit, setSelectedQuizEdit] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalViewScoreVisible, setIsModalViewScoreVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(GetChapterFilterByClassIdActionAsync(id)),
      dispatch(GetQuizDataAndScoreByClassIdActionAsync(id)),
    ]).finally(() => setLoading(false));
  }, [id]);


  const showModalCreateQuiz = () => {
    setIsModalVisible(true);
  };

  const handleCloseModalCreateQuiz = () => {
    setIsModalVisible(false);
  };

  const showModalViewScore = (scores) => {
    setIsModalViewScoreVisible(true);
    setSelectedQuiz(scores);
  };

  const handleCloseModalViewScore = () => {
    setIsModalViewScoreVisible(false);
    setSelectedQuiz([]);
  };

  const showModalEditQuiz = (quiz) => {
    setIsModalEditVisible(true);
    setSelectedQuizEdit(quiz)
  };

  const handleCloseModalEditQuiz = () => {
    setIsModalEditVisible(false);
    setSelectedQuizEdit(null)
  };

  const handleDelete = async (quizId) => {
    setLoading(true);
    try {
      await dispatch(DeleteQuizByIdActionAsync(id, quizId));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "18%",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => showModalViewScore(record.userScores)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            height: "auto",
            fontSize: "14px",
            transition: "all 0.3s ease",
          }}
          className="hover:bg-blue-50"
        >
          <Text strong style={{ marginRight: "4px" }}>
            {text}
          </Text>
          <RightCircleOutlined style={{ fontSize: "16px" }} />
        </Button>
      ),
    },
    {
      title: "Lượng câu hỏi",
      dataIndex: "quantity",
      key: "quantity",
      width: "12%",
      align: "center",
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "duration",
      key: "duration",
      width: "14%",
      align: "center",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: "16%",
      render: (startTime) => new Date(startTime).toLocaleString(),
    },
    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      width: "12%",
      render: (_, record) =>
        renderStatusBadge(record.startTime, record.duration),
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      width: "15%",
      align: "center",
      render: (type) => renderTypeBadge(type),
    },
    {
      title: "Hành động",
      key: "action",
      width: "13%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{ backgroundColor: "#faad14", color: "#fff" }}
            onClick={() => showModalEditQuiz(record)}
          />
          <Popconfirm
            title="Bạn muốn xóa bài kiểm tra này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Danh Sách Bài Kiểm Tra</h5>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<RocketOutlined />}
            onClick={showModalCreateQuiz}
          >
            Thêm bài kiểm tra
          </Button>
        </Space>

        <Table
          bordered
          columns={columns}
          dataSource={quizData}
          rowKey="id"
          scroll={{ x: 768 }}
        />

        {/* Modal */}
        <CreateQuizModal
          visible={isModalVisible}
          onClose={handleCloseModalCreateQuiz}
        />

        <EditQuizModal
          visible={isModalEditVisible}
          onClose={handleCloseModalEditQuiz}
          quiz={selectedQuizEdit}
        />

        <ViewScoreQuizModal
          visible={isModalViewScoreVisible}
          onClose={handleCloseModalViewScore}
          scores={selectedQuiz}
        />
      </div>
    </div>
  );
};

export default QuizOfClass;
