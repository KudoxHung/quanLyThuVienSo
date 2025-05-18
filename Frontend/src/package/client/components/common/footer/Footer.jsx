import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { ContactAndIntroduction } from "../../../../admin/api/contactAndIntroduction";
import { openNotificationWithIcon } from "../../../utils";
import { BackTop, Col, Grid, Menu, Row, Spin, Typography } from "antd";

import "./Footer.css";
const { useBreakpoint } = Grid;

function _Footer() {
  const breakpoint = useBreakpoint();
  const [loading, setLoading] = useState(true);
  const [contactAndIntroduction, setcontactAndIntroduction] = useState({});
  const [ManagingUnit, setManagingUnit] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        ContactAndIntroduction.read(1, 1, 3)
          .then((res) => {
            setcontactAndIntroduction({ ...res[0] });
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy cấu hình màu sắc thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setLoading(false);
          }),
        ContactAndIntroduction.read(1, 1, 2)
          .then((res) => {
            setManagingUnit(res[0].col10);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy thông tin đơn vị thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, []);
  const colorTextFooter = {
    color: contactAndIntroduction?.col3 || "#fff",
  };

  return (
    <Spin spinning={loading}>
      <div
        className="header-under footer"
        style={{
          background: contactAndIntroduction?.col2 || "#2d2d7a",
        }}
      >
        <Row className="Container">
          <Col
            span={10}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography.Title
              level={3}
              className="footer-title"
              style={
                breakpoint.xl
                  ? { color: contactAndIntroduction?.col3 || "#fff" }
                  : breakpoint.sm
                    ? { fontSize: "18px" }
                    : breakpoint.xs
                      ? {
                          color: contactAndIntroduction?.col3 || "#fff",
                          fontSize: "11px",
                        }
                      : {}
              }
            >
              {ManagingUnit}
            </Typography.Title>
          </Col>
          <Col span={14}>
            <Menu
              defaultSelectedKeys={["1"]}
              mode="horizontal"
              style={{
                color: "white",
                background: contactAndIntroduction?.col2 || "#2d2d7a",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Menu.Item key={"1"}>
                <NavLink to={"/"} style={colorTextFooter}>
                  Trang chủ
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"2"}>
                <NavLink to={"/gioi-thieu"} style={colorTextFooter}>
                  Giới thiệu
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"3"}>
                <NavLink to={"/lien-he"} style={colorTextFooter}>
                  Liên hệ
                </NavLink>
              </Menu.Item>
              <Menu.Item key={"4"}>
                <NavLink to={"/cp"} style={colorTextFooter}>
                  Quản trị
                </NavLink>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
        <BackToTop />
      </div>
    </Spin>
  );
}

function BackToTop() {
  const style = {
    height: 40,
    width: 40,
    right: 40,
  };
  return <BackTop style={style} />;
}
export const Footer = React.memo(_Footer);
