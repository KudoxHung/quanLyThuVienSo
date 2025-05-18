import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import { users } from "../api/users";
import { deleteCookie, getCookie, openNotificationWithIcon } from "../utils";

export function PrivateRoutes() {
  const navigate = useNavigate();
  const isLoggedIn = getCookie("jwt");
  if (!isLoggedIn) {
    openNotificationWithIcon(
      "info",
      "Bạn chưa đăng nhập",
      "Hãy vui lòng đăng nhập đễ chúng tôi có thể giúp bạn theo dõi tiến độ đọc sách, Thank you!",
    );
  } else {
    users
      .getUser()
      .then((res) => {
        if (res.message === "This account was locked") {
          deleteCookie("jwt");
          openNotificationWithIcon(
            "warning",
            "Ngăn chặn truy cập",
            "Bạn đã bị khóa vì một lí do gì đó",
          );
          return navigate("/login", { replace: true });
        } else if (res.message === "This token was expired") {
          deleteCookie("jwt");
          openNotificationWithIcon(
            "warning",
            "Ngăn chặn truy cập",
            "Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại",
          );
          return navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Đăng nhập thất bại",
          err?.response?.data?.message || err?.message,
        );
        // window.location.reload();
      });
  }
  return !isLoggedIn ? <Navigate to="/login" replace /> : <Outlet />;
}
