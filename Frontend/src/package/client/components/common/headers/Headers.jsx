import { memo } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { ContactAndIntroduction } from "../../../../admin/api/contactAndIntroduction";
import logo from "../../../../admin/asset/logo/LogoTHPTVMD.png";
import { users } from "../../../api";
import { books } from "../../../api/books";
import { booksConnect } from "../../../api/booksConnect";
import { deleteCookie, getCookie, openNotificationWithIcon } from "../../../utils";
import { CaretDownOutlined, MenuOutlined, MenuUnfoldOutlined, WalletOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Badge,
  Button,
  Col,
  Drawer,
  Dropdown,
  Grid,
  Image,
  Input,
  Menu,
  Row,
  Space,
  Spin,
  Typography
} from "antd";
import { debounce } from "lodash";

import "./Headers.css";
const { useBreakpoint } = Grid;

function _Headers() {
  // const breakpoint = useBreakpoint();
  const [scroll, setscroll] = useState(false);
  const [scrollVisible, setscrollVisible] = useState(false);
  const [scrollUp, setscrollUp] = useState(false);
  const [loading, setloading] = useState(true);
  const [typeBooks, settypeBooks] = useState([]);
  const [typeDocumentDigital, settypeDocumentDigital] = useState([]);
  const [loadingTypeDocumentDigital, setloadingTypeDocumentDigital] = useState(true);
  const [typeDocumentDigitalConnect, settypeDocumentDigitalConnect] = useState([]);
  const [loadingTypeDocumentDigitalConnect, setloadingTypeDocumentDigitalConnect] = useState(true);
  const [contactAndIntroduction, setcontactAndIntroduction] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        booksConnect
          .getTypeBooks(4)
          .then((res) => {
            settypeDocumentDigitalConnect(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách loại tài liệu dùng chung không thành công",
              err?.response?.data?.message || err?.message
            );
          })
          .finally(() => {
            setloadingTypeDocumentDigitalConnect(false);
          }),
        books
          .getTypeBooks(3)
          .then((res) => {
            settypeDocumentDigital(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách loại tài liệu thất bại",
              err?.response?.data?.message || err?.message
            );
          })
          .finally(() => {
            setloadingTypeDocumentDigital(false);
          }),
        books
          .getTypeBooks()
          .then((res) => {
            settypeBooks(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách loại sách thất bại",
              err?.response?.data?.message || err?.message
            );
          })
          .finally(() => {
            setloading(false);
          }),
        ContactAndIntroduction.read(1, 1, 3)
          .then((res) => {
            setcontactAndIntroduction({ ...res[0] });
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy cấu hình màu sắc thất bại",
              err?.response?.data?.message || err?.message
            );
          })
          .finally(() => {
            setloading(false);
          })
      ]);
    };
    fetchData();
  }, []);

  const iconStyle = {
    fontSize: "24px",
    color: contactAndIntroduction?.col1 || "#fff",
    fontWeight: "bold",
    paddingTop: "10px"
  };
  const navigate = useNavigate();

  useEffect(() => {
    const handleScrooll = () => {
      if (window.scrollY > 50) {
        setscrollVisible(true);
      } else {
        setscrollVisible(false);
      }
      if (window.scrollY > 200) {
        setscroll(true);
      } else {
        setscroll(false);
      }
    };
    const mouseWheel = (e) => {
      let delta = e.wheelDelta;
      if (delta > 0) {
        setscrollUp(true);
      } else {
        setscrollUp(false);
      }
    };
    window.addEventListener("mousewheel", mouseWheel);
    window.addEventListener("scroll", handleScrooll);
  }, []);

  function getItem(label, key) {
    return {
      key,
      icon: <WalletOutlined />,
      style: {
        border: "1px solid #ccc",
        margin: 10,
        background: contactAndIntroduction?.col || "#fff",
        color: contactAndIntroduction?.col1 || "#000"
      },
      label,
      onClick: () => {
        navigate(`/category-page/${key}`, { state: { title: label } });
      }
    };
  }
  function getItemConnect(label, key) {
    return {
      key,
      icon: <WalletOutlined />,
      style: {
        border: "1px solid #ccc",
        margin: 10,
        background: contactAndIntroduction?.col || "#fff",
        color: contactAndIntroduction?.col1 || "#000"
      },
      label,
      onClick: () => {
        navigate(`/category-page-connect/${key}`, { state: { title: label } });
      }
    };
  }
  const arr = typeBooks.map((item) => getItem(item.docTypeName, item.id));
  const menu = (
    <Menu
      style={{
        border: "1px solid #ffffff",
        background: contactAndIntroduction?.col
      }}
      items={[...arr]}
    />
  );
  const arr1 = typeDocumentDigital.map((item) => getItem(item.docTypeName, item.id));
  const arr1Connect = typeDocumentDigitalConnect.map((item) => getItemConnect(item.docTypeName, item.id));
  const menuDigital = (
    <Menu
      style={{
        border: "1px solid #ffffff",
        background: contactAndIntroduction?.col
      }}
      items={[...arr1]}
    />
  );
  const menuDigitalConnect = (
    <Menu
      style={{
        border: "1px solid #ffffff",
        background: contactAndIntroduction?.col
      }}
      items={[...arr1Connect]}
    />
  );

  return (
    <Spin spinning={loading}>
      <div
        className={`header ${scroll ? "sticky" : ""}  ${
          scrollVisible ? "sticky-hide" : ""
        }  ${scrollUp ? "sticky-up" : ""}`}
      >
        {/* <div className="header"> */}
        <HeaderAbove logoDpd={logo} scroll={scroll} contactAndIntroduction={contactAndIntroduction} />
        <HeaderUnder
          menuDigital={menuDigital}
          menuDigitalConnect={menuDigitalConnect}
          menu={menu}
          iconStyle={iconStyle}
          loading={loading}
          contactAndIntroduction={contactAndIntroduction}
          loadingTypeDocumentDigital={loadingTypeDocumentDigital}
          loadingTypeDocumentDigitalConnect={loadingTypeDocumentDigitalConnect}
        />
      </div>
    </Spin>
  );
}
//#region HeaderAbove
function HeaderAbove({ logoDpd, scroll, contactAndIntroduction }) {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const [value, setValue] = useState([]);
  const [user, setUser] = useState(null);

  const handleSearch = (value, event) => {
    if (value === "") {
      navigate("/");
    } else {
      navigate(`/search-page/${value.key}`);
      setTimeout(() => {
        navigate(`/search-page/${value.key}`);
      }, 1000);
    }
  };

  useEffect(() => {
    if (getCookie("jwt")) {
      users
        .getUser()
        .then((res) => {
          setUser(res);
        })
        .catch((err) => {
          openNotificationWithIcon("error", "Đăng nhập thất bại", err?.response?.data?.message || err?.message);
          if (err?.response?.data?.message || err?.message === "Không tìm thấy token !") {
            deleteCookie("jwt");
          }
        });
    }
  }, []);

  const handleLogout = (name) => {
    deleteCookie(name);
    navigate("/", { replace: true });
  };

  return (
    <div className="header-above Container">
      <Row>
        <Col
          span={6}
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Link to="">
            {scroll ? (
              <Typography.Title
                level={1}
                style={{
                  marginTop: 60,
                  color: "#081C6F",
                  lineHeight: 1,
                  marginBottom: 10,
                  display: breakpoint.xs ? "none" : "block"
                }}
              >
                NOTE
              </Typography.Title>
            ) : (
              <Image
                width={150}
                height={50}
                src={logoDpd}
                alt="logo"
                preview={false}
                style={
                  breakpoint.xl
                    ? {}
                    : breakpoint.sm
                      ? {
                          width: 120,
                          height: 50,
                          marginLeft: 30,
                          objectFit: "contain"
                        }
                      : breakpoint.xs
                        ? { display: "none" }
                        : { objectFit: "contain" }
                }
              />
            )}
          </Link>
        </Col>
        <Col span={18}>
          <Space
            direction={"vertical"}
            size={scroll ? "middle" : "small"}
            style={{
              width: "100%",
              marginTop: scroll ? "60px" : "8px",
              justifyContent: scroll ? "center" : ""
            }}
          >
            <div
              className="header-above_auth"
              style={
                breakpoint.xl
                  ? {}
                  : breakpoint.sm
                    ? { fontSize: 11, margin: "10px 40px 0 0" }
                    : breakpoint.xs
                      ? { fontSize: 11, margin: "10px 40px 0 0" }
                      : {}
              }
            >
              {getCookie("jwt") ? (
                <NavLink to={"#"} className="header-above_auth__item" onClick={(e) => handleLogout("jwt")}>
                  Đăng xuất
                </NavLink>
              ) : (
                <NavLink to="/login" className="header-above_auth__item">
                  Đăng nhập
                </NavLink>
              )}
              <span
                style={{
                  fontWeight: "bold",
                  padding: "0 5px"
                }}
                className="header-above_auth__item"
              >
                |
              </span>
              {getCookie("jwt") ? (
                <NavLink to={`/profile-user/${user?.data?.id}`} className="header-above_auth__item">
                  {user?.data?.fullname}
                </NavLink>
              ) : (
                <NavLink to="/Register" className="header-above_auth__item">
                  Đăng ký
                </NavLink>
              )}
            </div>
            <div className="header-above_search">
              <DebounceSelect
                contactAndIntroduction={contactAndIntroduction}
                value={value}
                fetchOptions={fetchUserList}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                onSelect={handleSearch}
                style={{
                  width: "100%"
                }}
              />
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
//#endregion

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  const suffix = [
    <svg
      t="1661831116301"
      className="icon"
      viewBox="0 0 1025 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2442"
      width="20"
      height="20"
    >
      <path
        d="M1008.839137 935.96571L792.364903 719.491476a56.783488 56.783488 0 0 0-80.152866 0 358.53545 358.53545 0 1 1 100.857314-335.166073 362.840335 362.840335 0 0 1-3.689902 170.145468 51.248635 51.248635 0 1 0 99.217358 26.444296 462.057693 462.057693 0 1 0-158.255785 242.303546l185.930047 185.725053a51.248635 51.248635 0 0 0 72.568068 0 51.248635 51.248635 0 0 0 0-72.978056z"
        fill={props.contactAndIntroduction?.col || "#df1f26"}
        p-id="2443"
      ></path>
      <path
        d="M616.479587 615.969233a50.428657 50.428657 0 0 0-61.498362-5.534852 174.655348 174.655348 0 0 1-177.525271 3.484907 49.403684 49.403684 0 0 0-58.833433 6.76482l-3.074918 2.869923a49.403684 49.403684 0 0 0 8.609771 78.10292 277.767601 277.767601 0 0 0 286.992355-5.739847 49.403684 49.403684 0 0 0 8.404776-76.667958z"
        fill={props.contactAndIntroduction?.col || "#df1f26"}
        p-id="2444"
      ></path>
    </svg>
  ];
  return (
    <AutoComplete
      labelInValue
      dropdownMatchSelectWidth={252}
      style={{
        width: 300
      }}
      options={options}
      {...props}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      onSearch={debounceFetcher}
    >
      <Input
        placeholder="Nhập thứ gì đó để tìm kiếm"
        allowClear
        size="middle"
        className="header-above_search__input"
        suffix={suffix}
      ></Input>
    </AutoComplete>
  );
} // Usage of DebounceSelect

async function fetchUserList(username) {
  if (username === "") return [];
  return books.SuggestBook(username).then((res) => {
    return res.map((user) => ({
      label: user.nameDocument,
      value: user.nameDocument
    }));
  });
}

//#region HeaderUnder
function HeaderUnder({
  menu,
  iconStyle,
  loading,
  contactAndIntroduction,
  loadingTypeDocumentDigital,
  loadingTypeDocumentDigitalConnect,
  menuDigital,
  menuDigitalConnect
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [current, setCurrent] = useState("1");
  const breakpoint = useBreakpoint();
  const colorTextHeader = {
    color: contactAndIntroduction?.col1 || "#fff"
  };
  const check = menu.props.items.length * 50 >= 500;
  const check2 = menuDigital.props.items.length * 50 >= 500;

  return (
    <div className="header-under" style={{ background: contactAndIntroduction?.col || "#df1f26" }}>
      <Row className="Container">
        <Col
          span={6}
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Spin spinning={loading}>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              overlayStyle={{
                height: check ? 500 : menu.props.items.length * 50,
                overflow: "auto"
              }}
            >
              <Button
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "white",
                  background: contactAndIntroduction?.col || "#df1f26",
                  border: "1px solid white",
                  padding: "0 21px 41px 21px"
                }}
              >
                <Space>
                  <MenuOutlined style={iconStyle} />
                  {breakpoint.lg ? <span style={colorTextHeader}>Danh mục sách</span> : breakpoint.md ? "" : ""}
                  <CaretDownOutlined style={iconStyle} />
                </Space>
              </Button>
            </Dropdown>
          </Spin>
        </Col>
        <Col span={18}>
          <Drawer width={"80%"} placement="left" onClose={() => setMenuVisible(false)} visible={menuVisible}>
            <Menu
              onClick={(e) => {
                setCurrent(e.key);
              }}
              selectedKeys={[current]}
              defaultSelectedKeys={["1"]}
              mode="vertical"
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-start",
                width: "100%"
              }}
            >
              <Menu.Item key={"1"}>
                <NavLink to={"/"} onClick={(e) => setMenuVisible(false)}>
                  Trang chủ
                </NavLink>
              </Menu.Item>
              <Badge.Ribbon text="Trực tuyến" color={"pink"} style={{ transform: "translateY(-16px)" }}>
                <Menu.SubMenu key={"2"} title="Tài liệu số">
                  {menuDigital}
                </Menu.SubMenu>
              </Badge.Ribbon>
              <Badge.Ribbon text="Dùng chung" color={"pink"} style={{ transform: "translateY(-16px)" }}>
                <Menu.SubMenu key={"3"} title="Tài liệu số">
                  {menuDigitalConnect}
                </Menu.SubMenu>
              </Badge.Ribbon>
              <Menu.Item key={"4"}>
                <NavLink to={"/categoryVes"} onClick={(e) => setMenuVisible(false)}>
                  Bài giảng điện tử
                </NavLink>
              </Menu.Item>

              <Menu.Item key={"5"}>
                <NavLink to={"/video"} onClick={(e) => setMenuVisible(false)}>
                  Video
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"6"}>
                <NavLink to={"/sach-noi"} onClick={(e) => setMenuVisible(false)}>
                  Sách nói
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"7"}>
                <NavLink to={"/categoryVes"} onClick={(e) => setMenuVisible(false)}>
                  Bài giảng điện tử
                </NavLink>
              </Menu.Item>

              <Menu.Item key={"8"}>
                <NavLink to={"/video"} onClick={(e) => setMenuVisible(false)}>
                  Video
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"9"}>
                <NavLink to={"/sach-noi"} onClick={(e) => setMenuVisible(false)}>
                  Sách nói
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"10"}>
                <Badge.Ribbon text="Ebook" color={"pink"} style={{ transform: "translateY(-16px)" }}>
                  <NavLink
                    to={"/sach-ebook"}
                    onClick={(e) => {
                      e.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
                      window.location.href = "https://ebook.thuvienhocduong.vn/";
                      setMenuVisible(false); // Ẩn menu nếu cần thiết
                    }}
                  >
                    Sách
                  </NavLink>
                </Badge.Ribbon>
              </Menu.Item>
              <Menu.Item key={"11"}>
                <NavLink to={"/gioi-thieu"} onClick={(e) => setMenuVisible(false)}>
                  Giới thiệu
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"12"}>
                <NavLink to={"/lien-he"} onClick={(e) => setMenuVisible(false)}>
                  Liên hệ
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"13"}>
                <NavLink to={"/cp"}>Quản trị</NavLink>
              </Menu.Item>
            </Menu>

            <div className="ant-thank">
              <Typography.Title level={5} className="mb-2">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
              </Typography.Title>
            </div>
          </Drawer>
          {breakpoint.xs ? (
            <Space style={{ float: "right", margin: "6px 6px 0 0 " }}>
              <MenuUnfoldOutlined
                onClick={() => setMenuVisible(true)}
                style={{ color: "#fff", fontSize: 30, cursor: "pointer" }}
              />
            </Space>
          ) : (
            <Menu
              onClick={(e) => {
                setCurrent(e.key);
              }}
              selectedKeys={[current]}
              defaultSelectedKeys={["1"]}
              mode="horizontal"
              style={{
                color: "white",
                background: contactAndIntroduction?.col || "#df1f26",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                width: "100%"
              }}
            >
              <Menu.Item key={"1"}>
                <NavLink to={"/"} style={colorTextHeader}>
                  Trang chủ
                </NavLink>
              </Menu.Item>
              <Badge.Ribbon text="Đơn vị" color={"pink"} style={{ transform: "translateY(-16px)" }}>
                <Spin spinning={loadingTypeDocumentDigital}>
                  <Dropdown
                    overlay={menuDigital}
                    trigger={["click"]}
                    overlayStyle={{
                      height: check2 ? 500 : menuDigital.props.items.length * 50,
                      overflow: "auto"
                    }}
                  >
                    <Menu.Item key={"2"}>
                      {/* <Badge
                                              count={<HeartIcon style={{ color: "red" }} />}
                                              offset={[10, -2]}
                                              size="large"
                                            > */}
                      <Typography.Text style={colorTextHeader}>Tài liệu số</Typography.Text>
                      {/* </Badge> */}
                    </Menu.Item>
                  </Dropdown>
                </Spin>
              </Badge.Ribbon>
              {/* <Badge.Ribbon text="Dùng chung" color={"pink"} style={{ transform: "translateY(-16px)" }}>
                <Spin spinning={loadingTypeDocumentDigitalConnect}>
                  <Dropdown
                    overlay={menuDigitalConnect}
                    trigger={["click"]}
                    overlayStyle={{
                      height: check2 ? 500 : menuDigitalConnect.props.items.length * 50,
                      overflow: "auto"
                    }}
                  >
                    <Menu.Item key={"3"}>
                      <Typography.Text style={colorTextHeader}>Tài liệu số</Typography.Text>
                    </Menu.Item>
                  </Dropdown>
                </Spin>
              </Badge.Ribbon> */}
              <Menu.SubMenu style={colorTextHeader} key={"2"} title="Học liệu điện tử">
                <Menu.Item key={"4"}>
                  <NavLink to={"/categoryVes"} onClick={(e) => setMenuVisible(false)}>
                    Bài giảng điện tử
                  </NavLink>
                </Menu.Item>
                <Menu.Item key={"5"}>
                  <NavLink to={"/video"} onClick={(e) => setMenuVisible(false)}>
                    Video
                  </NavLink>
                </Menu.Item>
                <Menu.Item key={"6"}>
                  <NavLink to={"/sach-noi"} onClick={(e) => setMenuVisible(false)}>
                    Sách nói
                  </NavLink>
                </Menu.Item>
              </Menu.SubMenu>
              {/* <Menu.Item key={"7"}>
                <Badge.Ribbon text="Ebook" color={"pink"} style={{ transform: "translateY(-16px)" }}>
                  <NavLink
                    to={"/sach-ebook"}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "https://ebook.thuvienhocduong.vn/";
                      setMenuVisible(false);
                    }}
                    style={colorTextHeader}
                  >
                    Sách
                  </NavLink>
                </Badge.Ribbon>
              </Menu.Item> */}

              <Menu.Item key={"8"}>
                <NavLink to={"/gioi-thieu"} style={colorTextHeader}>
                  Giới thiệu
                </NavLink>
              </Menu.Item>

              <Menu.Item key={"9"}>
                <NavLink to={"/lien-he"} style={colorTextHeader}>
                  Liên hệ
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"10"}>
                <NavLink to={"/cp"} style={colorTextHeader}>
                  Quản trị
                </NavLink>
              </Menu.Item>
            </Menu>
          )}
        </Col>
      </Row>
    </div>
  );
}
//#endregion

export const Headers = memo(_Headers);
