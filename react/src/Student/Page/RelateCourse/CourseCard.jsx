import React from "react";
import { Card, Typography, Button, Space } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getDataJSONStorage } from "../../../Utils/UtilsFunction";
import { USER_LOGIN } from "../../../Utils/Interceptors";

const { Text } = Typography;

const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;

  .ant-card-cover {
    margin: 0;
    overflow: hidden;
  }
  .ant-card-body {
    padding: 16px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    img {
      transform: scale(1.1);
    }
  }
`;

const CourseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
`;

const CourseTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 16px 0;
  display: block;
`;

const PriceTag = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
`;

const LessonCount = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
`;

const ButtonGroup = styled(Space)`
  margin-top: 16px;
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
`;

const RegisterButton = styled(Button)`
  background-color: #1890ff;
  border-radius: 20px;
  height: 40px;
  padding: 0 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const DetailsButton = styled(Button)`
  border-radius: 20px;
  height: 40px;
  padding: 0 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const CourseCard = ({ course }) => {
  const navigate = useNavigate()

  const handleRegisCourse = (course) => {
    const dataUser = getDataJSONStorage(USER_LOGIN)
    const registrationData = {
        studentName: dataUser.fullName,
        email: dataUser.email,
        phoneNumber: dataUser.phoneNumber,
        agencyId: dataUser.agencyId,
        courseId: course.id,
        courseName: course.name,
    }
    
    navigate('/student/register-course', { state: { registrationData } });
  }

  return (
    <StyledCard hoverable cover={<CourseImage src={course.urlImage} alt={course.name} />}>
      <CourseTitle>{course.name}</CourseTitle>
      <Space direction="vertical" size={4}>
        <PriceTag>{course.price.toLocaleString()} đ</PriceTag>
        <LessonCount>{course.numberOfLession} bài học</LessonCount>
      </Space>
      <ButtonGroup>
        <RegisterButton type="primary"  onClick={() => handleRegisCourse(course)}>
          Đăng ký ngay
        </RegisterButton>
        <DetailsButton type="default">
          Chi tiết
        </DetailsButton>
      </ButtonGroup>
    </StyledCard>
  );
};

export default CourseCard;

