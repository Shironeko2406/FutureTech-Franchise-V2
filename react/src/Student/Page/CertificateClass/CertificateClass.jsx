import { Card, Typography, Row, Col, Space, Image } from "antd";
import styled from "styled-components";
import React from "react";
import PDFViewer from 'pdf-viewer-reactjs';

const { Title, Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const LeftSection = styled.div`
  background: #f0f8ff;
  padding: 25px;
  border-radius: 12px;
  height: 100%;
`;

const PDFContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: white;
`;

const StyledAvatar = styled.div`
  position: relative;
  margin-bottom: 28px;
  width: fit-content;

  .avatar-image {
    border-radius: 50%;
    border: 3px solid #1890ff;
  }
`;

const CourseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 12px 0;
    position: relative;
    padding-left: 24px;
    font-size: 15px;
    line-height: 1.6;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1890ff;
      font-weight: bold;
    }
  }
`;

const StyledTitle = styled(Title)`
  &.ant-typography {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: -0.5px;
  }
`;

const CertificateClass = () => {
  const pdfUrl = "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/contracts%2FHuyH2511_L%E1%BA%ADp%20tr%C3%ACnh%20C%C6%A1%20b%E1%BA%A3n%20Java_24%2F02%2F2025%2012%3A00%3A00%20AM?alt=media&token=4af74fef-3536-40a1-917d-041bd5c7e5d5";

  const courseModules = [
    "Khởi tạo và Lập kế hoạch Dự án",
    "Lập ngân sách và Lịch trình Dự án",
    "Quản lý Rủi ro và Thay đổi Dự án",
    "Dự án Quản lý Dự án"
  ];

  return (
    <StyledCard>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <LeftSection>
            <StyledAvatar>
              <Image
                className="avatar-image"
                src="/placeholder.svg?height=80&width=80"
                alt="Nguyễn Trung Hiếu"
                width={80}
                height={80}
                preview={false}
              />
            </StyledAvatar>
            
            <StyledTitle level={3}>Hoàn thành bởi Nguyễn Trung Hiếu</StyledTitle>
            <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '8px' }}>
              12 Tháng 1, 2024
            </Paragraph>
            <Paragraph style={{ fontSize: '15px', color: '#666' }}>
              Khoảng 1 tháng với 10 giờ mỗi tuần để hoàn thành
            </Paragraph>

            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '32px' }}>
              <div>
                <StyledTitle level={4} style={{ marginBottom: '16px' }}>
                  Chứng chỉ khóa học đã hoàn thành
                </StyledTitle>
                <CourseList>
                  {courseModules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </CourseList>
              </div>
            </Space>

            <Paragraph style={{ marginTop: '32px', fontSize: '14px', color: '#666' }}>
              Tài khoản của Nguyễn Trung Hiếu đã được xác minh. Coursera chứng nhận việc hoàn thành thành công chương trình Chuyên môn Quản lý Dự án của Đại học California, Irvine.
            </Paragraph>
          </LeftSection>
        </Col>
        <Col xs={24} lg={16}>
          <PDFContainer>
            <PDFViewer
              document={{
                url: `${pdfUrl}`,
              }}
              hideNavbar={true}
            />
          </PDFContainer>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default CertificateClass;

