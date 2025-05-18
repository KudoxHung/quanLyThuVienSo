import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { ContactAndIntroduction } from "../../../../admin/api/contactAndIntroduction";
import CompanyIntroduction from "../../../../admin/components/companyIntroduction/CompanyIntroduction";
import { openNotificationWithIcon } from "../../../utils";
import { Card, Col, Row, Space, Spin, Typography } from "antd";

function _ContactPagelayout() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 2)
      .then((res) => {
        setData(res[0]);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Có lỗi gì đó.", err?.message);
      });
  }, []);
  useEffect(() => {
    document.title = "Liên hệ";
  }, []);

  return (
    <div
      className="ContactPage Container"
      style={{ height: "auto", padding: 10 }}
    >
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={4}>Thông tin liên Hệ</Typography.Title>
              <Row gutter={[24, 0]}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-24">
                  <Space
                    style={{
                      margin: "10px",
                      width: "100%",
                    }}
                    direction="vertical"
                  >
                    <Typography.Title level={5}>
                      {data?.col || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col1 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col2 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col3 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col4 || ""}
                    </Typography.Title>

                    {/* <Typography.Title level={5}>
                  {data?.col10 || ""}
                </Typography.Title> */}
                  </Space>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-24">
                  <Space
                    style={{
                      margin: "10px",
                      width: "100%",
                    }}
                    direction="vertical"
                  >
                    <Typography.Title level={5}>
                      {data?.col5 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col6 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col7 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col8 || ""}
                    </Typography.Title>
                    <Typography.Title level={5}>
                      {data?.col9 || ""}
                    </Typography.Title>
                    {/* <Typography.Title level={5}>
                  {data?.col10 || ""}
                </Typography.Title> */}
                  </Space>
                </Col>
              </Row>
            </Card>
          </Spin>
        </Col>
      </Row>
      {/* <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={false}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={4}>Bản đồ</Typography.Title>
              <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    title="bản đồ"
                    className="gmap_iframe"
                    width="100%"
                    height={500}
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    src="https://maps.google.com/maps?width=1080&amp;height=600&amp;hl=en&amp;q=401 Lê Hồng Phong, Phú Hoà, Thủ Dầu Một, Bình Dương&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  ></iframe>
                </div>
              </div>
            </Card>
          </Spin>
        </Col>
      </Row> */}
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={false}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={4}>
                Phần mềm được phát triển bởi
              </Typography.Title>
              <CompanyIntroduction />
            </Card>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export const ContactPagelayout = WithErrorBoundaryCustom(_ContactPagelayout);
