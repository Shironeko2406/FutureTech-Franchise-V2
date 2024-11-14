
import React from 'react'
import { Card, Row, Col, Typography, Statistic, Button, List, Calendar } from 'antd'
import { BookOutlined, TeamOutlined, ScheduleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const { Title } = Typography

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const WelcomeCard = styled(StyledCard)`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
`

const StyledCalendar = styled(Calendar)`
  .ant-picker-calendar-date-content {
    height: 60px;
  }
`

const QuickLinkButton = styled(Button)`
  height: 100px;
  width: 100%;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const recentClasses = [
  { id: 1, name: 'Introduction to React' },
  { id: 2, name: 'Advanced JavaScript' },
  { id: 3, name: 'Web Design Fundamentals' },
]

export default function HomeInstructor() {
  return (
    <div>
      <WelcomeCard>
        <Title level={2} style={{ color: 'white', marginBottom: 0 }}>
          Chào mừng , Giảng viên
        </Title>
      </WelcomeCard>

      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <StyledCard>
            <Statistic title="Tổng số lớp" value={5} prefix={<BookOutlined />} />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12}>
          <StyledCard>
            <Statistic title="Tổng số học sinh" value={120} prefix={<TeamOutlined />} />
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <StyledCard title="Quản lý">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Link to="/instructor/schedules">
                  <QuickLinkButton type="primary" icon={<ScheduleOutlined />}>
                    Xem lịch dạy
                  </QuickLinkButton>
                </Link>
              </Col>
              <Col span={12}>
                <Link to="/instructor/schedules">
                  <QuickLinkButton icon={<TeamOutlined />}>
                    Điểm danh
                  </QuickLinkButton>
                </Link>
              </Col>
            </Row>
          </StyledCard>

          <StyledCard title="Các lớp hiện tại">
            <List
              dataSource={recentClasses}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/instructor/class/${item.id}`}>{item.name}</Link>
                </List.Item>
              )}
            />
          </StyledCard>
        </Col>
        <Col xs={24} lg={8}>
          <StyledCard title="Lịch">
            <StyledCalendar fullscreen={false} />
          </StyledCard>
        </Col>
      </Row>
    </div>
  )
}