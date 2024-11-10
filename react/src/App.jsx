import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import Home from "./Admin/Page/Home/Home";
import { store } from "./Redux/Store";
import TempUI from "./Admin/TempUI/TempUI";
import Login from "./Admin/Page/Login/Login";
import Register from "./Admin/Page/Register/Register";
import FranchiseManagement from "./Admin/Page/FranchiseManagement/FranchiseManagement";
import ProtectedRoute from "./Utils/ProtectedRoute";
import AnonymousRoute from "./Utils/AnonymousRoute ";
import ForgotPassword from "./Admin/Page/ForgotPassword/ForgotPassword";
import ResetPassword from "./Admin/Page/ForgotPassword/ResetPassword";
import TempUIManager from "./Manager/TempUI/TempUIManager";
import HomeManager from "./Manager/Page/Home/HomeManager";
import ConsultationManagement from "./Manager/Page/ConsultationManagement/ConsultationManagement";
import TempUIStudent from "./Student/TempUI/TempUIStudent";
import HomeStudent from "./Student/Page/HomeStudent/HomeStudent";
import ClassDetailStudent from "./Student/Page/ClassDetailStudent/ClassDetailStudent";
import HomeStudentNoti from "./Student/Page/HomeStudentNoti";
import TempUIAgencyManager from "./AgencyManager/TempUIAgencyManager/TempUIAgencyManager";
import HomeAgencyManager from "./AgencyManager/Page/HomeAgencyManager/HomeAgencyManager";
import Profile from "./Admin/Page/Profile/Profile";
import ChangePassword from "./Student/Page/ChangePassword/ChangePassword";
import SlotManager from "./AgencyManager/Page/Slot/SlotManager";
import ScheduleStudent from "./Student/Page/Schedule/ScheduleStudent";
import CourseCategoryManager from "./Manager/Page/CourseCategory/CourseCategoryManager";
import CourseManage from "./Manager/Page/CorseManager/CourseManage";
import ScheduleInstructor from "./Instructor/Page/Schedule/ScheduleInstructor";
import StudentConsultationRegistration from "./AgencyManager/Page/StudentConsultationRegistration/StudentConsultationRegistration";
import StudentPaymentManagement from "./AgencyManager/Page/StudentPaymentManagement/StudentPaymentManagement";
import ClassManagement from "./AgencyManager/Page/ClassManagement/ClassManagement";
import ClassDetail from "./AgencyManager/Page/ClassManagement/ClassDetail";
import ScheduleAgencyManager from "./AgencyManager/Page/ScheduleManagement/ScheduleAgencyManager";
import CourseCategoryAdmin from "./Admin/Page/CourseCategory/CourseAdmin";
import CourseManageAdmin from "./Admin/Page/CourseManageAdmin/CourseManageAdmin";
import TempUIInstructor from "./Instructor/TempUIInstructor/TempUIInstructor";
import ScheduleTeaching from "./Instructor/Page/ScheduleTeaching/ScheduleTeaching";
import HomeInstructor from "./Instructor/Page/HomeInstructor/HomeInstructor";
import CourseDetailManager from "./Manager/Page/CourseDetailManager/CourseDetailManager";
import { LoadingProvider, useLoading } from "./Utils/LoadingContext";
import { Spin } from "antd";
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/es/locale/vi_VN';
import TempUISystemInstructor from "./SystemInstructor/TempUISystemInstructor/TempUISystemInstructor";
import HomeSystemInstructor from "./SystemInstructor/Page/HomeSystemInstructor/HomeSystemInstructor";
import CourseSystemInstructor from "./SystemInstructor/Page/CourseSystemInstructor/CourseSystemInstructor";
import CourseDetailSystemInstructor from "./SystemInstructor/Page/CourseDetailSystemInstructor/CourseDetailSystemInstructor";
import QuizTest from "./Student/Page/QuizTest/QuizTest";
import QuizDescription from "./Student/Page/QuizDescription/QuizDescription";
import AttendancePage from "./Instructor/Page/AttendancePage/AttendancePage";
import AgencyDashboardPage  from "./AgencyManager/Page/AgencyDashboard/AgencyDashboardpage";
import ClassDetailInstructor from "./Instructor/Page/ClassDetailInstructor/ClassDetailInstructor";
import QuizOfClass from "./Instructor/Page/QuizOfClass.jsx/QuizOfClass";

