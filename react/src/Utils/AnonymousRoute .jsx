import { Outlet, Navigate } from "react-router-dom";
import { getDataTextStorage, getDataJSONStorage } from "./UtilsFunction"; // Assuming you have this function for localStorage
import { TOKEN_AUTHOR, USER_LOGIN } from "./Interceptors"; // Assuming USER_LOGIN holds the user info

const AnonymousRoute = () => {
  const accessToken = getDataTextStorage(TOKEN_AUTHOR);
  const userLogin = getDataJSONStorage(USER_LOGIN); // Fetch the user data from storage

  if (accessToken && userLogin) {
    const role = userLogin?.role;

    // Redirect based on the role
    switch (role) {
      case "Administrator":
        return <Navigate to="/admin" replace />;
      case "AgencyManager":
        return <Navigate to="/agency-manager" replace />;
      case "Student":
        return <Navigate to="/student" replace />;
      case "Instructor":
        return <Navigate to="/instructor" replace />;
      case "Manager":
        return <Navigate to="/manager" replace />;
      case "SystemInstructor":
        return <Navigate to="/system-instructor" replace />;
      case "SystemConsultant":
        return <Navigate to="/system-consultant" replace />;
      case "AgencyStaff":
        return <Navigate to="/agency-staff" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Allow access to login/register routes if no user is logged in
  return <Outlet />;
};

export default AnonymousRoute;
