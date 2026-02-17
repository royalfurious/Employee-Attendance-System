import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "manager" ? "/manager/dashboard" : "/employee/dashboard"} replace />;
  }

  return children;
}
