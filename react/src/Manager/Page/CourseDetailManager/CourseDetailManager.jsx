import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetCourseByIdActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import ViewSyllabus from "../../Component/ViewSyllabus";


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
    </div>
  );
};

export default CourseDetailManager;
