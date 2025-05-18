import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { documentType } from "../../../../api/documentType";
import ProForm, {
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function _NewCategorybooks() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.status = 1; // is books
    documentType
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm mới danh mục sách thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-sach");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm mới dung mục sách thất bại",
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
              Thêm mới danh mục sách
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
                    <Typography.Title level={5}>Danh mục</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="docTypeName"
                    required
                    label="Tên danh mục"
                    tooltip="Tên danh mục sách"
                    placeholder={"Tên danh mục"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên danh mục",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="createdDate"
                    label="Ngày tạo"
                    placeholder={new Date().toLocaleDateString()}
                    disabled
                  />
                </ProFormGroup>
              </ProFormGroup>
              <ProFormTextArea
                name="description"
                label="Ghi chú"
                placeholder="Ghi chú"
              />
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewCategoryBooks = WithErrorBoundaryCustom(_NewCategorybooks);
