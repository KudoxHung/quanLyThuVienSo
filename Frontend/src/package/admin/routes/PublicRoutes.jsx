import { Navigate, Outlet } from "react-router-dom";

import { getCookie } from "../../client/utils";

export function PublicRoutes() {
  const isLoggedIn = getCookie("jwt");
  return !isLoggedIn ? <Outlet /> : <Navigate to="/admin/dashboard" replace />;
}
