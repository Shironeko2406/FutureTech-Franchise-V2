import React, { useState } from "react";
import { Card, Radio, Button, Result, Typography, Space } from "antd";

const quiz = {
  topic: "Javascript",
  level: "Beginner",
  totalQuestions: 4,
  perQuestionScore: 5,
  questions: [
    {
      question:
        "Which function is used to serialize an object into a JSON string in Javascript?",
      choices: ["stringify()", "parse()", "convert()", "None of the above"],
      type: "MCQs",
      correctAnswer: "stringify()",
    },
    {
      question:
        "Which of the following keywords is used to define a variable in Javascript?",
      choices: ["var", "let", "var and let", "None of the above"],
      type: "MCQs",
      correctAnswer: "var and let",
    },
    {
      question:
        "Which of the following methods can be used to display data in some form using Javascript?",
      choices: [
        "document.write()",
        "console.log()",
        "window.alert",
        "All of the above",
      ],
      type: "MCQs",
      correctAnswer: "All of the above",
    },
    {
      question: "How can a datatype be declared to be a constant type?",
      choices: ["const", "var", "let", "constant"],
      type: "MCQs",
      correctAnswer: "const",
    },
  ],
};

const QuizTest = () => {
  const [userAnswers, setUserAnswers] = useState(
    Array(quiz.totalQuestions).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = e.target.value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        return score + quiz.perQuestionScore;
      }
      return score;
    }, 0);
  };

  if (submitted) {
    return (
      <Result
        status="success"
        title="Quiz Submitted!"
        subTitle={`Your score: ${calculateScore()} out of ${
          quiz.totalQuestions * quiz.perQuestionScore
        }`}
      />
    );
  }

  return (
    <div>
      <Card title={`${quiz.topic} - ${quiz.level}`}>
        {quiz.questions.map((question, index) => (
          <Card
            key={index}
            title={`Question ${index + 1}`}
            type="inner"
            extra={`${quiz.perQuestionScore} Points`}
            className="mb-3"
          >
            <p>{question.question}</p>
            <Radio.Group
              onChange={(e) => handleAnswerChange(index, e)}
              value={userAnswers[index]}
            >
              <Space direction="vertical">
                {question.choices.map((choice, choiceIndex) => (
                  <Radio key={choiceIndex} value={choice}>
                    {choice}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>
        ))}
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ marginTop: "20px" }}
        >
          Submit
        </Button>
      </Card>
    </div>
  );
};

export default QuizTest;
