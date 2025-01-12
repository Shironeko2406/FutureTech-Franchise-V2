import { Card, Typography, Row, Col, Space, Image, Button } from "antd"
import styled from "styled-components"
import PDFViewer from "pdf-viewer-reactjs"
import { useLocation, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { DownloadOutlined } from "@ant-design/icons"
import { calculateDuration, formatDate } from "../../../Utils/FormatDate"

const { Title, Text, Paragraph } = Typography

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: white;
  
  .ant-card-body {
    padding: 32px;
  }
`

const UserInfoSection = styled.div`
  background: #f5f7fa;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e6e8eb;
  transition: all 0.3s ease;
  margin-bottom: 32px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`

const PDFContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  min-height: 600px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  background: white;
  border: 1px solid #e6e8eb;
  cursor: pointer
`

const StyledAvatar = styled.div`
  position: relative;
  margin-bottom: 32px;
  width: fit-content;

  .avatar-image {
    border-radius: 50%;
    border: 4px solid #1890ff;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`

const CourseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 14px 0;
    position: relative;
    padding-left: 28px;
    font-size: 16px;
    line-height: 1.6;
    color: #666;
    transition: all 0.2s ease;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1890ff;
      font-weight: bold;
      font-size: 20px;
    }

    &:hover {
      color: #333;
      padding-left: 32px;
    }
  }
`

const StyledTitle = styled(Title)`
  &.ant-typography {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.5px;
    margin-bottom: 16px;
  }
`

const CompletionBadge = styled.div`
  background: rgba(82, 196, 26, 0.15);
  color: #52c41a;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 24px;
`

const DownloadButton = styled(Button)`
  margin-top: 16px;
`

const CertificateClass = () => {
  const { userLogin } = useSelector((state) => state.AuthenticationReducer);
  const location = useLocation();
  const {className} = useParams()
  const { certification, scoreData, courseName, currentClass } = location.state;
  const totals = scoreData.filter(item => item.isTotal );

  const handleDownload = async () => {
    try {
      const response = await fetch(certification);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${userLogin.fullName}_Certificate.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  
  return (
    <StyledCard>
      <UserInfoSection>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <StyledAvatar>
              <Image
                className="avatar-image"
                src={userLogin.urlImage || "/assets/images/profile/user-1.jpg"}
                alt="Student Avatar"
                width={96}
                height={96}
                preview={false}
              />
            </StyledAvatar>
            
            <CompletionBadge>Đã hoàn thành</CompletionBadge>
            
            <StyledTitle level={3}>Hoàn thành bởi {userLogin.fullName}</StyledTitle>
            <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              {formatDate(currentClass.startDate)}
            </Text>
            <Text style={{ fontSize: '15px', color: "#666", display: 'block' }}>
              Khoảng {calculateDuration(currentClass.startDate, currentClass.endDate)} để hoàn thành
            </Text>
            <DownloadButton type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>Tải chứng chỉ</DownloadButton>
          </Col>
          <Col xs={24} md={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <StyledTitle level={4}>
                  Chứng chỉ khóa học đã hoàn thành
                </StyledTitle>
                <CourseList>
                  {totals.map((item, index) => (
                    <li key={index}>
                    {item.category}: {item.score}/10 {item.weight && `(${item.weight}%)`}
                  </li>
                  ))}
                </CourseList>
              </div>
            </Space>

            <Paragraph style={{ 
              marginTop: '24px', 
              fontSize: '14px', 
              color: '#666',
              padding: '16px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #e6e8eb'
            }}>
              Tài khoản của {userLogin.fullName} đã được xác minh. Trung tâm IT FutureTech chứng nhận việc hoàn thành thành công chương trình {courseName} của lớp học {className}.
            </Paragraph>
          </Col>
        </Row>
      </UserInfoSection>
      
      <PDFContainer onClick={() => window.open(certification, '_blank')}>
        <PDFViewer
          document={{
            url: certification,
          }}
          hideNavbar={true}
        />

      </PDFContainer>
    </StyledCard>
  )
}

export default CertificateClass

