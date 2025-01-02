import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, LinearProgress, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, styled } from "@mui/material";
import { FiClock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetQuizStudentTestActionAsync, SubmitQuizActionAsync } from "../../../Redux/ReducerAPI/QuizReducer";
import { QUIZ_SELECTED_OPTION } from "../../../Utils/Interceptors";
import { getDataJSONStorage, removeDataTextStorage, setDataJSONStorage } from "../../../Utils/UtilsFunction";
import { useLoading } from "../../../Utils/LoadingContext";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "16px 0",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const QuizTest = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { quizId, className, classId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { quizData } = useSelector((state) => state.QuizReducer);

  const handleSubmitQuiz = useCallback(async (answers) => {
    setLoading(true);
    const questionOptionsId = Object.values(answers);
    const result = { questionOptionsId };
    try {
      const response = await dispatch(SubmitQuizActionAsync(quizId, result));
      setLoading(false);
      if (response) {
        removeDataTextStorage(QUIZ_SELECTED_OPTION);
        navigate(`/student/${className}/${classId}/quiz/${quizId}`);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [quizId, dispatch, setLoading, navigate]);

  useEffect(() => {
    dispatch(GetQuizStudentTestActionAsync(quizId));
  }, [quizId, dispatch]);

  useEffect(() => {
    if (quizData && quizData.startTime) {
      const startTime = new Date(quizData.startTime).getTime();
      const endTime = startTime + quizData.duration * 60 * 1000;
      const currentTime = new Date().getTime();
      const remainingTime = Math.max(0, (endTime - currentTime) / 1000);

      setTimeLeft(remainingTime);

      if (remainingTime > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            const newTime = prevTime - 1;
            if (newTime <= 0) {
              clearInterval(timer);
              setIsTimeUp(true);
            }
            return newTime;
          });
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setIsTimeUp(true);
      }
    }
  }, [quizData]);

  useEffect(() => {
    if (isTimeUp) {
      handleSubmitQuiz(selectedAnswers);
    }
  }, [isTimeUp, selectedAnswers, handleSubmitQuiz]);

  useEffect(() => {
    const savedAnswers = getDataJSONStorage(QUIZ_SELECTED_OPTION);
    if (savedAnswers) {
      setSelectedAnswers(savedAnswers);
    }
  }, []);

  const handleAnswerSelect = (questionId, optionId) => {
    const newAnswers = { ...selectedAnswers, [questionId]: optionId };
    setSelectedAnswers(newAnswers);
    setDataJSONStorage(QUIZ_SELECTED_OPTION, newAnswers);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const progress = quizData?.questions
    ? (Object.keys(selectedAnswers).length / quizData.questions.length) * 100
    : 0;

  if (!quizData || !quizData.questions) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Đang lấy bài kiểm tra...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{quizData.title}</Typography>
      <Typography variant="subtitle1" gutterBottom>Mô tả: {quizData.description}</Typography>
      
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FiClock size={20} style={{ marginRight: "8px" }} />
        <Typography variant="body1">Thời gian còn lại: {formatTime(timeLeft)}</Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={(timeLeft / (quizData.duration * 60)) * 100}
        sx={{ mb: 2, height: 8, borderRadius: 4, "& .MuiLinearProgress-bar": { transition: "transform 0.1s linear" } }}
      />

      <Typography variant="body2" gutterBottom>Tiến độ: {Math.round(progress)}%</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 4 }} />

      {quizData.questions.map((question, index) => (
        <StyledCard key={question.id}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Câu hỏi {index + 1} / {quizData.questions.length}</Typography>
            {question.imageURL && (
              <Box mb={4}>
                <img
                  src={question.imageURL}
                  alt={`Hình ảnh cho câu hỏi ${index + 1}`}
                  style={{ width: "200px", margin: "0 auto", borderRadius: "8px" }}
                />
              </Box>
            )}
            <Typography variant="body1" gutterBottom>{question.description}</Typography>
            <RadioGroup value={selectedAnswers[question.id] || ""} onChange={(e) => handleAnswerSelect(question.id, e.target.value)}>
              {question.questionOptions.map((option) => (
                <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.description} />
              ))}
            </RadioGroup>
          </CardContent>
        </StyledCard>
      ))}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          disabled={Object.keys(selectedAnswers).length !== quizData.questions.length}
        >
          Nộp bài
        </Button>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Xác nhận nộp bài</DialogTitle>
        <DialogContent>
          <Typography>Bạn đã chắc chắn các lựa chọn và xác nhận nộp bài tập này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Hủy</Button>
          <Button onClick={() => { setShowModal(false); handleSubmitQuiz(selectedAnswers); }} color="primary" variant="contained">Nộp bài</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default QuizTest