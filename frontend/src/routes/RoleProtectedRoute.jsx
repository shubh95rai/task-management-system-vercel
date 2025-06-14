import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function RoleProtectedRoute({ allowedRoles }) {
  const { user, userLoading } = useContext(UserContext);

  if (userLoading) {
    // while checking auth status, show loader or nothing
    return;
  }

  if (!user) {
    // not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // redirecting to their own dashboard
    const redirectPath =
      user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
