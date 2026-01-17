import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import { isAuthenticated, isHRAdmin, isEmployee } from "./utils/auth";

function PrivateRoute({ children, requireRole }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  if (requireRole === "HR_ADMIN" && !isHRAdmin()) {
    return <Navigate to="/employee-dashboard" />;
  }

  if (requireRole === "EMPLOYEE" && !isEmployee()) {
    return <Navigate to="/hr-dashboard" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute requireRole="EMPLOYEE">
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr-dashboard"
          element={
            <PrivateRoute requireRole="HR_ADMIN">
              <HRDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
