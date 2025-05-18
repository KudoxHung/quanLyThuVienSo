import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { ContactAndIntroduction } from "../../../../admin/api/contactAndIntroduction";
import { openNotificationWithIcon } from "../../../utils";
import { Card, Col, Row, Skeleton, Spin, Typography } from "antd";
import DOMPurify from "dompurify";

function _IntroductionPageLayout() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 1)
      .then((res) => {
        setContent(res[0].col);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cố gì đó không ổn",
          err?.response?.data?.message || err?.message,
        );
      });
  }, []);
  useEffect(() => {
    document.title = "Giới thiệu";
  }, []);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div className="Introduction Container" style={{ height: "auto" }}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={loading}>
            <Skeleton loading={loading} active avatar paragraph={{ rows: 17 }}>
              <Card
                bordered={false}
                className="criclebox h-full"
                style={{ height: content ? "auto" : "90vh" }}
              >
                <Typography.Title level={4}>Giới thiệu chung</Typography.Title>
                <div dangerouslySetInnerHTML={createMarkup(content)}></div>
              </Card>
            </Skeleton>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export const IntroductionPageLayout = WithErrorBoundaryCustom(
  _IntroductionPageLayout,
);
