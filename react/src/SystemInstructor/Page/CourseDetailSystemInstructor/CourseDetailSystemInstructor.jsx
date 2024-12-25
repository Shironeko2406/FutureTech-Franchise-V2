import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetCourseByIdActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import ViewSyllabus from "../../Components/ViewSyllabus";
import { useLoading } from "../../../Utils/LoadingContext";
import ViewChapter from "../../Components/ViewChapter";
import ViewAssessment from "../../Components/ViewAssessment";
import ViewMaterialCourse from "../../Components/ViewMaterialCourse";


const CourseDetailSystemInstructor = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const {setLoading} = useLoading()

  useEffect(() => {
    setLoading(true);
    dispatch(GetCourseByIdActionAsync(id)).finally(() => setLoading(false));
  }, [id]);

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

export default CourseDetailSystemInstructor;
