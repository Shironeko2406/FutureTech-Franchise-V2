import React, { useEffect, useState } from "react";
import { useLoading } from "../../../Utils/LoadingContext";
import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCoursesAvailableActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { Card, Typography, Input, Select, Row, Col, Button } from "antd";
import { ClusterOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import CourseCard from "./CourseCard";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const CourseGrid = styled(Row)`
  margin-top: 24px;
`;

// const course = [
//   {
//       "id": "5213543a-2cf5-4241-edbf-08dd2efcf775",
//       "name": "Lập trình Cơ bản C++",
//       "description": "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về các hệ cơ sở dữ liệu, bao gồm các khái niệm cơ bản, thiết kế cơ sở dữ liệu, ngôn ngữ truy vấn và tối ưu hóa cơ sở dữ liệu.",
//       "urlImage": "https://firebasestorage.googleapis.com/v0/b/cavisproject.appspot.com/o/Course%20Images%2Fimage_c2c5d691850c4b728435b10d05005813.png?alt=media&token=6db260af-a08f-45b5-9234-6e492e0dcb5b",
//       "numberOfLession": 7,
//       "price": 3200000,
//       "code": "PRF111",
//       "version": 3,
//       "status": "AvailableForFranchise",
//       "courseCategoryId": "f8fd80dd-c470-4ecf-7940-08dcf20adbbc",
//       "courseCategoryName": null
//   },
//   {
//     "id": "5213543a-2cf5-4241-edbf-08dd2efcf75",
//     "name": "Lập trình Cơ bản C++",
//     "description": "Khóa học cung cấp kiến thức từ cơ bản đến nâng cao về các hệ cơ sở dữ liệu, bao gồm các khái niệm cơ bản, thiết kế cơ sở dữ liệu, ngôn ngữ truy vấn và tối ưu hóa cơ sở dữ liệu.",
//     "urlImage": "https://firebasestorage.googleapis.com/v0/b/cavisproject.appspot.com/o/Course%20Images%2Fimage_c2c5d691850c4b728435b10d05005813.png?alt=media&token=6db260af-a08f-45b5-9234-6e492e0dcb5b",
//     "numberOfLession": 7,
//     "price": 3200000,
//     "code": "PRF111",
//     "version": 3,
//     "status": "AvailableForFranchise",
//     "courseCategoryId": "f8fd80dd-c470-4ecf-7940-08dcf20adbbc",
//     "courseCategoryName": null
// }
// ]

const RelateCourse = () => {
  const { setLoading } = useLoading();
  const dispatch = useDispatch();
  const { courseCategory } = useSelector((state) => state.CourseCategoryReducer);
  const { course } = useSelector((state) => state.CourseReducer);

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(GetCourseCategoryActionAsync());
    dispatch(GetAllCoursesAvailableActionAsync());
  }, [dispatch]);

  useEffect(() => {
    filterCourses();
  }, [course, searchTerm, selectedCategory]);

  const filterCourses = () => {
    let filtered = course;

    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (course) => course.courseCategoryId === selectedCategory
      );
    }

    setFilteredCourses(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  return (
    <StyledCard>
      <Title level={3}>
        <ClusterOutlined /> Khóa học liên quan
      </Title>
      <FilterContainer>
        <Search
          placeholder="Tìm kiếm khóa học"
          onSearch={handleSearch}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Chọn danh mục"
          onChange={handleCategoryChange}
        >
          <Option value="">Tất cả</Option>
          {courseCategory.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </FilterContainer>
      <CourseGrid gutter={[16, 16]}>
        {filteredCourses.map((course) => (
          <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
            <CourseCard course={course} />
          </Col>
        ))}
      </CourseGrid>
    </StyledCard>
  );
};

export default RelateCourse;

