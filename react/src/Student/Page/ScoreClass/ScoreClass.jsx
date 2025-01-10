import { Button, Progress, Table, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { GetScoreOfClassForStudentActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
import { GetPercentCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../../Utils/LoadingContext";

const { Title } = Typography;

const StyledTable = styled(Table)`
  --border-color: #e5e7eb;

  .ant-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    background: #1e2f67 !important;
    color: white !important;
    font-weight: 600;
    padding: 12px 16px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-color: var(--border-color);
  }

  .ant-table-tbody > tr:nth-child(even) > td {
    background-color: #f9fafb;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f3f4f6 !important;
  }

  .font-medium {
    font-weight: 500;
  }

  /* Style for average row */
  .ant-table-tbody > tr:last-child > td {
    background-color: #f3f4f6;
    border-top: 2px solid var(--border-color);
  }

  /* Score colors */
  .score-below {
    color: #dc2626;
  }

  .score-warning {
    color: #f59e0b;
  }

  .score-success {
    color: #10b981;
  }
`;

const ScoreClass = () => {
  const {className, classId, courseId} = useParams();
  const { scoreData, certification } = useSelector((state) => state.UserReducer);
  const { percentCourseProgress } = useSelector((state) => state.CourseReducer);
  const dispatch = useDispatch()
  const {setLoading} = useLoading()
  const navigate = useNavigate()

  useEffect(()=>{
    setLoading(true)
    Promise.all([
      dispatch(GetScoreOfClassForStudentActionAsync(classId)),
      dispatch(GetPercentCourseActionAsync(courseId)),
    ]).finally(() => setLoading(false))
  },[classId])

  const handleNavigateToCertificate = () => {
    navigate(`/student/${className}/${classId}/course/${courseId}/certificate`, { state: { certification, scoreData } });
  };

  const getRowCount = (type) => {
    switch (type) {
      case 'attendance':
        return 2; // 1 item + total
      case 'quiz':
        return scoreData.filter(item => item.type === 'quiz').length; // items + total
      case 'assignment':
        return scoreData.filter(item => item.type === 'assignment').length ; // items + total
      case 'final':
        return scoreData.filter(item => item.type === 'final').length ; // items + total
      case 'average':
        return 1; // Chỉ có một dòng
      default:
        return 1;
    }
  }

  const getScoreClassName = (score, completionCriteria) => {
    if (score < completionCriteria) return 'score-below';
    if (score >= completionCriteria && score < 8) return 'score-warning';
    return 'score-success';
  }

  const columns = [
    {
      title: 'Phân loại',
      dataIndex: 'category',
      width: 150,
      onCell: (record) => {
        if (record.type === 'average') {
          return { 
            colSpan: 2,
            className: 'font-medium' // Add bold font for average row
          }
        }
        if (record.isFirst) {
          return { 
            rowSpan: getRowCount(record.type),
            className: 'font-medium' // Add bold font for category cells
          }
        }
        return { rowSpan: 0 }
      }
    },
    {
      title: 'Hạng mục',
      dataIndex: 'item',
      width: 200,
      onCell: (record) => {
        if (record.type === 'average') {
          return { colSpan: 0 }
        }
        return {
          className: record.isTotal ? 'font-medium' : '' // Bold for total rows
        }
      }
    },
    {
      title: 'Tỉ trọng',
      dataIndex: 'weight',
      width: 100,
      align: 'right',
      onCell: (record) => ({
        className: record.isTotal ? 'font-medium' : '' // Bold for total rows
      }),
      render: (weight, record) => {
        if (record.type === 'average') return '100.0%'
        return weight ? `${weight.toFixed(1)}%` : ''
      }
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      width: 100,
      align: 'right',
      onCell: (record) => ({
        className: `${record.isTotal ? 'font-medium' : ''} ${getScoreClassName(record.score, record.completionCriteria)}`
      }),
      render: (score, record) => {
        return (
          <span>
            {score.toFixed(2)}
          </span>
        );
      },
    },
  ];

  const getOverallStatus = () => {
    const averageScore = scoreData.find(item => item.key === 'average')?.score.toFixed(2);
    const passed = averageScore >= 5.0
    return {
      status: passed ? "success" : "exception",
      label: passed ? "Đạt" : "Không đạt",
      percent: percentCourseProgress,
      score: averageScore
    }
  }

  const status = getOverallStatus()

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <Progress
            type="circle"
            percent={status.percent}
            status={status.status}
            format={() => (
              <span className={`fw-bold ${status.status === 'exception' ? 'fs-4' : 'fs-7'}`}>
                {status.label}
              </span>
            )}          
            size={100}
          />
          <div>
            <div style={{ color: '#666' }}>Tên lớp: {className}</div>
            <div className="fs-6 fw-medium">Điểm trung bình: {status.score}</div>
            {certification && (
              <Button type="link" className="p-0" onClick={handleNavigateToCertificate}>Xem chứng chỉ</Button>
            )}
          </div>
        </div>

        <h5 className="card-title">Điểm quá trình</h5>
        <StyledTable
          columns={columns}
          dataSource={scoreData}
          pagination={false}
          bordered
        />
      </div>
    </div>
  );
};

export default ScoreClass;

