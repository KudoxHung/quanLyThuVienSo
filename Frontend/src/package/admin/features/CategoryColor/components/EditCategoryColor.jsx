import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { categoryColor } from "../../../api/categoryColor";
import ProForm, { ProFormGroup, ProFormText } from "@ant-design/pro-form";
import { Button, Card, Col, Form, Row, Skeleton, Typography } from "antd";

function _EditCategoryColor() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [CategoryUnits, setCategoryUnits] = useState([]);
  const [CategoryColor, setCategoryColor] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [color, setColor] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        categoryColor
          .getById(param.id)
          .then((res) => {
            setCategoryColor(res.payload);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy mã màu theo id thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
      ]);
    };
    fetchData();
  }, [param.id]);

  const onFinish = (values) => {
    console.log(values);
    setBtnLoading(true);
    values.id = param.id;
    console.log(values.id);
    console.log(values.colorName);
    values.colorName = values.colorName || CategoryColor.colorName;
    values.readingLevel = values.readingLevel || CategoryColor.readingLevel;
    values.colorCode = values.colorCode || CategoryColor.colorCode;
    categoryColor
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật mã màu thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-ma-mau");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật mã màu không thành công",
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
            <Typography.Title level={3}>Chỉnh sửa mã màu</Typography.Title>
            <Skeleton loading={loading} active>
              <ProForm
                autoFocusFirstInput
                style={{ padding: 10 }}
                initialValues={{
                  colorName: CategoryColor.colorName,
                  readingLevel: CategoryColor.readingLevel,
                  colorCode: CategoryColor.colorCode,
                }} // Đặt giá trị ban đầu từ CategoryColor
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
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="colorName"
                    required
                    label="Tên màu"
                    tooltip="Tên màu"
                    placeholder={CategoryColor?.colorName}
                    value={CategoryColor?.colorName}
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
                    placeholder={CategoryColor?.readingLevel}
                    value={CategoryColor?.readingLevel}
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
                    value={CategoryColor?.colorCode}
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
                      color={CategoryColor?.colorCode}
                      onChange={({ hex }) => {
                        CategoryColor.colorCode = hex;
                        setColor(hex);
                      }}
                    />
                  </Form.Item>
                </ProFormGroup>
              </ProForm>
            </Skeleton>
            <Skeleton loading={loading} active />
            <Skeleton loading={loading} active />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const EditCategoryColor = WithErrorBoundaryCustom(_EditCategoryColor);
