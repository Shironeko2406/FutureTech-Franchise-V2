import React from "react";
import { List, Card, Tag, Typography, Space, Progress, Tooltip, ConfigProvider, Button } from "antd";
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TrophyOutlined, CommentOutlined, ExclamationCircleOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

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

const QuizList = () => {
  const { quizOfClassStudent } = useSelector((state) => state.ClassReducer);

  const getQuizStatus = (quiz) => {
    const startTime = moment(quiz.startTime);
    const endTime = startTime.clone().add(quiz.duration, "minutes");
    const now = moment();

    if (now.isBefore(startTime)) {
      return "Not open";
    } else if (now.isAfter(endTime)) {
      return "Closed";
    } else {
      return "Open";
    }
  };

  const renderQuizStatus = (quiz) => {
    const status = getQuizStatus(quiz);
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

  const renderQuizAction = (quiz) => {
    const status = getQuizStatus(quiz);

    if (status === "Not open") {
      return (
        <Button type="default" disabled block>
          Chưa mở
        </Button>
      );
    } else if (status === "Open") {
      if (quiz.scores === null) {
        return (
          <NavLink to={`/student/quiz/${quiz.id}`}>
            <Button type="primary" block>Vào làm bài</Button>
          </NavLink>
        );
      } else {
        return (
          <NavLink to={`/student/quiz/${quiz.id}`}>
            <Button type="default" block>Xem kết quả</Button>
          </NavLink>
        );
      }
    } else { // Closed
      return (
        <NavLink to={`/student/quiz/${quiz.id}`}>
            <Button type="default" block>Xem kết quả</Button>
        </NavLink>
      );
    }
  };

  const renderQuizContent = (quiz) => {
    if (quiz.scores === null) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          {quiz.scores === null && <Tag color="blue" icon={<ExclamationCircleOutlined />}>Chưa làm</Tag>}
          {renderQuizAction(quiz)}
        </Space>
      );
    } else {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Tooltip title="Điểm của bạn">
              <Space>
                <TrophyOutlined />
                <Text>{(quiz.scores.scoreNumber).toFixed(0)} / 10</Text>
              </Space>
            </Tooltip>
            <Tooltip title="Feedback available">
              <Space>
                <CommentOutlined />
                <Text>Feedback</Text>
              </Space>
            </Tooltip>
          </Space>
          <Progress
            percent={(quiz.scores.scoreNumber / 10) * 100}
            status={
              quiz.scores.scoreNumber < 5
                ? "exception"
                : quiz.scores.scoreNumber < 7
                ? "normal"
                : "success"
            }
            format={(percent) => `${percent.toFixed(0)}%`}
          />
          {renderQuizAction(quiz)}
        </Space>
      );
    }
  };

  const renderDateTime = (dateTime) => {
    const date = moment(dateTime).format("DD/MM/YYYY");
    const time = moment(dateTime).format("HH:mm");
    return (
      <Space>
        <Text style={{ color: 'white' }}>{date}</Text>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1em' }}>{time}</Text>
      </Space>
    );
  };

  //return chính
  return (
    <ConfigProvider theme={themeConfig}>
      <div className="card">
        <div className="card-body">
          <Title level={3} className="card-title mb-4">
            <FileTextOutlined className="mr-2" /> Bài kiểm tra
          </Title>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
            dataSource={quizOfClassStudent}
            renderItem={(quiz) => (
              <List.Item>
                <Card
                  hoverable
                  className="h-100"
                  cover={
                    <div style={{ background: '#1890ff', padding: '12px', color: 'white' }}>
                      <Space>
                        <CalendarOutlined />
                        {renderDateTime(quiz.startTime)}
                      </Space>
                    </div>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Title level={4}>{quiz.title}</Title>
                      {renderQuizStatus(quiz)}
                    </Space>
                    <Text type="secondary">{quiz.description}</Text>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Tooltip title="Thời gian">
                        <Space>
                          <ClockCircleOutlined />
                          <Text>{quiz.duration} phút</Text>
                        </Space>
                      </Tooltip>
                      <Tooltip title="Số câu hỏi">
                        <Tag color="blue">{quiz.quantity} Câu hỏi</Tag>
                      </Tooltip>
                    </Space>
                    {renderQuizContent(quiz)}
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default QuizList;