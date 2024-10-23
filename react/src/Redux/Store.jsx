import { configureStore } from "@reduxjs/toolkit";
import AuthenticationReducer from "./ReducerAPI/AuthenticationReducer";
import ConsultationReducer from "./ReducerAPI/ConsultationReducer";
import UserReducer from "./ReducerAPI/UserReducer";
import ClassScheduleReducer from "./ReducerAPI/ClassScheduleReducer";
import CourseCategoryReducer from "./ReducerAPI/CourseCategoryReducer";
import NotificationReducer from "./ReducerAPI/NotificationReducer";
import SlotReducer from "./ReducerAPI/SlotReducer";
import CourseReducer from "./ReducerAPI/CourseReducer";
import ClassReducer from "./ReducerAPI/ClassReducer";

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
    ClassReducer,
  },
});
