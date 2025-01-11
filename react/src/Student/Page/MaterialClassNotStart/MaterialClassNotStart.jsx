import { BookOutlined, HomeOutlined, LockOutlined } from '@ant-design/icons'
import { Breadcrumb, Card, Typography, Result, Button } from 'antd'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const { Title, Text } = Typography

const MaterialClassNotStart = () => {
  const { className } = useParams()
  const navigate = useNavigate()

  return (
    <Card>
      <Breadcrumb
        style={{ marginBottom: 24 }}
        items={[
          { title: <><HomeOutlined /> <span>Trang chủ</span></>, href: "/student" },
          { title: <><BookOutlined /> <span>{className}</span></> },
        ]}
      />

      <Result
        icon={<LockOutlined style={{ color: '#1890ff' }} />}
        title={<Title level={3}>Khóa học chưa đến thời gian truy cập</Title>}
        subTitle={
          <Text style={{ fontSize: 16 }}>
            Vui lòng quay lại sau khi khóa học bắt đầu
          </Text>
        }
        extra={
          <Button type="primary" onClick={() => navigate('/student')}>
            Quay lại trang chủ
          </Button>
        }
      />
    </Card>
  )
}

export default MaterialClassNotStart

