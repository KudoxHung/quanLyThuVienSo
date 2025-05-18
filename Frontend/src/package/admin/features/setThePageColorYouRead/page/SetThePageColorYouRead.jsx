import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";

const colorThemes = [
  {
    name: "Tết nguyên đán",
    col: `#DF3B0A`,
    col1: `#FAAA3B`,
    col2: `#AB2706`,
    col3: `#908D54`,
  },
  {
    name: "Tết trung thu",
    col: `#A16D38`,
    col1: `#dcbb17`,
    col2: `#51300A`,
    col3: `#EF954E`,
  },
  {
    name: "Giáng sinh",
    col: `#e2e4e5`,
    col1: `#0e1a02`,
    col2: `#515f6b`,
    col3: `#060706`,
  },
  // {
  //   name: "U",
  //   col: `#FFD600`,
  //   col1: `#005BBC`,
  //   col2: `#FFD600`,
  //   col3: `#005BBC`,
  // },
  {
    name: "30/4 - 2/9 - Quốc Kỳ Việt Nam",
    col: `#DB2017`,
    col1: `#FFFF00`,
    col2: `#DB2017`,
    col3: `#FFFF00`,
  },
];

function _SetThePageColorYouRead() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setloading] = useState(true);
  const [postLength, setPostLength] = useState(0);
  const [color, setColor] = useState({
    col: "#FFD600",
    col1: "#005BBC",
    col2: "#FFD600",
    col3: "#005BBC",
  });

  useEffect(() => {
    document.title = "Cài đặt màu sắc trang bạn đọc";
  }, []);

  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 3)
      .then((res) => {
        setColor(
          res[0] || {
            col: "#FFD600",
            col1: "#005BBC",
            col2: "#FFD600",
            col3: "#005BBC",
          },
        );
        setloading(false);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Có lỗi gì đó.", err?.message);
      });
  }, [postLength]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.col = values.col?.hex || color?.col;
    values.col1 = values.col1?.hex || color?.col1;
    values.col2 = values.col2?.hex || color?.col2;
    values.col3 = values.col3?.hex || color?.col3;

    ContactAndIntroduction.create({ type: 3, ...values })
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon("success", "Lưu lại thành công", res?.message);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Có lỗi gì đó.",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const onSelectFinish = (values) => {
    setBtnLoading(true);
    values.col = values.col || color?.col;
    values.col1 = values.col1 || color?.col1;
    values.col2 = values.col2 || color?.col2;
    values.col3 = values.col3 || color?.col3;

    ContactAndIntroduction.create({ type: 3, ...values })
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon("success", "Lưu lại thành công", res?.message);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Có lỗi gì đó.",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const onColorChange = (nextColor) => {
    const mergedNextColor = { ...color, ...nextColor };
    setColor(mergedNextColor);
  };

  return (
    <div className="layout-content SetThePageColorYouRead">
      <Spin spinning={loading}>
        <Skeleton loading={loading} active avatar paragraph={{ rows: 5 }}>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <Typography.Title level={5}>
                  Thiết lập màu sắc trang bạn đọc
                </Typography.Title>
                <Form
                  onFinish={onFinish}
                  layout={"vertical"}
                  initialValues={{
                    remember: true,
                  }}
                  className="ant-advanced-search-form"
                  name="normal_login"
                >
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item label="Chủ đề thanh tiêu đề" name="col">
                        <SketchPicker
                          presetColors={[
                            "#B80000",
                            "#DB3E00",
                            "#FCCB00",
                            "#008B02",
                            "#006B76",
                            "#1273DE",
                            "#004DCF",
                            "#5300EB",
                            "#EB9694",
                            "#FAD0C3",
                            "#FEF3BD",
                            "#C1E1C5",
                            "#BEDADC",
                            "#C4DEF6",
                            "#BED3F3",
                            "#D4C4FB",
                          ]}
                          color={color.col}
                          onChange={({ hex }) => {
                            onColorChange({
                              col: hex,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Chủ đề chữ thanh tiêu đề" name="col1">
                        <SketchPicker
                          presetColors={[
                            "#B80000",
                            "#DB3E00",
                            "#FCCB00",
                            "#008B02",
                            "#006B76",
                            "#1273DE",
                            "#004DCF",
                            "#5300EB",
                            "#EB9694",
                            "#FAD0C3",
                            "#FEF3BD",
                            "#C1E1C5",
                            "#BEDADC",
                            "#C4DEF6",
                            "#BED3F3",
                            "#D4C4FB",
                          ]}
                          color={color.col1}
                          onChange={({ hex }) => {
                            onColorChange({
                              col1: hex,
                            });
                          }}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={btnLoading}
                        >
                          Lưu lại
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Chủ đề chân trang" name="col2">
                        <SketchPicker
                          presetColors={[
                            "#B80000",
                            "#DB3E00",
                            "#FCCB00",
                            "#008B02",
                            "#006B76",
                            "#1273DE",
                            "#004DCF",
                            "#5300EB",
                            "#EB9694",
                            "#FAD0C3",
                            "#FEF3BD",
                            "#C1E1C5",
                            "#BEDADC",
                            "#C4DEF6",
                            "#BED3F3",
                            "#D4C4FB",
                          ]}
                          color={color.col2}
                          onChange={({ hex }) => {
                            onColorChange({
                              col2: hex,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Chủ đề chữ chân trang" name="col3">
                        <SketchPicker
                          presetColors={[
                            "#B80000",
                            "#DB3E00",
                            "#FCCB00",
                            "#008B02",
                            "#006B76",
                            "#1273DE",
                            "#004DCF",
                            "#5300EB",
                            "#EB9694",
                            "#FAD0C3",
                            "#FEF3BD",
                            "#C1E1C5",
                            "#BEDADC",
                            "#C4DEF6",
                            "#BED3F3",
                            "#D4C4FB",
                          ]}
                          color={color.col3}
                          onChange={({ hex }) => {
                            onColorChange({
                              col3: hex,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Typography.Title level={5} type="success">
                        Màu chủ đề theo sự kiện
                      </Typography.Title>
                      {/* màu chủ đề Noen */}
                      <Space direction="vertical">
                        {colorThemes.map((item) => (
                          <Space direction="vertical">
                            <Typography.Title level={5}>
                              {item?.name}
                            </Typography.Title>
                            <Space direction="horizontal">
                              <div
                                className="criclebox-box"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  gap: "0px",
                                  borderRadius: `3px 0 0 3px`,
                                  padding: 2,
                                  backgroundColor: `#ece7e7c1`,
                                }}
                              >
                                <div
                                  className="criclebox"
                                  style={{
                                    background: item?.col,
                                    width: 52,
                                    height: 40,
                                  }}
                                />
                                <div
                                  className="criclebox"
                                  style={{
                                    background: item?.col1,
                                    width: 52,
                                    height: 40,
                                  }}
                                />
                                <div
                                  className="criclebox"
                                  style={{
                                    background: item?.col2,
                                    width: 52,
                                    height: 40,
                                  }}
                                />
                                <div
                                  className="criclebox"
                                  style={{
                                    background: item?.col3,
                                    width: 52,
                                    height: 40,
                                  }}
                                />
                              </div>
                              <Button
                                onClick={(e) => {
                                  onSelectFinish(item);
                                }}
                              >
                                Sử dụng
                              </Button>
                            </Space>
                          </Space>
                        ))}
                      </Space>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Skeleton>
      </Spin>
    </div>
  );
}

export const SetThePageColorYouRead = WithErrorBoundaryCustom(
  _SetThePageColorYouRead,
);
