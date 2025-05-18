import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getCookie } from "../utils";

export const PublicRoutes = () => {
  const isLoggedIn = Boolean(getCookie("jwt"));

  return !isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};
