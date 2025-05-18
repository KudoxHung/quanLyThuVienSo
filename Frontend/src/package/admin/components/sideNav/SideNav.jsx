import { memo } from "react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useCheckUnitPrefix } from "../../../../hooks/useCheckUnitPrefix";
import { users } from "../../api";
import logo from "../../asset/logo/LogoTHPTVMD.png";
import { Image, Menu, Spin, Tooltip } from "antd";
function _Sidenav({ color }) {
  const isPGD = useCheckUnitPrefix();

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const tables = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const billing = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const rtl = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6C3 4.34315 4.34315 3 6 3H16C16.3788 3 16.725 3.214 16.8944 3.55279C17.0638 3.89157 17.0273 4.29698 16.8 4.6L14.25 8L16.8 11.4C17.0273 11.703 17.0638 12.1084 16.8944 12.4472C16.725 12.786 16.3788 13 16 13H6C5.44772 13 5 13.4477 5 14V17C5 17.5523 4.55228 18 4 18C3.44772 18 3 17.5523 3 17V6Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const profile = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const signin = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
        fill={color}
      ></path>
    </svg>,
  ];
  const signup = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      key={0}
    >
      <path
        d="M0,2A2,2,0,0,1,2,0H8a2,2,0,0,1,2,2V8a2,2,0,0,1-2,2H2A2,2,0,0,1,0,8Z"
        transform="translate(4 4)"
        fill={color}
      />
      <path
        d="M2,0A2,2,0,0,0,0,2V8a2,2,0,0,0,2,2V4A2,2,0,0,1,4,2h6A2,2,0,0,0,8,0Z"
        fill={color}
      />
    </svg>,
  ];
  const { pathname } = useLocation();
  const [generalSettingsItem, setGeneralSettingsItem] = useState([
    {
      title: "Thông tin năm học",
      name: "Năm học",
      link: "admin/nam-hoc",
      icon: signup,
    },
    {
      title: "Quản lý kho lưu trữ",
      name: "Kho lưu trữ",
      link: "admin/kho-luu-tru",
      icon: signup,
    },
    {
      title: "lịch nghỉ lễ",
      name: "Lịch nghỉ lễ",
      link: "admin/lich-nghi-le",
      icon: signup,
    },
    {
      title: "Tài khoản",
      name: "Tài khoản",
      link: "admin/tai-khoan",
      icon: signup,
    },
    {
      title: "Chuyển đơn vị hàng loạt",
      name: "Chuyển đơn vị hàng loạt",
      link: "admin/Chuyen-don-vi-hang-loat",
      icon: signup,
    },
  ]);
  const [manageCategories, setManageCategories] = useState([
    {
      title: "Danh mục nhà xuất bản",
      name: "Nhà xuất bản",
      link: "admin/nha-xuat-ban",
      icon: billing,
    },
    {
      title: "Danh mục nhà cung cấp",
      name: "Nhà cung cấp",
      link: "admin/nha-cung-cap",
      icon: billing,
    },
    {
      title: "Danh mục đơn vị lớp học, phòng ban",
      name: "Đơn vị",
      link: "admin/don-vi",
      icon: billing,
    },
    {
      title: "Danh mục mã cá biệt",
      name: "Mã cá biệt",
      link: "admin/ma-ca-biet",
      icon: billing,
    },
    {
      title: "Danh mục ký hiệu phân loại cha",
      name: "Danh mục ký hiệu phân loại cha",
      link: "admin/danh-muc-ky-hieu-phan-loai-cha",
      icon: billing,
    },
    {
      title: "Danh mục kí hiệu phân loại",
      name: "Ký hiệu",
      link: "admin/ky-hieu",
      icon: billing,
    },
    {
      title: "Mã màu",
      name: "Mã màu",
      link: "admin/danh-muc-ma-mau",
      icon: rtl,
    },
    {
      title: "Tình trạng sách",
      name: "Tình trạng sách",
      link: "admin/danh-muc-tinh-trang-sach",
      icon: rtl,
    },
  ]);
  const [manageBooks, setManageBooks] = useState([
    {
      title: "Đăng ký cá biệt từng bộ sách",
      name: "Đăng ký",
      link: "admin/dang-ky-ca-biet-tung-bo-sach",
      icon: signup,
    },
    {
      title: "Danh mục sách",
      name: "Danh mục sách",
      link: "admin/danh-muc-sach",
      icon: tables,
    },
    {
      title: "Khai báo ban đầu",
      name: "Khai báo sách",
      link: "admin/khai-bao-sach",
      icon: signin,
    },
    {
      title: "Nhập sách",
      name: "Nhập sách",
      link: "admin/nhap-sach",
      icon: signin,
    },
    {
      title: "Xuất sách",
      name: "Xuất sách",
      link: "admin/xuat-sach",
      icon: signin,
    },
    {
      title: "Quản lý phiếu nhập",
      name: "Phiếu nhập",
      link: "admin/phieu-nhap",
      icon: signin,
    },
    // Trường làm
    {
      title: "Quản lý phiếu xuất",
      name: "Phiếu xuất",
      link: "admin/phieu-xuat",
      icon: signin,
    },
    {
      title: "Quản lý sách kiểm kê",
      name: "Kiểm kê sách",
      link: "admin/kiem-ke-sach",
      icon: signin,
    },
  ]);
  const [manageDocumnetsDigital, setManageDocumnetsDigital] = useState([
    {
      title: "Danh mục Tài liệu điện tử",
      name: "Danh mục Tài liệu",
      link: "admin/danh-muc-tai-lieu-so",
      icon: tables,
    },
    {
      title: "Khai báo ban đầu tài liệu điện tử",
      name: "Khai báo tài liệu",
      link: "admin/khai-bao-tai-lieu",
      icon: tables,
    },
    {
      title: "Danh mục TLĐT dùng chung",
      name: "Danh mục TLĐT dùng chung",
      link: "admin/danh-muc-tai-lieu-so-dung-chung",
      icon: tables,
    },
    {
      title: "TLĐT dùng chung",
      name: "TLĐT dùng chung",
      link: "admin/khai-bao-tai-lieu-dung-chung",
      icon: tables,
    },
    {
      title: "Duyệt TlĐT dùng chung",
      name: "Duyệt TLĐT dùng chung",
      link: "admin/duyet-tai-lieu-dung-chung",
      icon: tables,
    },
  ]);
  const [manageMagazine, setManageMagazine] = useState([
    {
      title: "Danh mục báo, tạp chí",
      name: "Danh mục báo",
      link: "admin/danh-muc-bao-tap-chi",
      icon: tables,
    },
    {
      title: "Khai báo ban đầu báo, tạp chí",
      name: "Khai báo báo",
      link: "admin/danh-muc-bao",
      icon: signin,
    },
    // {
    //   title: "Nhập báo, tạp chí",
    //   name: "Nhập báo",
    //   link: "admin/Nhap-bao-tap-chi",
    //   icon: signin,
    // },
    // {
    //   title: "Quản lý phiếu nhập báo, tạp chí",
    //   name: "Phiếu nhập báo",
    //   link: "admin/quan-ly-phieu-bao-tap-chi",
    //   icon: signin,
    // },
  ]);
  const [trafficManagement, setTrafficManagement] = useState([
    {
      title: "Lập phiếu mượn",
      name: "Lập phiếu mượn",
      link: "admin/lap-phieu-muon",
      icon: profile,
    },
    {
      title: "Trả sách",
      name: "Trả sách",
      link: "admin/tra-sach",
      icon: profile,
    },
    {
      title: "Hồi cố sách",
      name: "Hồi cố sách",
      link: "admin/hoi-co-sach",
      icon: profile,
    },
  ]);
  const [report, setReport] = useState([
    {
      title: "Danh sách mượn quá hạn chưa trả",
      name: "Mượn quá hạn",
      link: "admin/muon-qua-han",
      icon: rtl,
    },
    {
      title: "Danh sách thống kê mượn của người dùng",
      name: "Thống kê mượn",
      link: "admin/thong-ke-muon",
      icon: rtl,
    },
    {
      title: "Thống kê sách theo loại",
      name: "Thống kê sách",
      link: "admin/thong-ke-sach-theo-loai",
      icon: rtl,
    },
    {
      title: "Xuất báo cáo theo loại người dùng",
      name: "Xuất báo cáo",
      link: "admin/xuat-bao-cao",
      icon: rtl,
    },
    {
      title: "Thống kê danh sách mượn trễ theo loại người dùng",
      name: "Thống kê quá hạn",
      link: "admin/thong-ke-muon-qua-han-theo-loai-nguoi-dung",
      icon: rtl,
    },
    {
      title: "Thống kê danh sách mã cá biệt theo học kì",
      name: "Thống kê cá biệt",
      link: "admin/thong-ke-sach-theo-ma-ca-biet",
      icon: rtl,
    },
    {
      title: "Sổ albums mục lục sách",
      name: "Sổ albums mục lục sách",
      link: "admin/thong-ke-so-albums-muc-luc-sach",
      icon: rtl,
    },
    {
      title: "Sổ đăng ký tổng quát",
      name: "Sổ đăng ký tổng quát",
      link: "admin/so-dang-ky-tong-quat",
      icon: rtl,
    },
    {
      title: "Sổ đăng ký báo chí",
      name: "Sổ đăng ký báo chí",
      link: "admin/so-dang-ky-bao-chi",
      icon: rtl,
    },
    {
      title: "Thống kê xuất sách",
      name: "Thống kê xuất sách",
      link: "admin/thong-ke-xuat-sach",
      icon: rtl,
    },
    {
      title: "Biên bản xuất sách",
      name: "Biên bản xuất sách",
      link: "admin/bien-ban-xuat-sach",
      icon: rtl,
    },
    {
      title: "Sổ đăng ký",
      name: "Sổ đăng ký",
      link: "admin/so-dang-ky",
      icon: rtl,
    },
  ]);
  const [reportTotal, setReportTotal] = useState([
    {
      title: "Tình trạng sách",
      name: "Tình trạng sách",
      link: "admin/thong-ke-tinh-trang-sach",
      icon: rtl,
    },
    {
      title: "Số lượng sách",
      name: "Số lượng sách",
      link: "admin/thong-ke-sach",
      icon: rtl,
    },
  ]);
  const [pageYouRead, setPageYouRead] = useState([
    {
      title: "Thiết lập giới thiệu trang bạn đọc",
      name: "Giới Thiệu",
      link: "admin/gioi-thieu",
      icon: rtl,
    },
    {
      title: "Thiết lập liên hệ trang bạn đọc",
      name: "Liên Hệ",
      link: "admin/lien-he",
      icon: rtl,
    },
    {
      title: "Thiết lập hình ảnh trang bạn đọc",
      name: "Hình ảnh",
      link: "admin/hinh-anh",
      icon: rtl,
    },
    {
      title: "Thiết lập màu sắc trang bạn đọc",
      name: "Màu sắc",
      link: "admin/mau-sac",
      icon: rtl,
    },
  ]);
  const [VideoElearningSound, setVideoElearningSound] = useState([
    {
      title: "Danh mục bài học điện tử",
      name: "Danh mục bài học điện tử",
      link: "admin/danh-muc-bai-hoc-dien-tu",
      icon: rtl,
    },
    {
      title: "Nhóm bài học điện tử",
      name: "Nhóm bài học điện tử",
      link: "admin/nhom-bai-hoc-dien-tu",
      icon: rtl,
    },
    {
      title: "Nội dung bài học điện tử",
      name: "Nội dung bài học điện tử",
      link: "admin/noi-dung-bai-hoc-dien-tu",
      icon: rtl,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const page = pathname?.replace("/", "");
  useEffect(() => {
    users
      .getUsers()
      .then((res) => {
        Promise.all([
          setManageCategories((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),
          setGeneralSettingsItem((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),
          setManageMagazine((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),

          setManageBooks((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),
          setManageDocumnetsDigital((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),

          setTrafficManagement((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),

          setReport((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),
          setReportTotal((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),
          setPageYouRead((prev) =>
            prev.map((item) =>
              res.listRole.find((i) => i.nameRole === item.name)
                ? item
                : undefined,
            ),
          ),

          setManageCategories((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setReport((prev) => prev.filter((item) => item !== undefined)),
          setTrafficManagement((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setManageMagazine((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setReportTotal((prev) => prev.filter((item) => item !== undefined)),
          setTrafficManagement((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setManageMagazine((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setManageBooks((prev) => prev.filter((item) => item !== undefined)),
          setManageDocumnetsDigital((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setGeneralSettingsItem((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setPageYouRead((prev) => prev.filter((item) => item !== undefined)),
          setVideoElearningSound((prev) =>
            prev.filter((item) => item !== undefined),
          ),
        ]);

        setLoading(false);
      })
      .catch((err) => {
        console.log("error user login", err);
      });
  }, []);
  return (
    <>
      <div className="brand">
        {/* <span>Dai Phat Dat</span> */}
        <Image
          src={logo}
          preview={false}
          width={130}
          height={100}
          style={{ marginLeft: 30 }}
        />
      </div>
      <hr />
      <Spin spinning={loading} size={"large"}>
        <Menu theme="light" mode="inline">
          <Menu.Item key="0">
            <NavLink to="/admin/dashboard">
              <span
                className="icon"
                style={{
                  background: page === "admin/dashboard" ? color : "",
                }}
              >
                {dashboard}
              </span>
              <span className="label">Trang chủ</span>
            </NavLink>
          </Menu.Item>

          {isPGD ? (
            <>
              <Menu.Item key="0">
                <NavLink to="admin/dashboardReport">
                  <span
                    className="icon"
                    style={{
                      background: page === "admin/Report" ? color : "",
                    }}
                  >
                    {dashboard}
                  </span>
                  <span className="label">Tổng quan</span>
                </NavLink>
              </Menu.Item>

              <Menu.Item key="0">
                <NavLink to="/admin/thong-ke-sach">
                  <span
                    className="icon"
                    style={{
                      background: page === "admin/Report" ? color : "",
                    }}
                  >
                    {dashboard}
                  </span>
                  <span className="label">Số lượng sách</span>
                </NavLink>
              </Menu.Item>

              <Menu.Item key="0">
                <NavLink to="/admin/thong-ke-tinh-trang-sach">
                  <span
                    className="icon"
                    style={{
                      background: page === "admin/Report" ? color : "",
                    }}
                  >
                    {dashboard}
                  </span>
                  <span className="label">Tình trạng sách</span>
                </NavLink>
              </Menu.Item>
            </>
          ) : null}

          {generalSettingsItem.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub1"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                  s
                >
                  THIẾT LẬP CHUNG
                </span>
              }
            >
              {generalSettingsItem.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={index + 1}
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {manageCategories.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub2"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                  s
                >
                  QUẢN LÝ DANH MỤC
                </span>
              }
            >
              {manageCategories.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={index + 1 + generalSettingsItem.length}
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {manageMagazine.length > 0 && (
            <Menu.SubMenu
              key="sub3"
              className="menu-item-header"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                  s
                >
                  Quản lý báo, tạp chí
                </span>
              }
            >
              {manageMagazine.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length + generalSettingsItem.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {manageBooks.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub4"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                  s
                >
                  QUẢN LÝ SÁCH
                </span>
              }
            >
              {manageBooks.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length +
                      generalSettingsItem.length +
                      manageMagazine.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {manageDocumnetsDigital.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub5"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                  s
                >
                  QUẢN LÝ TÀI LIỆU SỐ
                </span>
              }
            >
              {manageDocumnetsDigital.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length +
                      generalSettingsItem.length +
                      manageMagazine.length +
                      manageBooks.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {trafficManagement.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub6"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                  s
                >
                  QUẢN LÝ LƯU THÔNG
                </span>
              }
            >
              {trafficManagement.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length +
                      generalSettingsItem.length +
                      manageMagazine.length +
                      manageBooks.length +
                      manageDocumnetsDigital.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {report.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub7"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                >
                  BÁO CÁO
                </span>
              }
            >
              {report.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length +
                      generalSettingsItem.length +
                      manageMagazine.length +
                      manageBooks.length +
                      manageDocumnetsDigital.length +
                      trafficManagement.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {pageYouRead.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub8"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                >
                  Trang bạn đọc
                </span>
              }
            >
              {pageYouRead.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length +
                      generalSettingsItem.length +
                      manageMagazine.length +
                      manageBooks.length +
                      manageDocumnetsDigital.length +
                      trafficManagement.length +
                      report.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
          {VideoElearningSound.length > 0 && (
            <Menu.SubMenu
              className="menu-item-header"
              key="sub9"
              title={
                <span
                  style={{
                    color: "#8c8c8c",
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    display: "block",
                    marginLeft: "-13px",
                  }}
                >
                  Học liệu điện tử
                </span>
              }
            >
              {VideoElearningSound.map((item, index) => (
                <Menu.Item
                  className="menu-item-header"
                  key={
                    index +
                    1 +
                    (manageCategories.length +
                      generalSettingsItem.length +
                      manageMagazine.length +
                      manageBooks.length +
                      manageDocumnetsDigital.length +
                      trafficManagement.length +
                      report.length +
                      pageYouRead.length +
                      VideoElearningSound.length)
                  }
                  style={{ padding: "0px !important" }}
                >
                  <Tooltip
                    title={item?.title}
                    color={"lime"}
                    placement="rightTop"
                  >
                    <NavLink to={item?.link}>
                      <span
                        className="icon"
                        style={{
                          background: page === item?.link ? color : "",
                        }}
                      >
                        {item?.icon}
                      </span>
                      <span
                        className="label"
                        style={{
                          width: "80%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.name || item?.title}
                      </span>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )}
        </Menu>
      </Spin>
    </>
  );
}
export const Sidenav = memo(_Sidenav);
