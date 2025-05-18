import { useEffect, useState } from "react";
import { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useClock } from "../../../../hooks/useClock";
import { useNetWork } from "../../../../hooks/useNetWork";
// import englist from "./../../asset/countryFlags/englist.png";
// import china from "./../../asset/countryFlags/china.png";
// import japan from "./../../asset/countryFlags/japan.png";
// import korean from "./../../asset/countryFlags/south-korea.png";
import {
  deleteCookie,
  getCookie,
  openNotificationWithIcon,
} from "../../../client/utils";
import { users } from "../../api/users";
import { Sidenav } from "../sideNav/SideNav";
import vietnam from "./../../asset/countryFlags/vietnam.png";
import {
  LogoutOutlined,
  SearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  ConfigProvider,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tooltip,
  Typography,
} from "antd";

import "./Header.css";

const { Option } = Select;
// const bell = [
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 20 20"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     key={0}
//   >
//     <path
//       d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z"
//       fill="#111827"
//     ></path>
//     <path
//       d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z"
//       fill="#111827"
//     ></path>
//   </svg>,
// ];

// const wifi = [
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 107 107"
//     version="1.1"
//     xmlns="http://www.w3.org/2000/svg"
//     key={0}
//   >
//     <g
//       id="Page-1"
//       stroke="none"
//       stroke-width="1"
//       fill="none"
//       fillRule="evenodd"
//     >
//       <g id="logo-spotify" fill="#2EBD59" fillRule="nonzero">
//         <path
//           d="M53.5,0 C23.9517912,0 0,23.9517912 0,53.5 C0,83.0482088 23.9517912,107 53.5,107 C83.0482088,107 107,83.0482088 107,53.5 C107,23.9554418 83.0482088,0.00365063118 53.5,0 Z M78.0358922,77.1597407 C77.0757762,78.7368134 75.0204708,79.2296486 73.4506994,78.2695326 C60.8888775,70.5922552 45.0743432,68.8582054 26.4524736,73.1111907 C24.656363,73.523712 22.8675537,72.3993176 22.458683,70.6032071 C22.0461617,68.8070966 23.1669055,67.0182873 24.9666667,66.6094166 C45.3444899,61.9548618 62.8273627,63.9590583 76.9297509,72.5745479 C78.4995223,73.5419652 78.9996588,75.5899693 78.0358922,77.1597407 L78.0358922,77.1597407 Z M84.5814739,62.5973729 C83.373115,64.5614125 80.8030706,65.1747185 78.8426817,63.9700102 C64.4664961,55.1318321 42.5408052,52.5727397 25.5325145,57.7347322 C23.3275333,58.4027977 20.9984306,57.1579324 20.3267144,54.9566018 C19.6622996,52.7516206 20.9071648,50.4261685 23.1084954,49.7544524 C42.5371546,43.858683 66.6933811,46.7134766 83.2051859,56.8622313 C85.1692255,58.0705902 85.7898328,60.636984 84.5814739,62.5973729 Z M85.1436711,47.4253497 C67.8980894,37.1853292 39.4523712,36.2434664 22.9880246,41.2375299 C20.3449676,42.0406687 17.5485841,40.5475606 16.7490959,37.9045036 C15.9496076,35.2614466 17.4390652,32.4650631 20.0857728,31.6619243 C38.9850904,25.9267827 70.3987718,27.0329239 90.2509041,38.8171614 C92.627465,40.2299556 93.4087001,43.3001365 91.9995565,45.6730467 C90.5940635,48.0532583 87.5165814,48.838144 85.1436711,47.4253497 Z"
//           id="Shape"
//         ></path>
//       </g>
//     </g>
//   </svg>,
// ];

// const credit = [
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 20 20"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     key={0}
//   >
//     <path
//       fill="#1890FF"
//       d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
//     ></path>
//     <path
//       fill="#1890FF"
//       fillRule="evenodd"
//       clipRule="evenodd"
//       d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
//     ></path>
//   </svg>,
// ];

// const clockicon = [
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 20 20"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     key={0}
//   >
//     <path
//       fillRule="evenodd"
//       clipRule="evenodd"
//       d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.2652 9.10536 10.5196 9.29289 10.7071L12.1213 13.5355C12.5118 13.9261 13.145 13.9261 13.5355 13.5355C13.9261 13.145 13.9261 12.5118 13.5355 12.1213L11 9.58579V6Z"
//       fill="#111827"
//     ></path>
//   </svg>,
// ];

