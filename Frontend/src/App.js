import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { users } from "./package/admin/api";
import { deleteCookie, openNotificationWithIcon } from "./package/client/utils";
import { Client } from "./Routes";
import { Admin } from "./Routes/Admin";

function App() {
  const navigate = useNavigate();
  const path = useLocation();
  // const location = useLocation();
  // const previousPathname = useRef("");

  useEffect(() => {
    console.log("a - current path:", path.pathname);

    // Kiểm tra khi rời khỏi đường dẫn `/admin/tai-khoan`
    if (!path.pathname.includes("/admin/tai-khoan")) {
      localStorage.removeItem("filters");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/dang-ky-ca-biet-tung-bo-sach")) {
      localStorage.removeItem("filtersDangKy");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/khai-bao-sach")) {
      localStorage.removeItem("filtersKhaiBaoSach");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/phieu-nhap")) {
      localStorage.removeItem("filtersPhieuNhap");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/phieu-xuat")) {
      localStorage.removeItem("filtersPhieuXuat");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/khai-bao-tai-lieu")) {
      localStorage.removeItem("filtersKhaiBaoTaiLieu");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/tra-sach")) {
      localStorage.removeItem("filtersTraSach");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/nha-xuat-ban")) {
      localStorage.removeItem("filtersNhaXuatBan");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/nam-hoc")) {
      localStorage.removeItem("filtersNamHoc");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/kho-luu-tru")) {
      localStorage.removeItem("filtersKhoLuuTru");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/lich-nghi-le")) {
      localStorage.removeItem("filtersLichNghiLe");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/nha-cung-cap")) {
      localStorage.removeItem("filtersNhaCungCap");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/don-vi")) {
      localStorage.removeItem("filtersDonVi");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/ma-ca-biet")) {
      localStorage.removeItem("filtersMaCaBiet");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-ky-hieu-phan-loai-cha")) {
      localStorage.removeItem("filtersDanhMucKyHieuPhanLoaiCha");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/ky-hieu")) {
      localStorage.removeItem("filtersKyHieu");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-ma-mau")) {
      localStorage.removeItem("filtersDanhMucMaMau");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-tinh-trang-sach")) {
      localStorage.removeItem("filtersDanhMucTinhTrangSach");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-bao-tap-chi")) {
      localStorage.removeItem("filtersDanhMucMucBaoTapChi");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-bao")) {
      localStorage.removeItem("filtersDanhMucMucBao");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-sach")) {
      localStorage.removeItem("filtersDanhMucMucSach");
      // console.log("đã xóa");
    }
    if (!path.pathname.includes("/admin/danh-muc-tai-lieu-so")) {
      localStorage.removeItem("filtersDanhMucTaiLieuSo");
      // console.log("đã xóa");
    }
  }, [path.pathname]);

  const [allRole, setAllRole] = useState([]);
  const [Users, setUsers] = useState({ listRole: [] });
  const [postLength, setPostLength] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 3) {
      deleteCookie("jwt");
      openNotificationWithIcon("warning", "Đã có lỗi xảy ra, vui lòng đăng nhập lại, để đảm bảo an toàn dữ liệu.");
    } else {
      users
        .getAllUserRole()
        .then((res) => {
          setAllRole(res);
        })
        .catch((err) => {
          setPostLength(postLength + 1);
          setCount((prev) => prev + 1);
        });
    }
  }, [postLength, count]);
  useEffect(() => {
    users.getUsers().then((res) => setUsers(res));
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);
  useEffect(() => {
    if (allRole.length > 0 && Users.listRole.length > 0) {
      allRole.forEach((element) => {
        let subDomain = element?.roleName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "d")
          .replace(/ /g, "-");
        if (
          path.pathname.toLowerCase().includes(`/${subDomain}`) &&
          !Users.listRole.find((item) => item.nameRole === element.roleName)
        ) {
          // return navigate("/admin/403");
        }
      });
    }
  }, [path, allRole, Users, navigate]);
  return (
    <Fragment>
      {path.pathname.includes("/admin") || path.pathname === "/cp" || path.pathname.includes("/Print") ? (
        <Admin />
      ) : (
        <Client />
      )}
    </Fragment>
  );
}

export default App;
