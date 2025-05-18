import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { categoryColor } from "../../../api/categoryColor";
import ProForm, {
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Form, Row, Typography } from "antd";

function _NewCategoryColor() {
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [color, setColor] = useState("");
  const [CategoryColor, setCategoryColor] = useState({
    colorName: "",
    readingLevel: "",
    colorCode: "",
  });

  const onFinish = (values) => {
    setBtnLoading(true);
    CategoryColor.colorName = values.colorName;
    CategoryColor.readingLevel = values.readingLevel;
    CategoryColor.colorCode = color;
    categoryColor
      .insert(CategoryColor)
      .then((res) => {
        openNotificationWithIcon("success", "Thêm mới thành công");
        setBtnLoading(false);
        navigate("/admin/danh-muc-ma-mau");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm mới thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={3}>
              Thêm mới danh mục mã màu
            </Typography.Title>
            <ProForm
              autoFocusFirstInput
              style={{ padding: 10 }}
              onFinish={onFinish}
              submitter={{
                // Configure the button text
                searchConfig: {
                  resetText: "reset",
                  submitText: "submit",
                },
                // Configure the properties of the button
                resetButtonProps: {
                  style: {
                    // Hide the reset button
                    display: "none",
                  },
                },
                submitButtonProps: {},
                // Fully customize the entire area
                render: (props, doms) => {
                  return [
                    <Button
                      size="large"
                      type="primary"
                      key="submit"
                      onClick={() => props.form?.submit?.()}
                      loading={btnLoading}
                    >
                      Xác nhận
                    </Button>,
                    <Button
                      size="large"
                      key="rest"
                      onClick={() => props.form?.resetFields()}
                      loading={btnLoading}
                    >
                      Cài lại
                    </Button>,
                  ];
                },
              }}
            >
              <ProFormGroup
                label={
                  <Typography.Title level={5}>Thông tin màu</Typography.Title>
                }
              >
                <ProFormText
                  width="xl"
                  name="colorName"
                  required
                  label="Tên màu"
                  tooltip="Tên màu"
                  placeholder={categoryColor?.colorName}
                  value={categoryColor?.colorName}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống!", // Thông báo lỗi khi trường này không được điền
                    },
                  ]}
                />

                <ProFormText
                  width="xl"
                  name="readingLevel"
                  required
                  label="Trình độ đọc"
                  tooltip="Trình độ đọc"
                  placeholder={categoryColor?.readingLevel}
                  value={categoryColor?.readingLevel}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống!", // Thông báo lỗi khi trường này không được điền
                    },
                  ]}
                />
              </ProFormGroup>
              <ProFormGroup>
                <ProFormText
                  width="xl"
                  value={categoryColor?.colorCode}
                  name="colorCode"
                  placeholder={"Mã màu"}
                  label="Mã màu"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống!", // Thông báo lỗi khi trường này không được điền
                    },
                  ]}
                />
                <Form.Item label="Chọn mã màu" name="col2">
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
                    color={categoryColor?.colorCode}
                    onChange={({ hex }) => {
                      categoryColor.colorCode = hex;
                      setColor(hex);
                    }}
                  />
                </Form.Item>
              </ProFormGroup>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewCategoryColor = WithErrorBoundaryCustom(_NewCategoryColor);
