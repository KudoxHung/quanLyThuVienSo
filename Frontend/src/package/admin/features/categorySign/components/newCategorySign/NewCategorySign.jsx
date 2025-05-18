import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categorySign } from "../../../../api/categorySign";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function NewCategorySign() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);
    categorySign
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm mới mã cá biệt thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/ma-ca-biet");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm mới mã cá biệt thất bại",
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
            <Typography.Title level={3}>Thêm mã cá biệt</Typography.Title>

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
                    <Typography.Title level={5}>Mã cá biệt</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="signName"
                    required
                    label="Tên mã cá biệt"
                    tooltip="Tên mã cá biệt"
                    placeholder={"Tên mã cá biệt"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên mã cá biệt",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="signCode"
                    placeholder="Mã cá biệt"
                    label="Mã cá biệt"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã cá biệt",
                      },
                      {
                        validator: (_, value) => {
                          // Kiểm tra xem giá trị có chứa ký tự đặc biệt không
                          if (/[*!@#$%^&()_+{}\[\]:;<>,.?~\\/-]/.test(value)) {
                            return Promise.reject(
                              "Mã cá biệt không được chứa ký tự đặc biệt.",
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  />
                </ProFormGroup>
              </ProFormGroup>

              <ProForm.Group
                label={<Typography.Title level={5}>Thông tin</Typography.Title>}
              >
                <ProFormDateTimePicker
                  width="md"
                  name={"createdDate"}
                  label="Ngày tạo"
                  placeholder="Ngày tạo"
                  disabled
                />
              </ProForm.Group>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default WithErrorBoundaryCustom(NewCategorySign);