// const data = [
//   {
//     title: "Chức năng này đang phát triển",
//     description: <>{clockicon} 2 days ago</>,

//     avatar: <Avatar shape="square">{wifi}</Avatar>,
//   },
// {
//   title: "New album by Travis Scott",
//   description: <>{clockicon} 2 days ago</>,

//   avatar: <Avatar shape="square">{wifi}</Avatar>,
// },
// {
//   title: "Payment completed",
//   description: <>{clockicon} 2 days ago</>,
//   avatar: <Avatar shape="square">{credit}</Avatar>,
// },
// ];

// const menu = (
//   <List
//     min-width="100%"
//     className="header-notifications-dropdown "
//     itemLayout="horizontal"
//     dataSource={data}
//     renderItem={(item) => (
//       <List.Item>
//         <List.Item.Meta
//           avatar={<Avatar shape="square" src={item.avatar} />}
//           title={item?.title}
//           description={item.description}
//         />
//       </List.Item>
//     )}
//   />
// );

const logsetting = [
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
      d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
      fill="#111827"
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
      fill="#111827"
    ></path>
  </svg>,
];

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

const setting = [
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
      d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
      fill="#111827"
    ></path>
  </svg>,
];
const svg = [
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   xlink="http://www.w3.org/1999/xlink"
  //   width="39px"
  //   height="39px"
  //   viewBox="0 0 100 100"
  //   preserveAspectRatio="xMidYMid"
  // >
  //   <path
  //     fill="none"
  //     stroke="#4f7abe"
  //     stroke-width="8"
  //     stroke-dasharray="42.76482137044271 42.76482137044271"
  //     d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
  //     stroke-linecap="butt"
  //   >
  //     <animate
  //       attributeName="stroke-dashoffset"
  //       repeatCount="indefinite"
  //       dur="1s"
  //       keyTimes="0;1"
  //       values="0;256.58892822265625"
  //     ></animate>
  //   </path>
  // </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xlink="http://www.w3.org/1999/xlink"
    width="39px"
    height="39px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle cx="28" cy="75" r="11" fill="#d82b0d">
      <animate
        attributeName="fill-opacity"
        repeatCount="indefinite"
        dur="1s"
        values="0;1;1"
        keyTimes="0;0.2;1"
        begin="1s"
      ></animate>
    </circle>

    <path
      d="M28 47A28 28 0 0 1 56 75"
      fill="none"
      stroke="#fdbd10"
      strokeWidth="10"
    >
      <animate
        attributeName="stroke-opacity"
        repeatCount="indefinite"
        dur="1s"
        values="0;1;1"
        keyTimes="0;0.2;1"
        begin="1.1s"
      ></animate>
    </path>
    <path
      d="M28 25A50 50 0 0 1 78 75"
      fill="none"
      stroke="#0bc514"
      strokeWidth="10"
    >
      <animate
        attributeName="stroke-opacity"
        repeatCount="indefinite"
        dur="1s"
        values="0;1;1"
        keyTimes="0;0.2;1"
        begin="1.2s"
      ></animate>
    </path>
  </svg>,
];
const disconect = [
  <svg
    t="1661501234785"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="870"
    xlink="http://www.w3.org/1999/xlink"
    width="39"
    height="39"
  >
    <path
      d="M242.752 197.504L800.64 755.424l-45.248 45.248L197.504 242.752l45.248-45.248z m41.344 222.368l45.248 45.248-90.496 90.528a160 160 0 0 0 226.304 226.272l90.464-90.56 45.248 45.28-90.464 90.56a224 224 0 0 1-316.8-316.8l90.496-90.56z m135.776-135.776L510.4 193.6a224 224 0 1 1 316.8 316.8l-90.56 90.464-45.248-45.248 90.528-90.464a160 160 0 1 0-226.272-226.304l-90.56 90.496-45.216-45.248z"
      fill="#d81e06"
      p-id="871"
    ></path>
  </svg>,
];
const { Title, Text } = Typography;

