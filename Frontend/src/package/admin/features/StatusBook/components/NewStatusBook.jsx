import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { statusBook } from "../../../api/statusBook.";
import ProForm, { ProFormGroup, ProFormText } from "@ant-design/pro-form";
import { Button, Card, Col, Form, Row, Typography } from "antd";

function _NewStatusBook() {
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [StatusBook, setStatusBook] = useState({
    nameStatusBook: "",
  });

  const onFinish = (values) => {
    setBtnLoading(true);
    StatusBook.nameStatusBook = values.nameStatusBook;
    statusBook
      .insert(StatusBook)
      .then((res) => {
        openNotificationWithIcon("success", "Thêm mới thành công");
        setBtnLoading(false);
        navigate("/admin/danh-muc-tinh-trang-sach");
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
              Thêm mới danh mục tình trạng sách{" "}
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
                  <Typography.Title level={5}>
                    Thông tin tình trạng sách
                  </Typography.Title>
                }
              >
                <ProFormText
                  width="xl"
                  name="nameStatusBook"
                  required
                  label="Tên tình trạng sách"
                  // tooltip="Tên tình trạng sách"
                  placeholder={statusBook?.listPayload?.nameStatusBook}
                  value={statusBook?.listPayload?.nameStatusBook}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không để trống!",
                    },
                  ]}
                />
              </ProFormGroup>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewStatusBook = WithErrorBoundaryCustom(_NewStatusBook);
