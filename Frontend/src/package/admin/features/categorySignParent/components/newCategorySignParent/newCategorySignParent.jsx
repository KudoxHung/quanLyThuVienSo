import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categorySignParents } from "../../../../api/categorySignParents";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function NewCategorySignParentLayout() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);
    console.log("Form Values:", values);
    categorySignParents
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm mới kí hiệu phân loại thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-ky-hieu-phan-loai-cha");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm mới kí hiệu phân loại thất bại",
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
              Thêm kí hiệu phân loại cha
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
              <ProFormGroup>
                <ProFormGroup
                  label={
                    <Typography.Title level={5}>
                      Mã kí hiệu phân loại cha
                    </Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="parentName"
                    required
                    label="Tên mã kí hiệu phân loại cha"
                    tooltip="Tên mã kí hiệu phân loại cha"
                    placeholder={"Tên mã kí hiệu phân loại cha"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên mã kí hiệu phân loại",
                      },
                    ]}
                  />
                  <ProFormText
                    required
                    width="xl"
                    name="parentCode"
                    placeholder="Mã kí hiệu phân loại cha"
                    label="Mã kí hiệu phân loại cha"
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập mã kí hiệu phân loại",
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
                  name={"CreateDate"}
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

export default WithErrorBoundaryCustom(NewCategorySignParentLayout);
