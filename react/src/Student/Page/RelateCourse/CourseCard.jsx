// "use client"

// import React from "react"
// import { Card, Typography, Button, Space, Tag } from "antd"
// import styled from "styled-components"
// import { useNavigate } from "react-router-dom"
// import { getDataJSONStorage } from "../../../Utils/UtilsFunction"
// import { USER_LOGIN } from "../../../Utils/Interceptors"
// import { useSelector } from "react-redux"

// const { Text } = Typography

// const StyledCard = styled(Card)`
//   border-radius: 12px;
//   overflow: hidden;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   height: 100%;
//   transition: all 0.3s ease;
//   cursor: pointer;

//   .ant-card-cover {
//     margin: 0;
//     overflow: hidden;
//   }
//   .ant-card-body {
//     padding: 16px;
//   }

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

//     img {
//       transform: scale(1.1);
//     }
//   }
// `

// const CourseImage = styled.img`
//   width: 100%;
//   height: 200px;
//   object-fit: cover;
//   display: block;
//   transition: transform 0.3s ease;
// `

// const CourseTitle = styled(Text)`
//   font-size: 18px;
//   font-weight: 600;
//   color: #262626;
//   margin: 16px 0;
//   display: block;
// `

// const PriceTag = styled(Text)`
//   font-size: 20px;
//   font-weight: bold;
//   color: #1890ff;
// `

// const LessonCount = styled(Text)`
//   color: #8c8c8c;
//   font-size: 14px;
// `

// const ButtonGroup = styled(Space)`
//   margin-top: 16px;
//   width: 100%;
//   justify-content: flex-start;
//   gap: 8px;
// `

// const RegisterButton = styled(Button)`
//   background-color: #1890ff;
//   border-radius: 20px;
//   height: 40px;
//   padding: 0 24px;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: scale(1.05);
//   }
// `

// const DetailsButton = styled(Button)`
//   border-radius: 20px;
//   height: 40px;
//   padding: 0 24px;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: scale(1.05);
//   }
// `

// const EnrollmentTag = styled(Tag)`
//   position: absolute;
//   top: 12px;
//   right: 12px;
//   z-index: 1;
//   padding: 4px 12px;
//   border-radius: 12px;
//   font-weight: 500;
// `

// const CourseCard = ({ course }) => {
//   const navigate = useNavigate()
//   const { classOfUserLogin } = useSelector((state) => state.UserReducer)

//   const isEnrolled = classOfUserLogin.some((classItem) => classItem.courseId === course.id)

//   const handleRegisCourse = (course) => {
//     const dataUser = getDataJSONStorage(USER_LOGIN)
//     const registrationData = {
//       studentName: dataUser.fullName,
//       email: dataUser.email,
//       phoneNumber: dataUser.phoneNumber,
//       agencyId: dataUser.agencyId,
//       courseId: course.id,
//       courseName: course.name,
//     }

//     navigate("/student/register-course", { state: { registrationData } })
//   }

//   return (
//     <StyledCard hoverable cover={<CourseImage src={course.urlImage} alt={course.name} />}>
//       {isEnrolled && <EnrollmentTag color="#87d068">Đang học</EnrollmentTag>}
//       <CourseTitle>{course.name}</CourseTitle>
//       <Space direction="vertical" size={4}>
//         <PriceTag>{course.price.toLocaleString()} đ</PriceTag>
//         <LessonCount>{course.numberOfLession} bài học</LessonCount>
//       </Space>
//       <ButtonGroup>
//         <RegisterButton type="primary" onClick={() => handleRegisCourse(course)} disabled={isEnrolled}>
//           {isEnrolled ? "Đã đăng ký" : "Đăng ký ngay"}
//         </RegisterButton>
//         <DetailsButton type="default">Chi tiết</DetailsButton>
//       </ButtonGroup>
//     </StyledCard>
//   )
// }

// export default CourseCard





import React from "react"
import { Card, Typography, Button, Space, Tag, Tooltip } from "antd"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { getDataJSONStorage } from "../../../Utils/UtilsFunction"
import { USER_LOGIN } from "../../../Utils/Interceptors"
import { useSelector } from "react-redux"

const { Text } = Typography

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
`

const CourseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
`

const CourseTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 16px 0;
  display: block;
`

const PriceTag = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
`

