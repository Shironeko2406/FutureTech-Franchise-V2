import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetCourseByIdActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import ViewSyllabus from "../../Component/ViewSyllabus";
import ViewSession from "../../Component/ViewSession";
import ViewChapter from "../../Component/ViewChapter";
import ViewAssessment from "../../Component/ViewAssessment";
import ViewMaterialCourse from "../../Component/ViewMaterialCourse";
import { useLoading } from "../../../Utils/LoadingContext";


const CourseDetailManager = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { setLoading } = useLoading()

  useEffect(() => {
    setLoading(true);
    dispatch(GetCourseByIdActionAsync(id)).finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <ViewSyllabus />
      {/*Thêm các card component khác*/}
      <ViewChapter />
      <ViewSession />
      <ViewAssessment />
      {/* <ViewMaterialCourse/> */}
    </div>
  );
};

export default CourseDetailManager;