function _Header({
  placement,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState(
    localStorage.getItem("sideNavType"),
  );
  const [user, setUsers] = useState([]);
  const [disconections, setDisconections] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (getCookie("jwt")) {
      users
        .getUsers()
        .then((res) => {
          setUsers(res);
          setDisconections((prev) => (prev = false));
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Đăng nhập thất bại",
            err?.response?.data?.message || err?.message,
          );
          setDisconections(true);
        });
    }
  }, []);

  useEffect(() => window.scrollTo(0, 0), []);

  const showDrawer = () => setVisible(true);
  const hideDrawer = useCallback(() => setVisible(false), []);
  const handleChangeColor = useCallback((type) => {
    setSidenavType(type);
  }, []);

  const renderTitle = (title) => (
    <span>
      {title}
      <span
        style={{
          float: "right",
          color: "blue",
        }}
      >
        more
      </span>
    </span>
  );

  const renderItem = (title, link) => ({
    value: title,
    label: (
      <div
        onClick={() => navigate(link)}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        <span>
          <ZoomInOutlined />
        </span>
      </div>
    ),
  });
  const [generalSettingsItem, setGeneralSettingsItem] = useState([
    {
      title: "Thông tin năm học",
      name: "Năm học",
      link: "admin/nam-hoc",
    },
    {
      title: "Quản lý kho lưu trữ",
      name: "Kho lưu trữ",
      link: "admin/kho-luu-tru",
    },
    {
      title: "lịch nghỉ lễ",
      name: "Lịch nghỉ lễ",
      link: "admin/lich-nghi-le",
    },
    {
      title: "Tài khoản",
      name: "Tài khoản",
      link: "admin/tai-khoan",
    },
  ]);
  const [manageCategories, setManageCategories] = useState([
    {
      title: "Danh mục nhà xuất bản",
      name: "Nhà xuất bản",
      link: "admin/nha-xuat-ban",
    },
    {
      title: "Danh mục nhà cung cấp",
      name: "Nhà cung cấp",
      link: "admin/nha-cung-cap",
    },
    {
      title: "Danh mục đơn vị lớp học, phòng ban",
      name: "Đơn vị",
      link: "admin/don-vi",
    },
    {
      title: "Danh mục ký hiệu phân loại cha",
      name: "Danh mục ký hiệu phân loại",
      link: "admin/danh-muc-ky-hieu-phan-loai-cha",
    },
    {
      title: "Danh mục ký hiệu phân loại",
      name: "Ký hiệu",
      link: "admin/danh-muc-ky-hieu-phan-loai",
    },
  ]);
  const [manageMagazine, setManageMagazine] = useState([
    {
      title: "Danh mục báo, tạp chí",
      name: "Danh mục báo",
      link: "admin/danh-muc-bao-tap-chi",
    },
    {
      title: "Khai báo ban đầu báo, tạp chí",
      name: "Khai báo báo",
      link: "admin/danh-muc-bao",
    },
    // {
    //   title: "Nhập báo, tạp chí",
    //   name: "Nhập báo",
    //   link: "admin/Nhap-bao-tap-chi",
    // },
    // {
    //   title: "Quản lý phiếu nhập báo, tạp chí",
    //   name: "Phiếu nhập báo",
    //   link: "admin/quan-ly-phieu-bao-tap-chi",
    // },
  ]);
  const [manageBooks, setManageBooks] = useState([
    {
      title: "Đăng ký cá biệt từng bộ sách",
      name: "Đăng ký",
      link: "admin/dang-ky-ca-biet-tung-bo-sach",
    },
    {
      title: "Danh mục sách",
      name: "Danh mục sách",
      link: "admin/danh-muc-sach",
    },
    {
      title: "Khai báo ban đầu",
      name: "Khai báo sách",
      link: "admin/khai-bao-sach",
    },
    {
      title: "Nhập sách",
      name: "Nhập sách",
      link: "admin/nhap-sach",
    },
    {
      title: "Quản lý phiếu nhập",
      name: "Phiếu nhập",
      link: "admin/phieu-nhap",
    },
    // Trường làm
    {
      title: "Quản lý phiếu xuất",
      name: "Phiếu xuất",
      link: "admin/phieu-xuat",
    },
  ]);
  const [manageDocumnetsDigital, setManageDocumnetsDigital] = useState([
    {
      title: "Danh mục Tài liệu điện tử",
      name: "Danh mục Tài liệu",
      link: "admin/danh-muc-tai-lieu-so",
    },
    {
      title: "Khai báo ban đầu tài liệu điện tử",
      name: "Khai báo tài liệu",
      link: "admin/khai-bao-tai-lieu",
    },
  ]);
  const [trafficManagement, setTrafficManagement] = useState([
    {
      title: "Lập phiếu mượn",
      name: "Lập phiếu mượn",
      link: "admin/lap-phieu-muon",
    },
    {
      title: "Trả sách",
      name: "Trả sách",
      link: "admin/tra-sach",
    },
    {
      title: "Hồi cố sách",
      name: "Hồi cố sách",
      link: "admin/hoi-co-sach",
    },
  ]);
  const [report, setReport] = useState([
    {
      title: "Danh sách mượn quá hạn chưa trả",
      name: "Mượn quá hạn",
      link: "admin/muon-qua-han",
    },
    {
      title: "Danh sách thống kê mượn của người dùng",
      name: "Thống kê mượn",
      link: "admin/thong-ke-muon",
    },
    {
      title: "Thống kê sách theo loại",
      name: "Thống kê sách",
      link: "admin/thong-ke-sach-theo-loai",
    },
    {
      title: "Xuất báo cáo theo loại người dùng",
      name: "Xuất báo cáo",
      link: "admin/xuat-bao-cao",
    },
    {
      title: "Thống kê danh sách mượn trễ theo loại người dùng",
      name: "Thống kê quá hạn",
      link: "admin/thong-ke-muon-qua-han-theo-loai-nguoi-dung",
    },
    {
      title: "Thống kê danh sách mã cá biệt",
      name: "Thống kê cá biệt",
      link: "admin/thong-ke-sach-theo-ma-ca-biet",
    },
  ]);

  const [pageYouRead, setPageYouRead] = useState([
    {
      title: "Thiết lập giới thiệu trang bạn đọc",
      name: "Giới Thiệu",
      link: "admin/gioi-thieu",
    },
    {
      title: "Thiết lập liên hệ trang bạn đọc",
      name: "Liên Hệ",
      link: "admin/lien-he",
    },
    {
      title: "Thiết lập hình ảnh trang bạn đọc",
      name: "Hình ảnh",
      link: "admin/hinh-anh",
    },
    {
      title: "Thiết lập màu sắc trang bạn đọc",
      name: "Màu sắc",
      link: "admin/mau-sac",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [visibleDraw, setVisibleDraw] = useState(false);

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
          setManageBooks((prev) => prev.filter((item) => item !== undefined)),
          setManageDocumnetsDigital((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setGeneralSettingsItem((prev) =>
            prev.filter((item) => item !== undefined),
          ),
          setPageYouRead((prev) => prev.filter((item) => item !== undefined)),
        ]);

        setLoading(false);
      })
      .catch((err) => {
        console.log("error user login", err);
      });
  }, []);
  const options = [
    {
      label:
        generalSettingsItem.length > 0 ? renderTitle("Thiết Lập Chung") : " ",
      options: [
        ...generalSettingsItem.map((item) =>
          renderItem(item?.title, item?.link),
        ),
      ],
    },
    {
      label:
        manageCategories.length > 0 ? renderTitle("Quản Lý Danh Mục") : " ",
      options: [
        ...manageCategories.map((item) => renderItem(item?.title, item?.link)),
      ],
    },
    {
      label:
        manageMagazine.length > 0 ? renderTitle("Quản Lý Báo Tạp Chí") : " ",
      options: [
        ...manageMagazine.map((item) => renderItem(item?.title, item?.link)),
      ],
    },
    {
      label: manageBooks.length > 0 ? renderTitle("Quản Lý Sách") : " ",
      options: [
        ...manageBooks.map((item) => renderItem(item?.title, item?.link)),
      ],
    },
    {
      label:
        manageDocumnetsDigital.length > 0
          ? renderTitle("Tài liệu điện tử")
          : " ",
      options: [
        ...manageDocumnetsDigital.map((item) =>
          renderItem(item?.title, item?.link),
        ),
      ],
    },
    {
      label:
        trafficManagement.length > 0 ? renderTitle("Quản Lý lưu Thông") : " ",
      options: [
        ...trafficManagement.map((item) => renderItem(item?.title, item?.link)),
      ],
    },
    {
      label: report.length > 0 ? renderTitle("Báo Cáo") : " ",
      options: [...report.map((item) => renderItem(item?.title, item?.link))],
    },
    {
      label: pageYouRead.length > 0 ? renderTitle("Trang bạn đọc") : " ",
      options: [
        ...pageYouRead.map((item) => renderItem(item?.title, item?.link)),
      ],
    },
  ];

  return (
    <>
      <div className="setting-drwer" onClick={showDrawer}>
        {setting}
      </div>
      <Row gutter={[24, 0]}>
        <Col span={24} md={12}>
          {/* <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {name.replace("/", " ")}
            </Breadcrumb.Item>
          </Breadcrumb> */}
          {/* <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {subName.replace("/", " ")}
            </span>
          </div> */}

          <TimeCountDown disconections={disconections} />
        </Col>
        <Col span={24} md={12} className="header-control">
          {/* <Badge size="small" count={4}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <a
                href="#pablo"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {bell}
              </a>
            </Dropdown>
          </Badge> */}
          <Button type="link" onClick={showDrawer}>
            {logsetting}
          </Button>

          <Drawer
            title="Danh mục"
            placement={"left"}
            onClose={() => {
              setVisibleDraw(false);
            }}
            visible={visibleDraw}
          >
            <Sidenav color={"transparent"} />
          </Drawer>
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => {
              setVisibleDraw(true);
            }}
          >
            {toggler}
          </Button>
          <TransferOptions
            hideDrawer={hideDrawer}
            placement={placement}
            visible={visible}
            handleSidenavColor={handleSidenavColor}
            sidenavType={sidenavType}
            handleSidenavType={handleSidenavType}
            handleChangeColor={handleChangeColor}
            handleFixedNavbar={handleFixedNavbar}
          />
          <Dropdown overlay={menuUserActions} trigger={["click"]}>
            <Link
              to="#"
              className="btn-sign-in"
              onClick={(e) => e.preventDefault()}
            >
              {profile}
              <span>{user?.data?.fullname}</span>
            </Link>
          </Dropdown>
          <div className="header-langue-select">
            <Select
              defaultValue={localStorage.getItem("lang") || "lang_vi"}
              style={{ width: 80 }}
              onChange={(value) => {
                localStorage.setItem("lang", value);
                window.location.reload();
              }}
            >
              <Option value="lang_vi">
                <Tooltip title="Vietnamese">
                  <Space direction="horizontal">
                    <img src={vietnam} alt="flag" />
                    VN
                  </Space>
                </Tooltip>
              </Option>
              {/* <Option value="lang_en">
                <Tooltip title="English">
                  <Space direction="horizontal">
                    <img src={englist} alt="flag" />
                    EN
                  </Space>
                </Tooltip>
              </Option>
              <Option value="lang_cn">
                <Tooltip title="Chinese">
                  <Space direction="horizontal">
                    <img src={china} alt="flag" />
                    CN
                  </Space>
                </Tooltip>
              </Option>
              <Option value="lang_jp">
                <Tooltip title="Japanese">
                  <Space direction="horizontal">
                    <img src={japan} alt="flag" />
                    JP
                  </Space>
                </Tooltip>
              </Option>
              <Option value="lang_kr">
                <Tooltip title="Korean">
                  <Space direction="horizontal">
                    <img src={korean} alt="flag" />
                    KR
                  </Space>
                </Tooltip>
              </Option> */}
            </Select>
          </div>
          <Spin spinning={loading} size={"default"}>
            <AutoComplete
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={500}
              options={options}
              filterOption={(inputValue, option) => {
                if (option.value && inputValue) {
                  return (
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  );
                } else {
                  return false;
                }
              }}
            >
              <Input
                className="header-search"
                placeholder="Tìm kiếm ở đây..."
                allowClear
                prefix={<SearchOutlined />}
              />
            </AutoComplete>
          </Spin>
        </Col>
      </Row>
    </>
  );
}

