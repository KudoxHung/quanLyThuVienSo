import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categorySuppliers } from "../../../../api/categorySuppliers";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function _NewSuppliers() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);
  const onFinish = (values) => {
    setBtnLoading(true);
    categorySuppliers
      .create(values)
      .then((res) => {
        openNotificationWithIcon("success", "Thêm nhà cung cấp thành công");
        setBtnLoading(false);
        navigate("/admin/nha-cung-cap");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm nhà cung cấp thất bại",
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
            <Typography.Title level={3}>Thêm mới nhà cung cấp</Typography.Title>
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
                    <Typography.Title level={5}>Nhà Cung cấp</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="supplierName"
                    required
                    label="Tên nhà cung cấp"
                    tooltip="Tên nhà cung cấp"
                    placeholder={"Tên nhà cung cấp"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên nhà cung cấp",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="supplierCode"
                    placeholder="Mã nhà cung cấp"
                    label="Mã nhà cung cấp"
                    required
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập mã nhà cung cấp",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="taxCode"
                    placeholder="Mã số thuế"
                    label="Mã số thuế"
                  />
                </ProFormGroup>
              </ProFormGroup>

              <ProForm.Group
                label={<Typography.Title level={5}>Thông tin</Typography.Title>}
              >
                <ProFormDateTimePicker
                  width="md"
                  label="Ngày tạo"
                  placeholder="Ngày tạo"
                  disabled
                />
              </ProForm.Group>

              <ProFormTextArea
                name={"address"}
                label="Địa chỉ"
                width="lg"
                placeholder={"..."}
              />
              <ProFormTextArea
                name={"note"}
                label="Ghi chú"
                width="lg"
                placeholder={"..."}
              />
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewSuppliers = WithErrorBoundaryCustom(_NewSuppliers);
