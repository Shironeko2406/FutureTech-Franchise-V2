import React from 'react'
import { Modal, Typography, Space, Tag, Card, Tabs } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import DOMPurify from 'dompurify'

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

const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
  }
`

const ViewAppointmentDetailTemplateById = ({ visible, onClose, appointmentDetail }) => {
  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    }
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
            {appointmentDetail.type === 'Internal' ? 'Nội bộ' : 'Với bên liên quan'}
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
                    <Text strong>Số ngày giãn cách:</Text>
                    <Text>{appointmentDetail.startDaysOffset} ngày</Text>
                  </Space>
                </DetailItem>
                <DetailItem>
                  <IconWrapper><ClockCircleOutlined /></IconWrapper>
                  <Space direction="vertical" size={0}>
                    <Text strong>Thời lượng cuộc họp:</Text>
                    <Text>{appointmentDetail.durationHours} giờ</Text>
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
              </StyledCard>
            ),
          },
        ]}
      />
    </StyledModal>
  )
}

export default ViewAppointmentDetailTemplateById

