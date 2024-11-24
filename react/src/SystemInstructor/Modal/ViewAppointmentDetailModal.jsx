import React from 'react'
import { Modal, Typography, Space, Tag, Avatar, Card, Tabs} from 'antd'
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TeamOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import DOMPurify from 'dompurify';

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

const ParticipantTag = styled(Tag)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 16px;
`

const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
  }
`;

export default function ViewAppointmentDetailModal({ visible, onClose }) {
  const { appointmentDetail } = useSelector((state) => state.AppointmentReducer);

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

    const sanitizeHTML = (html) => {
      return {
        __html: DOMPurify.sanitize(html)
      };
    };

    const renderParticipants = () => {
      const user = appointmentDetail.user || []
      return (
        <div className='d-flex flex-wrap gap-2 mb-3'>
        {user.map((user) => (
          <ParticipantTag key={user.id} color="blue">
            <Avatar size="small">{user.username?.[0] || '?'}</Avatar>
            <span>{user.fullName}</span>
          </ParticipantTag>
        ))}
      </div>
      )
    }
      
    return (
      <StyledModal
        open={visible}
        onCancel={onClose}
        footer={null}
        title={
          <Space direction="vertical" size={0}>
            <Title level={4}>{appointmentDetail.title || 'Untitled Appointment'}</Title>
            <Tag color={appointmentDetail.type === 'Internal' ? 'blue' : 'green'}>
              {appointmentDetail.type || 'Unspecified'}
            </Tag>
          </Space>
        }
        width={650}
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
                      <Text>{formatDate(appointmentDetail.startTime)}</Text>
                    </Space>
                  </DetailItem>
                  <DetailItem>
                    <IconWrapper><ClockCircleOutlined /></IconWrapper>
                    <Space direction="vertical" size={0}>
                      <Text strong>Kết thúc:</Text>
                      <Text>{formatDate(appointmentDetail.endTime)}</Text>
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
                      {appointmentDetail?.description ? (
                        <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(appointmentDetail.description)} />
                      ) : (
                        <Text>Không có mô tả</Text>
                      )}
                    </Space>
                  </DetailItem>
                  <DetailItem>
                    <IconWrapper><FileTextOutlined /></IconWrapper>
                    <Space direction="vertical" size={0}>
                      <Text strong>Báo cáo:</Text>
                      <Text>{appointmentDetail.report || 'No report available'}</Text>
                      {appointmentDetail.reportImageURL && (
                        <a href={appointmentDetail.reportImageURL} target="_blank" rel="noopener noreferrer">
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
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                     <TeamOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                     <Text strong>Danh sách người tham gia:</Text>
                    </Space>
                    {renderParticipants()}
                  </Space>
              </StyledCard>
              ),
            },
          ]}
        />
      </StyledModal>
    )
  }