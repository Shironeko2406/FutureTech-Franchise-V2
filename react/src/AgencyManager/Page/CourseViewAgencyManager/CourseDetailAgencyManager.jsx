
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetCourseByIdActionAsync } from "../../../Redux/ReducerAPI/CourseReducer.jsx";
import ViewSyllabus from "../../Component/ViewSyllabus.jsx";
import ViewSession from "../../Component/ViewSession.jsx";
import ViewChapter from "../../Component/ViewChapter.jsx";
import ViewAssessment from "../../Component/ViewAssessment.jsx";
import { useLoading } from "../../../Utils/LoadingContext.jsx";

const CourseDetailAgencyManager = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        dispatch(GetCourseByIdActionAsync(id)).finally(() => setLoading(false));
    }, [id]);

    return (
        <div>
            <ViewSyllabus />
            <ViewChapter />
            <ViewSession />
            <ViewAssessment />
        </div>
    );
};

export default CourseDetailAgencyManager;