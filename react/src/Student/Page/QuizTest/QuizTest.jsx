import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  styled,
} from "@mui/material";
import { FiClock, FiAward, FiCheck, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetQuizStudentTestActionAsync,
  SubmitQuizActionAsync,
} from "../../../Redux/ReducerAPI/QuizReducer";
import { QUIZ_SELECTED_OPTION } from "../../../Utils/Interceptors";
import {
  getDataJSONStorage,
  removeDataTextStorage,
  setDataJSONStorage,
} from "../../../Utils/UtilsFunction";
import { useLoading } from "../../../Utils/LoadingContext";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "16px 0",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

// const quizData = {
//   id: "29665623-0b47-46e4-3666-08dcfd9a47fe",
//   quantity: 2,
//   duration: 20, //phút
//   title: "Test 2",
//   description: "Ôn tập",
//   startTime: "2024-11-06T21:20:00.509",
//   classId: "99e3af58-64b4-4304-ae6a-2d8782e9caed",
//   questions: [
//     {
//       id: "4684a681-00eb-493c-7d92-08dcfd82e47e",
//       description: "Biến trong lập trình C là gì?",
//       questionOptions: [
//         {
//           id: "9ac81e0c-7153-48dd-4f95-08dcfd82e481",
//           description: "Một vùng nhớ có tên.",
//         },
//         {
//           id: "472feef6-d160-4cf0-4f96-08dcfd82e481",
//           description: "Là một hằng số.",
//         },
//         {
//           id: "e32f7f33-87af-4cc1-4f97-08dcfd82e481",
//           description: "Một kiểu dữ liệu.",
//         },
//         { id: "62d875e1-181b-4117-4f98-08dcfd82e481", description: "Một hàm." },
//       ],
//     },
//     {
//       id: "6b4f2dd4-42cc-4a87-7d93-08dcfd82e47e",
//       description: "Câu lệnh nào sau đây dùng để khai báo biến trong C?",
//       questionOptions: [
//         { id: "72c99331-6f1b-4fa3-4f99-08dcfd82e481", description: "int a;" },
//         { id: "36569d88-a394-40b4-4f9a-08dcfd82e481", description: "var a;" },
//         { id: "6a3eccd3-39fd-47af-4f9b-08dcfd82e481", description: "a : int;" },
//         {
//           id: "d4cf93b9-1caf-4ba9-4f9c-08dcfd82e481",
//           description: "declare a int;",
//         },
//       ],
//     },
//   ],
// };

const QuizTest = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { quizData } = useSelector((state) => state.QuizReducer);

  useEffect(() => {
    dispatch(GetQuizStudentTestActionAsync(quizId));
  }, [quizId]);

  useEffect(() => {
    if (quizData && quizData.startTime) {
      const startTime = new Date(quizData.startTime).getTime();
      const endTime = startTime + quizData.duration * 60 * 1000; // chuyển duration từ phút sang ms
      const currentTime = new Date().getTime();
      const remainingTime = Math.max(0, (endTime - currentTime) / 1000); // tính thời gian còn lại (giây)

      setTimeLeft(remainingTime); // đặt thời gian còn lại ban đầu

      if (remainingTime > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            const newTime = prevTime - 1;
            if (newTime <= 0) {
              clearInterval(timer);
              handleSubmitQuiz();
            }
            return newTime;
          });
        }, 1000);
        return () => clearInterval(timer);
      } else {
        handleSubmitQuiz(); // tự động submit nếu hết thời gian
      }
    }
  }, [quizData]);

  useEffect(() => {
    // Lấy câu trả lời đã lưu từ localStorage khi component được tải lại
    const savedAnswers = getDataJSONStorage(QUIZ_SELECTED_OPTION);
    if (savedAnswers) {
      setSelectedAnswers(savedAnswers);
    }
  }, []);

  const handleAnswerSelect = (questionId, optionId) => {
    const newAnswers = { ...selectedAnswers, [questionId]: optionId };
    setSelectedAnswers(newAnswers);

    // Lưu câu trả lời vào localStorage
    setDataJSONStorage(QUIZ_SELECTED_OPTION, newAnswers);
  };

  const handleSubmitQuiz = () => {
    setLoading(true);
    const questionOptionsId = Object.values(selectedAnswers);
    const result = { questionOptionsId };
    dispatch(SubmitQuizActionAsync(quizId, result))
      .then((response) => {
        setLoading(false);
        if (response) {
          removeDataTextStorage(QUIZ_SELECTED_OPTION)
          navigate(`/student/quiz/${quizId}`);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60); // lấy số phút
    const remainingSeconds = Math.floor(seconds % 60); // lấy số giây còn lại

    // Định dạng phút và giây để đảm bảo luôn có 2 chữ số
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
    <>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {quizData.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Mô tả: {quizData.description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FiClock size={20} style={{ marginRight: "8px" }} />
          <Typography variant="body1">
            Thời gian còn lại: {formatTime(timeLeft)}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(timeLeft / (quizData.duration * 60)) * 100}
          sx={{
            mb: 2,
            height: 8,
            borderRadius: 4,
            "& .MuiLinearProgress-bar": {
              transition: "transform 0.1s linear",
            },
          }}
        />

        <Typography variant="body2" gutterBottom>
          Tiến độ: {Math.round(progress)}%
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 4 }} />

        {quizData.questions.map((question, index) => (
          <StyledCard key={question.id}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Câu hỏi {index + 1} / {quizData.questions.length}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {question.description}
              </Typography>
              <RadioGroup
                value={selectedAnswers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerSelect(question.id, e.target.value)
                }
              >
                {question.questionOptions.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.description}
                  />
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
            disabled={
              Object.keys(selectedAnswers).length !== quizData.questions.length
            }
          >
            Nộp bài
          </Button>
        </Box>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Xác nhận nộp bài</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn đã chắc chắn các lựa chọn và xác nhận nộp bài tập này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Hủy</Button>
          <Button
            onClick={() => {
              setShowModal(false);
              handleSubmitQuiz();
            }}
            color="primary"
            variant="contained"
          >
            Nộp bài
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuizTest;
