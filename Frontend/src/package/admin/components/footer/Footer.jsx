import { memo, useEffect, useState } from "react";

import { users } from "../../api";
import { HeartFilled } from "@ant-design/icons";
import { Col, Layout, Row } from "antd";

function _Footer() {
  const { Footer: AntFooter } = Layout;
  const [version, setVersion] = useState("");
  const getVersionApi = async () => {
    const res = await users.getVersion();
    setVersion(res);
  };

  useEffect(() => {
    getVersionApi();
  }, []);

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2025, made with
            {<HeartFilled />} by
            <a href="#pablo" className="font-weight-bold" target="_blank">
              NVH
            </a>
            for a better web.
          </div>
        </Col>
        <Col xs={24} md={12} lg={12}>
          <div className="footer-menu">
            <ul>
              {/* <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  NOTE
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link text-muted"
                  target="_blank"
                >
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#pablo"
                  className="nav-link pe-0 text-muted"
                  target="_blank"
                >
                  License
                </a>
              </li> */}
            </ul>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export const Footer = memo(_Footer);
