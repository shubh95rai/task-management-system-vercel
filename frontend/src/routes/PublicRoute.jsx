import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { user, userLoading } = useContext(UserContext);

  if (userLoading) {
    // while checking auth status, show loader or nothing
    return;
  }

  if (user) {
    // redirecting to their own dashboard
    const redirectPath =
      user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
