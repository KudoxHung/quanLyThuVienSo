// import { RightOutlined } from "@ant-design/icons";
import React from "react";
import { memo } from "react";

import logoDpd from "../../asset/logo/LogoTHPTVMD.png";
import { Card, Col, Row, Typography } from "antd";
function CompanyIntroduction() {
  const { Title, Text, Paragraph } = Typography;
  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Row gutter>
            <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mobile-24">
              <div className="h-full col-content p-20">
                <div className="ant-muse">
                  <Text>
                    Được xây dựng và phát triển bởi NVH sinh viên Đại học Thủ
                    Dầu Một
                  </Text>
                  {/* <Title level={5}>NVH</Title> */}
                  {/* <Paragraph className="lastweek mb-36">Là sinh viên Đại học Thủ Dầu Một. </Paragraph> */}
                </div>
                <div className="card-footer">
                  <a className="icon-move-right" href="#pablo">
                    {/* Read More */}
                    {/* {<RightOutlined />} */}
                  </a>
                </div>
              </div>
            </Col>
            <Col
              xs={24}
              md={12}
              sm={24}
              lg={12}
              xl={10}
              className="col-img"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="ant-cret text-right">
                <img
                  src={logoDpd}
                  alt=""
                  className="border10"
                  style={{ objectFit: "contain", width: 150, height: 100 }}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
        <Card bordered={false} className="criclebox card-info-2 h-full">
          <div className="gradent h-full col-content">
            <div className="card-content">
              <Title level={5}>Làm việc với những gì tốt nhất</Title>
              <p>Tạo ra các hệ thống tối ưu cho người dùng</p>
            </div>
            <div className="card-footer">
              <a className="icon-move-right" href="#pablo">
                {/* Read More */}
                {/* <RightOutlined /> */}
              </a>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default memo(CompanyIntroduction);
