import { Navigate, Outlet, useNavigate } from "react-router-dom";

import {
  deleteCookie,
  getCookie,
  openNotificationWithIcon,
} from "../../client/utils";
import { users } from "../api";

export function PrivateRoutes() {
  const navigate = useNavigate();

  const isLoggedIn = getCookie("jwt");

  if (!isLoggedIn) {
    openNotificationWithIcon(
      "info",
      "Bạn chưa đăng nhập",
      "Hãy đăng nhập quyền quản trị, Thank you!",
    );
  } else {
    users
      .getUsers()
      .then((res) => {
        if (res.message === "This token was expired") {
          deleteCookie("jwt");
          openNotificationWithIcon(
            "warning",
            "Ngăn chặn truy cập",
            "Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại",
          );
          return (window.location.href = "/cp");
        } else if (!res.listRole.find((item) => item.nameRole === "Admin")) {
          deleteCookie("jwt");
          openNotificationWithIcon(
            "warning",
            "Ngăn chặn truy cập",
            "Bạn không có quyền truy cập vào trang này",
          );
          return navigate("/Print-authorized-403", { replace: true });
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

  return !isLoggedIn ? <Navigate to="/cp" replace /> : <Outlet />;
}