const menuUserActions = (
  <Menu
    style={{ padding: 10, borderRadius: "5px" }}
    items={[
      // {
      //   label: (
      //     <Space direction="horizontal" size={"middle"}>
      //       <ProfileOutlined />
      //       <Typography.Text>Hồ sơ</Typography.Text>
      //     </Space>
      //   ),
      //   key: "0",
      // },
      // {
      //   label: (
      //     <Space direction="horizontal" size={"middle"}>
      //       <SettingOutlined />
      //       <Typography.Text>Cài đặt</Typography.Text>
      //     </Space>
      //   ),
      //   key: "1",
      // },
      {
        type: "divider",
      },
      {
        label: (
          <Space
            direction="horizontal"
            size={"middle"}
            onClick={(e) => {
              deleteCookie("jwt");
              window.location.href = "/cp";
            }}
          >
            <LogoutOutlined></LogoutOutlined>
            <Typography.Text>Đăng xuất</Typography.Text>
          </Space>
        ),
        key: "2",
      },
    ]}
  />
);

function TransferOptions({
  hideDrawer,
  placement,
  visible,
  handleSidenavType,
  handleChangeColor,
  handleFixedNavbar,
  handleSidenavColor,
  sidenavType,
}) {
  return (
    <Drawer
      className="settings-drawer"
      mask={true}
      width={360}
      onClose={hideDrawer}
      placement={placement}
      visible={visible}
    >
      <div layout="vertical">
        <div className="header-top">
          <Title level={4}>
            Trình cấu hình
            <Text className="subtitle">
              Xem các tùy chọn bảng điều khiển của chúng tôi.
            </Text>
          </Title>
        </div>

        <div className="sidebar-color">
          <Title level={5}>Màu thanh bên</Title>
          <div className="theme-color mb-2">
            <div className="">
              <Button
                type="primary"
                onClick={() => {
                  handleSidenavColor("#1890ff");
                }}
              >
                1
              </Button>
              <Button
                type="success"
                onClick={() => {
                  handleSidenavColor("#52c41a");
                }}
              >
                1
              </Button>
              <Button
                type="danger"
                onClick={() => {
                  handleSidenavColor("#d9363e");
                  ConfigProvider.config({
                    theme: {
                      primaryColor: "#d9363e",
                      errorColor: "#ff4d4f",
                      warningColor: "#faad14",
                      successColor: "#52c41a",
                      infoColor: "#1890ff",
                    },
                  });
                }}
              >
                1
              </Button>
              <Button
                type="yellow"
                onClick={() => {
                  handleSidenavColor("#fadb14");
                }}
              >
                1
              </Button>

              <Button
                type="black"
                onClick={() => {
                  handleSidenavColor("#111");
                }}
              >
                1
              </Button>
            </div>
          </div>

          <div className="sidebarnav-color mb-2">
            <Title level={5}>Màu nền thanh điều hướng</Title>
            <Text>Chọn giữa 2 loại trang khác nhau.</Text>
            <div className="trans">
              <Button
                type={sidenavType === "transparent" ? "primary" : "white"}
                onClick={() => {
                  handleSidenavType("transparent");
                  handleChangeColor("transparent");
                }}
              >
                TRONG SUỐT
              </Button>
              <Button
                type={sidenavType === "#fff" ? "primary" : "white"}
                onClick={() => {
                  handleSidenavType("#fff");
                  handleChangeColor("#fff");
                }}
              >
                TRẮNG
              </Button>
            </div>
          </div>
          <div className="fixed-nav mb-2">
            <Title level={5}>Ghim thanh tiêu đề</Title>
            <Switch
              onChange={(e) => handleFixedNavbar(e)}
              defaultChecked={
                localStorage.getItem("fixedNavbar") === "true" ? true : false
              }
            />
          </div>
          <div className="ant-docment">
            {/* <ButtonContainer>
           <Button type="black" size="large">
             FREE DOWNLOAD
           </Button>
           <Button size="large">VIEW DOCUMENTATION</Button>
          </ButtonContainer> */}
          </div>
          <div className="viewstar">
            {/* <a href="#pablo">{<StarOutlined />} Star</a>
          <a href="#pablo"> 190</a> */}
          </div>

          <div className="ant-thank">
            <Title level={5} className="mb-2">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
            </Title>
            {/* <div className="social">
              <Button type="black">{<MailOutlined />}Email</Button>
              <Button type="black">{<FacebookFilled />}FaceBook</Button>
            </div> */}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function TimeCountDown({ disconections }) {
  const NetWorkStatus = useNetWork();
  const { Day, timer } = useClock();
  useEffect(() => {
    if (NetWorkStatus) {
      openNotificationWithIcon(
        "success",
        "Bạn đã trực tuyến trở lại.",
        "",
        4.5,
        "bottomLeft",
      );
    } else {
      openNotificationWithIcon(
        "warning",
        "Bạn đang ngoại tuyến.",
        "",
        4.5,
        "bottomLeft",
      );
    }
  }, [NetWorkStatus]);

  return (
    <Space direction="horizontal" size={"middle"}>
      <Typography.Title
        level={4}
        style={{
          height: "100%",
          transform: "translateY(8px)",
        }}
      >
        {Day}
      </Typography.Title>
      <Typography.Title
        level={3}
        style={{
          height: "100%",
          transform: "translateY(8px)",
          color: "#e70000",
          fontWeight: "bold",
          fontSize: 26,
        }}
      >
        {timer}
      </Typography.Title>

      {!NetWorkStatus ? disconect : svg}
      {!NetWorkStatus ? (
        <Typography.Title
          level={5}
          style={{
            height: "100%",
            transform: "translateY(8px)",
            color: "red",
          }}
        >
          Mất kết nối...
        </Typography.Title>
      ) : (
        ""
      )}
    </Space>
  );
}

export default memo(TransferOptions);

export const Header = memo(_Header);
