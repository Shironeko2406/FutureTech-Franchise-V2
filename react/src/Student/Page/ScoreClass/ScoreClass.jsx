import { Table, Typography } from "antd";
import React from "react";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const scoreData = {
  assessmentAttendanceView: {
    id: "5eb17042-7b3f-4b01-93c1-08dd2a8700cd",
    type: "Attendance",
    content: "Điểm danh",
    quantity: 1,
    weight: 10,
    completionCriteria: 0,
    totalDaysAttended: 7,
    attendedDays: 0,
    score: 0,
  },
  assessmentQuizView: {
    id: "db2469b1-f1ab-431e-93c2-08dd2a8700cd",
    type: "Quiz",
    content: "Kiểm tra trắc nghiệm",
    quantity: 2,
    weight: 20,
    completionCriteria: 0,
    score: 1.3333333333333333,
    quizzes: [
      {
        title: "Bài kiểm tra định kì số 1",
        weight: 10,
        score: 2.6666666666666665,
      },
      {
        title: "Bài kiểm tra định kì số 2",
        weight: 10,
        score: 7,
      },
    ],
  },
  assessmentAssignmentView: {
    id: "535725be-dbdb-4185-93c3-08dd2a8700cd",
    type: "Assignment",
    content: "Bầi tập  thực hành",
    quantity: 1,
    weight: 30,
    completionCriteria: 0,
    score: 10,
    assignments: [
      {
        title: "Bài tập định kì số 1",
        weight: 30,
        score: 10,
      },
    ],
  },
  assessmentFinalViewModel: {
    id: "91693693-f57b-4dd2-93c4-08dd2a8700cd",
    type: "FinalExam",
    content: "Kiểm tra cuối khóa",
    quantity: 1,
    weight: 40,
    completionCriteria: 4,
    score: 0,
    finals: [
      {
        title: "Bài kiểm cuối khóa số 1",
        weight: 40,
        score: 0,
      },
    ],
  },
  averageScore: 3.266666666666667,
};

const data = [
    // Attendance
    {
      key: 'attendance',
      category: scoreData.assessmentAttendanceView.content,
      item: 'Điểm danh',
      weight: scoreData.assessmentAttendanceView.weight,
      score: scoreData.assessmentAttendanceView.score,
      type: 'attendance',
      isFirst: true
    },
    {
      key: 'attendanceTotal',
      category: scoreData.assessmentAttendanceView.content,
      item: 'Tổng điểm danh',
      weight: scoreData.assessmentAttendanceView.weight,
      score: scoreData.assessmentAttendanceView.score,
      isTotal: true,
      type: 'attendance'
    },
    // Quiz
    ...scoreData.assessmentQuizView.quizzes.map((quiz, index) => ({
      key: `quiz${index}`,
      category: scoreData.assessmentQuizView.content,
      item: quiz.title,
      weight: quiz.weight,
      score: quiz.score,
      type: 'quiz',
      isFirst: index === 0
    })),
    {
      key: 'quizTotal',
      category: scoreData.assessmentQuizView.content,
      item: 'Tổng kiểm tra',
      weight: scoreData.assessmentQuizView.weight,
      score: scoreData.assessmentQuizView.score,
      isTotal: true,
      type: 'quiz'
    },
    // Assignment
    ...scoreData.assessmentAssignmentView.assignments.map((assignment, index) => ({
      key: `assignment${index}`,
      category: scoreData.assessmentAssignmentView.content,
      item: assignment.title,
      weight: assignment.weight,
      score: assignment.score,
      type: 'assignment',
      isFirst: index === 0
    })),
    {
      key: 'assignmentTotal',
      category: scoreData.assessmentAssignmentView.content,
      item: 'Tổng bài tập',
      weight: scoreData.assessmentAssignmentView.weight,
      score: scoreData.assessmentAssignmentView.score,
      isTotal: true,
      type: 'assignment'
    },
    // Final
    ...scoreData.assessmentFinalViewModel.finals.map((final, index) => ({
      key: `final${index}`,
      category: scoreData.assessmentFinalViewModel.content,
      item: final.title,
      weight: final.weight,
      score: final.score,
      type: 'final',
      isFirst: index === 0
    })),
    {
      key: 'finalTotal',
      category: scoreData.assessmentFinalViewModel.content,
      item: 'Tổng cuối khóa',
      weight: scoreData.assessmentFinalViewModel.weight,
      score: scoreData.assessmentFinalViewModel.score,
      isTotal: true,
      type: 'final'
    },
    // Average
    {
      key: 'average',
      category: '',
      item: 'Điểm trung bình',
      weight: null,
      score: scoreData.averageScore,
      isTotal: true,
      type: 'average'
    },
  ]

const ScoreClass = () => {
  const {className} = useParams()

  console.log(data)

  const getRowCount = (type) => {
    console.log(type)
    switch (type) {
      case 'attendance':
        return 2 // 1 item + total
      case 'quiz':
        return scoreData.assessmentQuizView.quizzes.length + 1 // items + total
      case 'assignment':
        return scoreData.assessmentAssignmentView.assignments.length + 1 // items + total
      case 'final':
        return scoreData.assessmentFinalViewModel.finals.length + 1 // items + total
      case 'average':
        return 1; // Chỉ có một dòng
      default:
        return 1;
    }
  }

  const columns = [
    {
      title: 'Phân loại',
      dataIndex: 'category',
      width: 150,
      onCell: (record) => {
        if (record.isFirst || record.type == 'average') {
          return { rowSpan: getRowCount(record.type) }
        }
        return { rowSpan: 0 }
      }
    },
    {
      title: 'Hạng mục',
      dataIndex: 'item',
      width: 200,
    },
    {
      title: 'Tỉ trọng',
      dataIndex: 'weight',
      width: 100,
      align: 'right',
      render: (weight) => weight ? `${weight.toFixed(1)}%` : '',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      width: 100,
      align: 'right',
      render: (score) => score.toFixed(2),
    },
  ]

  return (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title">Điểm quá trình</h5>

            <Title level={4} className="course-title">
                {className}
            </Title>
   

            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                rowClassName={(record) => {
                if (record.isTotal) return 'ant-table-row-total'
                return ''
                }}
            />
        </div>
    </div>
  );
};

export default ScoreClass;
