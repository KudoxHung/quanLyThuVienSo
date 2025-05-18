import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import {
  deleteCookie,
  getCookie,
  openNotificationWithIcon,
  setCookie,
} from "../../../../client/utils";
import { authAdmin } from "../../../api";
import background from "../../../asset/logo/LogoNote_TachNen.png";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Layout,
  Row,
  Switch,
  Typography,
} from "antd";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

function _LoginAdminLayout() {
  const [result] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(checked) {
    // console.log(`switch to ${checked}`);
  }

  const onFinish = (values) => {
    setLoading(true);
    if (getCookie("jwt")) {
      deleteCookie("jwt");
    }
    authAdmin
      .login(values.Username, values.password)
      .then((res) => {
        if (
          res.roleList.find((item) => item.nameRole === "Admin") &&
          res.success
        ) {
          setCookie("jwt", res.data.accessToken, { path: "/" });
          setTimeout(() => {
            openNotificationWithIcon("success", "Đăng nhập", res?.message);
            window.location.href = "/admin/dashboard";
          }, 1000);
        } else {
          openNotificationWithIcon(
            "warning",
            "Đăng nhập thất bại",
            "Bạn không có quyền truy cập vào trang này",
          );
        }
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Đăng nhập thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    document.title = "Login Admin";
  }, []);

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Header>
          <div
            className="header-col header-brand"
            style={{ textAlign: "center" }}
          >
            <Typography.Title level={3} style={{ lineHeight: 3 }}>
              <span style={{ color: "#0E2A6E" }}>NOTE</span>
              {/*<span style={{ color: "#CA3838" }}>Đạt</span>*/}
            </Typography.Title>
          </div>
          <div className="header-col header-nav">
            {/* <Menu mode="horizontal">
              <Menu.Item>
                <Link to="#">
                  <span> Company</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="#">
                  <span> About Us</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="#">
                  <span> Teams</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="#">
                  <span> Products</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="#">
                  <span> Blogs</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="#">
                  <span> Pricing</span>
                </Link>
              </Menu.Item>
            </Menu> */}
          </div>
        </Header>
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Đăng nhập</Title>
              <Title className="font-regular text-muted" level={5}>
                Nhập tên đăng nhập và mật khẩu của bạn để đăng nhập
              </Title>
              <Form onFinish={onFinish} layout="vertical" className="row-col">
                <Form.Item
                  className="username"
                  label="Tên đăng nhập"
                  name="Username"
                  hasFeedback
                  validateStatus={
                    result
                      ? result.result === "success"
                        ? "success"
                        : "warning"
                      : undefined
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đăng nhập!",
                    },
                  ]}
                >
                  <Input placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Mật khẩu"
                  name="password"
                  hasFeedback
                  validateStatus={
                    result
                      ? result.result === "success"
                        ? "success"
                        : "warning"
                      : undefined
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu !",
                    },
                  ]}
                >
                  <Input.Password
                    type="password"
                    allowClear
                    placeholder="Mật khẩu"
                  />
                </Form.Item>

                <Form.Item
                  name="remember"
                  className="aligin-center"
                  valuePropName="checked"
                >
                  <Switch defaultChecked onChange={onChange} />
                  Ghi nhớ
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={loading}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 12, margin: "auto" }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <Image
                src={background}
                alt="background"
                width={"100%"}
                preview={false}
                style={{ maxWidth: "100%", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Content>
        <Footer>
          {/* <Menu mode="horizontal">
            <Menu.Item>Company</Menu.Item>
            <Menu.Item>About Us</Menu.Item>
            <Menu.Item>Teams</Menu.Item>
            <Menu.Item>Products</Menu.Item>
            <Menu.Item>Blogs</Menu.Item>
            <Menu.Item>Pricing</Menu.Item>
          </Menu>
          <Menu mode="horizontal" className="menu-nav-social">
            <Menu.Item>
              <Link to="#">{<DribbbleOutlined />}</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="#">{<TwitterOutlined />}</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="#">{<InstagramOutlined />}</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="#">
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z"></path>
                </svg>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="#">{<GithubOutlined />}</Link>
            </Menu.Item>
          </Menu>
          <p className="copyright">
            {" "}
            Copyright © 2022 by<a href="#pablo">the company NOTE</a>.{" "}
          </p> */}
        </Footer>
      </Layout>
    </>
  );
}

export const LoginAdminLayout = WithErrorBoundaryCustom(_LoginAdminLayout);
