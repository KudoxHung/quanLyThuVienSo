import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { documentStock } from "../../../../api/documentStock";
import ProForm, {
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Form, InputNumber, Row, Typography } from "antd";

function _NewSymbolPriceRating() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);
    documentStock
      .create(values)
      .then((res) => {
        openNotificationWithIcon("success", "thêm mới kho lưu trữ thành công");
        setBtnLoading(false);
        navigate("/admin/kho-luu-tru");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "thêm mới kho lưu trữ thất bại",
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
            <Typography.Title level={3}>Thêm kho lưu trữ</Typography.Title>

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
              <ProFormGroup>
                <ProFormGroup
                  label={
                    <Typography.Title level={5}>Kho lưu trữ</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="stockName"
                    required
                    label="Tên kho"
                    tooltip="Tên kho"
                    placeholder={"Tên kho"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên kho",
                      },
                    ]}
                  />
                </ProFormGroup>
              </ProFormGroup>

              <ProForm.Group
                label={<Typography.Title level={5}>Thông tin</Typography.Title>}
              >
                {" "}
              </ProForm.Group>
              <ProFormTextArea
                name={"description"}
                label="Ghi chú"
                width="lg"
                placeholder={"..."}
              />
              <Form.Item
                name="ordinalNumber"
                label={"Số thứ tự"}
                initialValue={0}
              >
                <InputNumber min={0} />
              </Form.Item>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewSymbolPriceRating = WithErrorBoundaryCustom(
  _NewSymbolPriceRating,
);
