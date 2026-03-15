import { Navigate } from "react-router-dom";
import { AuthService } from "../services/auth";

export default function CustomerRoute({ children }) {
  const user = AuthService.getUser();

  if (!AuthService.isLoggedIn() || !user) {
    return <Navigate to="/customer/login" replace />;
  }

  if (user.role !== "customer") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}