const LessonCount = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
`

const ButtonGroup = styled(Space)`
  margin-top: 16px;
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
`

const RegisterButton = styled(Button)`
  background-color: #1890ff;
  border-radius: 20px;
  height: 40px;
  padding: 0 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const DetailsButton = styled(Button)`
  border-radius: 20px;
  height: 40px;
  padding: 0 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const EnrollmentTag = styled(Tag)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
`

const CourseCard = ({ course }) => {
  const navigate = useNavigate()
  const { classOfUserLogin } = useSelector((state) => state.UserReducer)

  // Check if there's any time conflict with other classes
  const hasTimeConflict = () => {
    const currentDate = new Date();
  
    // Lấy tất cả các lớp liên quan đến courseId
    const relatedClasses = classOfUserLogin.filter((classItem) => classItem.courseId === course.id);
  
    // Phân loại lớp theo trạng thái
    const activeClass = relatedClasses.find(
      (classItem) =>
        new Date(classItem.startDate) <= currentDate && new Date(classItem.endDate) >= currentDate
    );
    const upcomingClass = relatedClasses.find(
      (classItem) => new Date(classItem.startDate) > currentDate
    );
    const completedClasses = relatedClasses.filter(
      (classItem) => new Date(classItem.endDate) < currentDate
    );
  
    console.log(completedClasses)
    // Ưu tiên lớp đang học, sau đó lớp chưa bắt đầu
    if (activeClass) {
      return { status: "active", classData: activeClass };
    } else if (upcomingClass) {
      return { status: "notStarted", classData: upcomingClass };
    } else if (completedClasses.length > 0) {
      return { status: "completed", classData: completedClasses[0] }; // Lấy lớp hoàn thành gần nhất
    }
  
    return { status: "notEnrolled", classData: null }; // Không đăng ký
  };
  
  const getEnrollmentStatus = () => {
    const { status, classData } = hasTimeConflict();
  
    switch (status) {
      case "notStarted":
        return {
          tag: "Chưa bắt đầu",
          status: status,
          color: "#faad14", // Màu vàng
          buttonText: "Đã đăng ký",
          canRegister: false,
          classInfo: classData, // Lớp được chọn
        };
      case "active":
        return {
          tag: "Đang học",
          status: status,
          color: "#87d068", // Màu xanh lá
          buttonText: "Đã đăng ký",
          canRegister: false,
          classInfo: classData, // Lớp được chọn
        };
      case "completed":
        return {
          tag: "Đã hoàn thành",
          status: status,
          color: "#2db7f5", // Màu xanh dương
          buttonText: "Đăng ký lại",
          canRegister: true,
          classInfo: classData, // Lớp được chọn
        };
      default: // Trường hợp chưa đăng ký
        return {
          tag: "",
          color: "",
          buttonText: "Đăng ký ngay",
          canRegister: true,
          classInfo: null,
        };
    }
  };
  
  const status = getEnrollmentStatus();
  
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

    navigate("/student/register-course", { state: { registrationData } })
  }

  return (
    <StyledCard hoverable cover={<CourseImage src={course.urlImage} alt={course.name} />}>
      {status.classInfo && (
        <Tooltip
          title={
            status.status === "active"
              ? `Thời gian học: ${new Date(status.classInfo.startDate).toLocaleDateString(
                  "vi-VN"
                )} - ${new Date(status.classInfo.endDate).toLocaleDateString("vi-VN")}`
              : status.status === "notStarted"
              ? `Thời gian bắt đầu: ${new Date(status.classInfo.startDate).toLocaleDateString(
                  "vi-VN"
                )}`
              : "Khóa học đã kết thúc"
          }
        >
          <EnrollmentTag color={status.color}>{status.tag}</EnrollmentTag>
        </Tooltip>
      )}
      <CourseTitle>{course.name}</CourseTitle>
      <Space direction="vertical" size={4}>
        <PriceTag>{course.price.toLocaleString()} đ</PriceTag>
        <LessonCount>{course.numberOfLession} bài học</LessonCount>
      </Space>
      <ButtonGroup>
        <RegisterButton 
          type="primary" 
          onClick={() => handleRegisCourse(course)} 
          disabled={!status.canRegister}
        >
          {status.buttonText}
        </RegisterButton>
        <DetailsButton type="default">
          Chi tiết
        </DetailsButton>
      </ButtonGroup>
    </StyledCard>
  )
}

export default CourseCard