const LoadingOverlay = () => {
  const { loading } = useLoading();
  return loading ? (
    <div className="loading-overlay">
      <Spin size="large" />
    </div>
  ) : null;
};



function App() {
  return (
    <ConfigProvider locale={vi_VN}>
      <BrowserRouter>
        <Provider store={store}>
          <LoadingProvider>
            <LoadingOverlay />
            <Routes>
              <Route element={<AnonymousRoute />}>
                <Route path="" element={<Login></Login>} />
                <Route path="register" element={<Register></Register>} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route
                  path="forgot-password/reset-password"
                  element={<ResetPassword />}
                />
              </Route>
              <Route element={<ProtectedRoute requiredRole="Administrator" />}>
                <Route path="admin" element={<TempUI />}>
                  <Route path="" element={<Home />} />
                  <Route path="franchise" element={<FranchiseManagement />} />
                  <Route path="course-category" element={<CourseCategoryAdmin />} />
                  <Route path="course" element={<CourseManageAdmin />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="AgencyManager" />}>
                <Route path="agency-manager" element={<TempUIAgencyManager />} >
                  {/* <Route path="" element={<HomeAgencyManager />} /> */}
                  <Route path="student-consultation-registration" element={<StudentConsultationRegistration />} />
                  <Route path="student-payment" element={<StudentPaymentManagement />} />
                  <Route path="slots" element={<SlotManager />} />
                  <Route path="classes" element={<ClassManagement />} />
                  <Route path="classes/:id" element={<ClassDetail />} />
                  <Route path="schedules" element={<ScheduleAgencyManager />} />
                  <Route path="" element={<AgencyDashboardPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="Student" />}>
                <Route path="student" element={<TempUIStudent />}>
                  <Route path="" element={<HomeStudentNoti />} />
                  <Route path="class/:id" element={<ClassDetailStudent/>} />
                  <Route path="quiz" element={<QuizTest />} />
                  <Route path="quiz/:quizId" element={<QuizDescription />} />
                  <Route path="quiz/:quizId/start" element={<QuizTest />} />
                  <Route path="schedules" element={<ScheduleStudent />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="Instructor" />}>
                <Route path="instructor" element={<TempUIInstructor />}>
                  <Route path="class/:id" element={<ClassDetailInstructor />} />
                  <Route path="class/:id/quiz" element={<QuizOfClass/>} />
                  <Route path="" element={<HomeInstructor />} />
                  <Route path="schedule" element={<ScheduleTeaching />} />
                  <Route path="schedules" element={<ScheduleInstructor />} />
                  <Route path="schedules/attendances" element={<AttendancePage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="Manager" />}>
                <Route path="manager" element={<TempUIManager />}>
                  <Route path="" element={<HomeManager />} />
                  <Route path="consult" element={<ConsultationManagement />} />
                  <Route path="course-category" element={<CourseCategoryManager />} />
                  <Route path="course" element={<CourseManage />} />
                  <Route path="course-detail/:id" element={<CourseDetailManager />} />
                  <Route path="slot" element={<SlotManager />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requiredRole="SystemInstructor" />}>
                <Route path="system-instructor" element={<TempUISystemInstructor />}>
                  <Route path="" element={<HomeSystemInstructor />} />
                  <Route path="course" element={<CourseSystemInstructor />} />
                  <Route path="course-detail/:id" element={<CourseDetailSystemInstructor />} />

                </Route>
              </Route>

              {/*Test page */}
              <Route path="student-page" element={<TempUIStudent />}>
                <Route path="" element={<HomeStudent />} />
                <Route path="course-detail" element={<ClassDetailStudent />} />
              </Route>
            </Routes >
          </LoadingProvider >
        </Provider >
      </BrowserRouter >
    </ConfigProvider >
  );
}

export default App;
