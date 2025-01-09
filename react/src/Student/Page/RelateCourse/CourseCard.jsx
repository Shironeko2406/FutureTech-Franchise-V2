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




"use client"

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

  // Check if student is currently enrolled in this course
  const enrolledClass = classOfUserLogin.find((classItem) => classItem.courseId === course.id)

  // Check if there's any time conflict with other classes
  const hasTimeConflict = () => {
    if (!enrolledClass) return false

    const currentDate = new Date()
    const classStartDate = new Date(enrolledClass.startDate)
    const classEndDate = new Date(enrolledClass.endDate)

    return currentDate >= classStartDate && currentDate <= classEndDate
  }

  const isEnrolled = Boolean(enrolledClass)
  const isInActiveClass = hasTimeConflict()

  const getEnrollmentStatus = () => {
    if (isEnrolled) {
      if (isInActiveClass) {
        return {
          tag: "Đang học",
          color: "#87d068", // Green for active
          buttonText: "Đã đăng ký",
          canRegister: false
        }
      } else {
        return {
          tag: "Đã hoàn thành",
          color: "#2db7f5", // Blue for completed
          buttonText: "Đăng ký lại",
          canRegister: true
        }
      }
    }
    return {
      tag: "",
      color: "",
      buttonText: "Đăng ký ngay",
      canRegister: true
    }
  }

  const status = getEnrollmentStatus()

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
      {isEnrolled && (
        <Tooltip title={
          isInActiveClass 
            ? `Thời gian học: ${new Date(enrolledClass.startDate).toLocaleDateString('vi-VN')} - ${new Date(enrolledClass.endDate).toLocaleDateString('vi-VN')}`
            : "Khóa học đã kết thúc"
        }>
          <EnrollmentTag color={status.color}>
            {status.tag}
          </EnrollmentTag>
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

