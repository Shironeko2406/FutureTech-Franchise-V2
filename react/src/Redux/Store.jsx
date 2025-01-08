import { configureStore } from "@reduxjs/toolkit";
import AuthenticationReducer from "./ReducerAPI/AuthenticationReducer";
import ConsultationReducer from "./ReducerAPI/ConsultationReducer";
import UserReducer from "./ReducerAPI/UserReducer";
import ClassScheduleReducer from "./ReducerAPI/ClassScheduleReducer";
import CourseCategoryReducer from "./ReducerAPI/CourseCategoryReducer";
import NotificationReducer from "./ReducerAPI/NotificationReducer";
import SlotReducer from "./ReducerAPI/SlotReducer";
import CourseReducer from "./ReducerAPI/CourseReducer";
import RegisterCourseReducer from "./ReducerAPI/RegisterCourseReducer";
import PaymentReducer from "./ReducerAPI/PaymentReducer";
import ClassReducer from "./ReducerAPI/ClassReducer";
import SyllabusReducer from "./ReducerAPI/SyllabusReducer";
import ChapterReducer from "./ReducerAPI/ChapterReducer";
import QuizReducer from "./ReducerAPI/QuizReducer";
import AttendanceReducer from "./ReducerAPI/AttendanceReducer";
import AgencyDashboardReducer from "./ReducerAPI/AgencyDashboardReducer";
import AssignmentReducer from "./ReducerAPI/AssignmentReducer";
import QuestionReducer from "./ReducerAPI/QuestionReducer";
import AgencyReducer from "./ReducerAPI/AgencyReducer";
import AppointmentReducer from "./ReducerAPI/AppointmentReducer";
import WorkReducer from "./ReducerAPI/WorkReducer";
import CityReducer from "./ReducerAPI/CityReducer";
import ContractReducer from "./ReducerAPI/ContractReducer";
import DocumentReducer from "./ReducerAPI/DocumentReducer";
import EquipmentReducer from "./ReducerAPI/EquipmentReducer";
import WorkTemplateReducer from "./ReducerAPI/WorkTemplateReducer";
import AppointmentTemplateReducer from "./ReducerAPI/AppointmentTemplateReducer";
import HomePageReducer from "./ReducerAPI/HomePageReducer";
import ReportReducer from "./ReducerAPI/ReportReducer";
import ChapterMaterialReducer from "./ReducerAPI/ChapterMaterialReducer";
import VideoReducer from "./ReducerAPI/VideoReducer";
import PackageReducer from "./ReducerAPI/PackageReducer";

export const store = configureStore({
  reducer: {
    number: (state = 1) => state,
    AuthenticationReducer,
    ConsultationReducer,
    UserReducer,
    ClassScheduleReducer,
    CourseCategoryReducer,
    NotificationReducer,
    SlotReducer,
    CourseReducer,
    RegisterCourseReducer,
    PaymentReducer,
    ClassReducer,
    SyllabusReducer,
    ChapterReducer,
    QuizReducer,
    AttendanceReducer,
    AgencyDashboardReducer,
    AssignmentReducer,
    QuestionReducer,
    AgencyReducer,
    AppointmentReducer,
    WorkReducer,
    CityReducer,
    ContractReducer,
    DocumentReducer,
    EquipmentReducer,
    WorkTemplateReducer,
    AppointmentTemplateReducer,
    HomePageReducer,
    ReportReducer,
    ChapterMaterialReducer,
    VideoReducer,
    PackageReducer,
  },
});
