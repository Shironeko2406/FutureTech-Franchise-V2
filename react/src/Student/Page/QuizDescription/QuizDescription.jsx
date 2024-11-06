import { Button, Divider, Table, Tag, Typography } from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetQuizReviewByIdActionAsync } from "../../../Redux/ReducerAPI/QuizReducer";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const QuizDescription = () => {
  const dispatch = useDispatch();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizReview } = useSelector((state) => state.QuizReducer);
  const startTime = moment(quizReview?.startTime); // Thời gian bắt đầu của bài kiểm tra
  const duration = quizReview?.duration; // Thời lượng của bài kiểm tra (đơn vị: phút)
  const endTime = startTime.clone().add(duration, "minutes"); // Tính thời gian kết thúc
  const isBeforeStartTime = moment().isBefore(startTime);
  const isTimeExpired = moment().isAfter(endTime);

  useEffect(() => {
    dispatch(GetQuizReviewByIdActionAsync(quizId));
  }, []);

  const handleStartQuiz = () => {
    navigate(`/student/quiz/${quizId}/start`);
  };

  const handleBack = ()=>{
    navigate(`/student/class/${quizReview.classId}`)
  }

  const scoreData = [
    {
      key: "1",
      status: "Đã hoàn thành",
      score100: (quizReview?.scores?.scoreNumber || 0) * 10,
      score10: quizReview?.scores?.scoreNumber || 0,
    },
  ];

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {text}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Điểm / 100",
      dataIndex: "score100",
      key: "score100",
      align: "center",
      render: (score) => {
        let color = "red"; 
        if (score >= 50 && score < 70) color = "orange"; 
        else if (score >= 70) color = "green"; 

        return <Tag color={color}>{score}</Tag>;
      },
    },
    {
      title: "Điểm / 10",
      dataIndex: "score10",
      key: "score10",
      align: "center",
      render: (score) => {
        let color = "red"; 
        if (score >= 5 && score < 7) color = "orange"; 
        else if (score >= 7) color = "green"; 

        return <Tag color={color}>{score}</Tag>;
      },
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title text-center fs-7">
          {quizReview?.title || "Không có dữ liệu"}
        </h4>
        <Divider />

        <Paragraph style={{ textAlign: "justify" }}>
          <Text strong>Mô tả bài kiểm tra</Text>
          {quizReview?.description ? (
            quizReview.description.split("\n").map((line, index) => (
              <Paragraph key={index} style={{ margin: 0 }}>
                {line}
              </Paragraph>
            ))
          ) : (
            <Text type="secondary">Không dữ liệu</Text>
          )}
        </Paragraph>

        <Divider style={{ borderColor: "#7cb305" }} />

        <div className="text-center mb-4">
          <Text className="fs-5">
            Số lần làm:{" "}
            <Text strong className="fs-5">
              1
            </Text>
          </Text>
          <br />
          <Text className="fs-5">
            Thời gian bắt đầu{" "}
            <Text strong className="fs-5">
              {quizReview?.startTime
                ? moment(quizReview.startTime).format("DD/MM/YYYY, HH:mm")
                : "Không xác định"}
            </Text>
          </Text>
          <br />
          <Text className="fs-5">
            Thời gian kết thúc{" "}
            <Text strong className="fs-5">
              {quizReview?.startTime && quizReview?.duration
                ? moment(quizReview.startTime)
                    .add(quizReview.duration, "minutes")
                    .format("DD/MM/YYYY, HH:mm")
                : "Không xác định"}
            </Text>
          </Text>
          <br />
          <Text className="fs-5 mb-3">
            Thời gian làm bài:{" "}
            <Text strong className="fs-5">
              {quizReview?.duration || "Không có dữ liệu"} phút
            </Text>
          </Text>
        </div>

        <Divider dashed />

        {/* Hiển thị nút và bảng điểm */}
        {quizReview?.scores ? (
          <div className="text-center">
            <Button type="primary" size="large" onClick={handleBack}>
              Trở lại
            </Button>
            <Divider />
            <Table
              columns={columns}
              dataSource={scoreData}
              pagination={false}
              bordered
              size="middle"
            />
          </div>
        ) : (
          <div className="text-center">
            {isBeforeStartTime ? (
              <>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Chưa đến thời gian làm bài
                </p>
                <Button type="primary" size="large" onClick={handleBack}>
                  Trở lại
                </Button>
              </>
            ) : isTimeExpired ? (
              <>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Đã lố thời gian làm bài
                </p>
                <Button type="primary" size="large" onClick={handleBack}>
                  Trở lại
                </Button>
              </>
            ) : (
              <Button type="primary" size="large" onClick={handleStartQuiz}>
                Vào làm bài test
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDescription;
