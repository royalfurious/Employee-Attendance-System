import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/Layout";
import { EmployeeLoginPage } from "../pages/EmployeeLoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ManagerLoginPage } from "../pages/ManagerLoginPage";
import { EmployeeDashboardPage } from "../pages/EmployeeDashboardPage";
import { MarkAttendancePage } from "../pages/MarkAttendancePage";
import { MyAttendanceHistoryPage } from "../pages/MyAttendanceHistoryPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ManagerDashboardPage } from "../pages/ManagerDashboardPage";
import { AllEmployeesAttendancePage } from "../pages/AllEmployeesAttendancePage";
import { TeamCalendarPage } from "../pages/TeamCalendarPage";
import { ReportsPage } from "../pages/ReportsPage";

export function AppRouter() {
  const { token, user } = useSelector((state) => state.auth);

  const defaultPath = !token ? "/" : user?.role === "manager" ? "/manager/dashboard" : "/employee/dashboard";

  return (
    <Routes>
      <Route path="/" element={<EmployeeLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/manager/login" element={<ManagerLoginPage />} />

      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <EmployeeDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/mark"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <MarkAttendancePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/history"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <MyAttendanceHistoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute role="employee">
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute role="manager">
            <Layout>
              <ManagerDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute role="manager">
            <Layout>
              <AllEmployeesAttendancePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/calendar"
        element={
          <ProtectedRoute role="manager">
            <Layout>
              <TeamCalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute role="manager">
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/profile"
        element={
          <ProtectedRoute role="manager">
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}
