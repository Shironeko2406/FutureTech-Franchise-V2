import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../../../Utils/LoadingContext";
import { useDispatch } from "react-redux";
import { GetCourseByIdActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import ViewSyllabus from "../../Component/ViewSyllabus";
import ViewChapter from "../../Component/ViewChapter";
import ViewAssessment from "../../Component/ViewAssessment";

const CourseDetailOfClass = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Lấy query parameters từ URL
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const {setLoading} = useLoading()

  useEffect(() => {
    setLoading(true);
    dispatch(GetCourseByIdActionAsync(courseId)).finally(() => setLoading(false));
  }, [courseId])
  return (
    <div>
      <ViewSyllabus/>
      {/*Thêm các card component khác*/}
      <ViewChapter/>
      <ViewAssessment/>
      {/* <ViewMaterialCourse/> */}
    </div>
  );
  
};

export default CourseDetailOfClass;
