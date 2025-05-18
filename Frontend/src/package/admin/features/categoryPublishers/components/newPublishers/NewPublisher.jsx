import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categoryPublishers } from "../../../../api/categoryPublishers";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function NewPublisher() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);
    categoryPublishers
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm mới nhà xuất bản thành công",
          res?.message,
        );
        navigate("/admin/nha-xuat-ban");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm mới nhà xuất bản thất bại",
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
            <Typography.Title level={3}>Thêm mới nhà xuất bản</Typography.Title>

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
                    <Typography.Title level={5}>Nhà xuất bản</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="publisherName"
                    required
                    label="Tên nhà xuất bản"
                    tooltip="Tên nhà xuất bản"
                    placeholder={"Tên nhà xuất bản"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên nhà xuất bản",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="publisherCode"
                    placeholder="Mã nhà xuất bản"
                    label="Mã nhà xuất bản"
                    required
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập mã nhà xuất bản",
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
export default WithErrorBoundaryCustom(NewPublisher);
