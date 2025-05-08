import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getToken } from "./components/utils/decryptToken";

import Loader from "./components/Common/Pages/loader";
import { ProfilePage } from "./components/Screens/profile/profile";
import { AdminLoginPage } from "./components/Auth/adminLogin";
import { Dashboard } from "./components/Screens/Dashboard/dashboard";
import { EmployeeLoginPage } from "./components/Auth/employeeLogin";
import { ErrorPage } from "./components/Common/Pages/error404";
import { HomePage } from "./components/Auth/Home";
import { EmployeeRegisterPage } from "./components/Screens/Admin/employeeRegisterPage";
import AttendanceDetailsPage from "./components/Screens/Admin/attendancePage";
import EmployeeDetailsPage from "./components/Screens/Admin/employeePage";
import SalaryDetailsPage from "./components/Screens/Admin/salaryPage";
import {ReportPage} from "./components/Screens/Admin/reportPage";
import LeaveDetailsPage from "./components/Screens/Admin/LeavePage";
import { LeaveRequestPage } from "./components/Screens/Employee/leaveRequestPage";
import { LeaveStatusPage } from "./components/Screens/Employee/leaveStatusPage";
import SalaryStatusPage from "./components/Screens/Employee/salaryStatusPage";
import AttendanceStatusPage from "./components/Screens/Employee/attendanceStatusPage";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const decodeToken = async () => {
      try {
        setIsLoading(true);
        if (getToken) {
          const decoded = await jwtDecode(getToken);
          setUserRole(decoded.user.role);
        }
      } catch (error) {
        toast.error("please try to  login again");
      } finally {
        setIsLoading(false);
      }
    };

    decodeToken();
  }, []);

  // Render loading state until user role is set or when navigating between pages
  if (isLoading || (userRole === null && getToken)) {
    return <Loader />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {!getToken ? (
            <>
              <Route path="/employeeLogin" element={<EmployeeLoginPage />} />
              <Route path="/adminLogin" element={<AdminLoginPage />} />
              <Route path="/" element={<HomePage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />

              {userRole.toLowerCase() === "admin" && (
                <>
                  <Route path="/EmployeeRegister" element={<EmployeeRegisterPage />} />
                  <Route path="/AttendanceDetails" element={<AttendanceDetailsPage />} />
                  <Route path="/EmployeeDetails" element={<EmployeeDetailsPage />} />
                  <Route path="/SalaryDetails" element={<SalaryDetailsPage />} />
                  <Route path="/LeaveDetails" element={<LeaveDetailsPage />} />
                  <Route path="/ReportPage" element={<ReportPage />} />
                </>
              )}
              {userRole.toLowerCase() === "employee" && (
                <>
                  <Route path="/LeaveRequst" element={<LeaveRequestPage />} />
                  <Route path="/LeaveStatus" element={<LeaveStatusPage />} />
                  <Route path="/SalaryStatus" element={<SalaryStatusPage />} />
                  <Route path="/AttendanceStatus" element={<AttendanceStatusPage />} />
                </>
              )}
            </>
          )}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
