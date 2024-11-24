import React, { useEffect } from "react";
import SkillRoadmap from "../../Component/SkillRoadmap";
import DetailRoadmap from "../../Component/DetailRoadmap";
import ViewTests from "../../Component/ViewTests";
import { useDispatch } from "react-redux";
import { GetQuizByClassIdStudentActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import { useParams } from "react-router-dom";
import { useLoading } from "../../../Utils/LoadingContext";

const ClassDetailStudent = () => {
  const dispatch = useDispatch();
  const {id} = useParams()
  const {setLoading} = useLoading()


  useEffect(()=>{
    setLoading(true)
    dispatch(GetQuizByClassIdStudentActionAsync(id)).finally(() => setLoading(false))
  },[])

  return (
    <div>
      {/* <SkillRoadmap />
      <DetailRoadmap/> */}
      <ViewTests/>
    </div>
  );
};

export default ClassDetailStudent;

