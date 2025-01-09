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

