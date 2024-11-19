import React from 'react'
import { Modal, Typography, Space, Tag, Avatar, Card, Tabs, Tooltip, Button } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TeamOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const { Title, Text } = Typography

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  .ant-modal-body {
    padding: 0;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
`

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
`

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`

const IconWrapper = styled.span`
  margin-right: 8px;
  font-size: 18px;
  color: #1890ff;
`

const UserList = styled.div`
  display: flex;
  align-items: center;
`

const AvatarGroup = styled.div`
  display: flex;
  margin-right: 8px;
`

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  &:not(:first-child) {
    margin-left: -8px;
  }
`

const AddButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`

const appointmentData = { //appointmentDate là init state call api ban đầu sẽ là {} lấy từ useSelector từ redux
  "title": "Họp giao ban",
  "startTime": "2024-11-19T11:47:29.039Z",
  "endTime": "2024-11-19T13:47:29.039Z",
  "description": "Trao đổi báo cáo",
  "report": "Báo cáo doanh thu",
  "reportImageURL": "https://report-1.com",
  "type": "Internal",
  "user": [
    { "userId": "1", "name": "Tín", "username": "Trung Tín" },
    { "userId": "2", "name": "Hiếu", "username": "Trung Hiếu" },
    { "userId": "3", "name": "Hoàng", "username": "Minh Hoàng" },
    { "userId": "4", "name": "Linh", "username": "Thùy Linh" },
    { "userId": "5", "name": "Hương", "username": "Thu Hương" }
  ]
}

export default function ViewAppointmentDetail({ visible, onClose }) {
    const formatDate = (dateString) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
  
    const renderAvatars = () => {
      const users = appointmentData.user || [];
      const visibleUsers = users.slice(0, 3);
      const remainingUsers = users.slice(3);
  
      return (
        <AvatarGroup>
          {visibleUsers.map((user) => (
            <Tooltip key={user.userId} title={user.username}>
              <StyledAvatar>{user.name?.[0] || '?'}</StyledAvatar>
            </Tooltip>
          ))}
          {remainingUsers.length > 0 && (
            <Tooltip
              title={
                <div>
                  {remainingUsers.map((user) => (
                    <div key={user.userId}>{user.username}</div>
                  ))}
                </div>
              }
            >
              <StyledAvatar style={{ backgroundColor: '#1890ff' }}>
                +{remainingUsers.length}
              </StyledAvatar>
            </Tooltip>
          )}
        </AvatarGroup>
      );
    };
  
    return (
      <StyledModal
        open={visible}
        onCancel={onClose}
        footer={null}
        title={
          <Space direction="vertical" size={0}>
            <Title level={4}>{appointmentData.title || 'Untitled Appointment'}</Title>
            <Tag color={appointmentData.type === 'Internal' ? 'blue' : 'green'}>
              {appointmentData.type || 'Unspecified'}
            </Tag>
          </Space>
        }
        width={600}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Thông tin',
              children: (
                <StyledCard>
                  <DetailItem>
                    <IconWrapper><CalendarOutlined /></IconWrapper>
                    <Space direction="vertical" size={0}>
                      <Text strong>Bắt đầu:</Text>
                      <Text>{formatDate(appointmentData.startTime)}</Text>
                    </Space>
                  </DetailItem>
                  <DetailItem>
                    <IconWrapper><ClockCircleOutlined /></IconWrapper>
                    <Space direction="vertical" size={0}>
                      <Text strong>Kết thúc:</Text>
                      <Text>{formatDate(appointmentData.endTime)}</Text>
                    </Space>
                  </DetailItem>
                </StyledCard>
              ),
            },
            {
              key: '2',
              label: 'Nội dung',
              children: (
                <StyledCard>
                  <DetailItem>
                    <IconWrapper><FileTextOutlined /></IconWrapper>
                    <Space direction="vertical" size={0}>
                      <Text strong>Mô tả:</Text>
                      <Text>{appointmentData.description || 'No description provided'}</Text>
                    </Space>
                  </DetailItem>
                  <DetailItem>
                    <IconWrapper><FileTextOutlined /></IconWrapper>
                    <Space direction="vertical" size={0}>
                      <Text strong>Báo cáo:</Text>
                      <Text>{appointmentData.report || 'No report available'}</Text>
                      {appointmentData.reportImageURL && (
                        <a href={appointmentData.reportImageURL} target="_blank" rel="noopener noreferrer">
                          <LinkOutlined /> Xem thêm
                        </a>
                      )}
                    </Space>
                  </DetailItem>
                </StyledCard>
              ),
            },
            {
              key: '3',
              label: 'Người tham gia',
              children: (
                <StyledCard>
                  <DetailItem>
                    <IconWrapper><TeamOutlined /></IconWrapper>
                    <UserList>
                      {renderAvatars()}
                      <AddButton icon={<PlusOutlined />} />
                    </UserList>
                  </DetailItem>
                </StyledCard>
              ),
            },
          ]}
        />
      </StyledModal>
    )
  }