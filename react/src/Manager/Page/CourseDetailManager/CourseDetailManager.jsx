import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetCourseByIdActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import ViewSyllabus from "../../Component/ViewSyllabus";
import ViewSession from "../../Component/ViewSession";
import ViewChapter from "../../Component/ViewChapter";
import ViewAssessment from "../../Component/ViewAssessment";
import ViewMaterialCourse from "../../Component/ViewMaterialCourse";


const CourseDetailManager = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    dispatch(GetCourseByIdActionAsync(id));
  }, [id]);

  return (
    <div>
      <ViewSyllabus/>
      {/*Thêm các card component khác*/}
      <ViewSession/>
      <ViewChapter/>
      <ViewAssessment/>
      <ViewMaterialCourse/>
    </div>
  );
};

export default CourseDetailManager;
