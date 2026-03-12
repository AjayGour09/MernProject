import { Navigate } from "react-router-dom";
import { AuthService } from "../services/auth";

export default function AdminRoute({ children }) {
  const user = AuthService.getUser();

  if (!AuthService.isLoggedIn() || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/customer/login" replace />;
  }

  return children;
}