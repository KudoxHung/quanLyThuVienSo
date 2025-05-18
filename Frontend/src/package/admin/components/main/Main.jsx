import { memo, useCallback, useEffect, useState } from "react";
import { Routes } from "react-router-dom";

import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { Sidenav } from "../sideNav/SideNav";
import { Affix, Layout } from "antd";

const { Header: AntHeader, Content, Sider } = Layout;

function _Main({ children }) {
  const [visible, setVisible] = useState(false);
  const [changeNavColor, setChangeNavColor] = useState(0);
  const [sidenavColor, setSidenavColor] = useState(
    localStorage.getItem("colorStyle"),
  );
  const [sidenavType, setSidenavType] = useState(
    localStorage.getItem("sideNavType"),
  );
  const [fixed, setFixed] = useState(localStorage.getItem("fixedNavbar"));
  // const [collapsed, setCollapsed] = useState(false);

  const openDrawer = useCallback(() => setVisible(!visible), [visible]);
  const handleSidenavType = useCallback((type) => {
    localStorage.setItem("sideNavType", type);
    setChangeNavColor((prev) => prev + 1);
  }, []);
  const handleSidenavColor = useCallback((color) => {
    localStorage.setItem("colorStyle", color);
    setChangeNavColor((prev) => prev + 1);
  }, []);
  const handleFixedNavbar = useCallback((type) => {
    localStorage.setItem("fixedNavbar", type);
    setChangeNavColor((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setSidenavColor(localStorage.getItem("colorStyle"));
    setSidenavType(localStorage.getItem("sideNavType"));
    setFixed(localStorage.getItem("fixedNavbar"));
  }, [changeNavColor]);

  return (
    <Layout
      className={`layout-dashboard`}
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        // collapsible
        // collapsed={collapsed}
        // onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""}`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider>
      <Layout>
        {fixed === "true" ? (
          <Affix>
            <AntHeader className={fixed === "true" ? "ant-header-fixed" : ""}>
              <Header
                onPress={openDrawer}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader>
            <Header
              onPress={openDrawer}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}

        <Content className="content-ant">
          <Routes>{children}</Routes>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export const Main = memo(_Main);
