import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { Button, Card, Col, Descriptions, Row, Statistic, Typography, Space } from 'antd'
import { ClockCircleOutlined, FileTextOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import { GetQuizReviewByIdActionAsync } from '../../../Redux/ReducerAPI/QuizReducer'
import { useLoading } from '../../../Utils/LoadingContext'

const { Title, Paragraph } = Typography

const QuizDescription = ()  => {
  const dispatch = useDispatch()
  const { quizId } = useParams()
  const navigate = useNavigate()
  const {setLoading} = useLoading()
  const { quizReview } = useSelector((state) => state.QuizReducer)

  useEffect(() => {
    setLoading(true)
    dispatch(GetQuizReviewByIdActionAsync(quizId)).finally(() => setLoading(false))
  }, [dispatch, quizId])

  const startTime = moment(quizReview?.startTime)
  const duration = quizReview?.duration
  const endTime = startTime.clone().add(duration, 'minutes')
  const isBeforeStartTime = moment().isBefore(startTime)
  const isTimeExpired = moment().isAfter(endTime)

  const handleStartQuiz = () => {
    navigate(`/student/quiz/${quizId}/start`)
  }

  const handleBack = () => {
    navigate(`/student/class/${quizReview?.classId}`)
  }

  return (
    <Card className="quiz-description-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} className="text-center">
          {quizReview?.title || 'Không có dữ liệu'}
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Thời gian làm bài"
                value={quizReview?.duration || 'N/A'}
                suffix="phút"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Số câu hỏi"
                value={quizReview?.quantity || 'N/A'}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Thông tin chi tiết">
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Thời gian bắt đầu">
              {quizReview?.startTime ? startTime.format('DD/MM/YYYY, HH:mm') : 'Không xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              {quizReview?.startTime && quizReview?.duration
                ? endTime.format('DD/MM/YYYY, HH:mm')
                : 'Không xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Số lần làm">1</Descriptions.Item>
            {/* <Descriptions.Item label="Mã lớp">{quizReview?.classId || 'N/A'}</Descriptions.Item> */}
          </Descriptions>
        </Card>

        <Card title="Mô tả bài kiểm tra">
          <Paragraph>
            {quizReview?.description ? (
              quizReview.description.split('\n').map((line, index) => (
                <Paragraph key={index}>{line}</Paragraph>
              ))
            ) : (
              'Không có dữ liệu'
            )}
          </Paragraph>
        </Card>

        {quizReview?.scores ? (
          <Card>
            <Statistic
              title="Điểm số"
              value={(quizReview.scores.scoreNumber).toFixed(0)}
              suffix="/ 10"
              prefix={<TrophyOutlined />}
              valueStyle={{
                color: quizReview.scores.scoreNumber >= 5 ? '#3f8600' : '#cf1322',
              }}
            />
          </Card>
        ) : (
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            {isBeforeStartTime ? (
              <Paragraph strong type="warning">
                Chưa đến thời gian làm bài
              </Paragraph>
            ) : isTimeExpired ? (
              <Paragraph strong type="danger">
                Đã hết hạn
              </Paragraph>
            ) : (
              <Button type="primary" size="large" onClick={handleStartQuiz} icon={<UserOutlined />}>
                Vào kiểm tra
              </Button>
            )}
          </Space>
        )}

        <Button type="default" size="large" onClick={handleBack}>
          Trở lại
        </Button>
      </Space>
    </Card>
  )
}
export default QuizDescription;