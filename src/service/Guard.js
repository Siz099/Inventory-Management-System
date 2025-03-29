import { Navigate } from "react-router-dom";
import ApiService from "../service/ApiService"; // Ensure correct path

// Authentication Guard for Protected Routes
const AuthGuard = ({ children }) => {
  return ApiService.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Admin Guard for Admin-only Routes
const AdminGuard = ({ children }) => {
  return ApiService.isAuthenticated() && ApiService.isAdmin() ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export { AuthGuard, AdminGuard };
