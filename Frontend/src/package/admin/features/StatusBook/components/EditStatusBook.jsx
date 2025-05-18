import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { statusBook } from "../../../api/statusBook.";
import ProForm, { ProFormGroup, ProFormText } from "@ant-design/pro-form";
import { Button, Card, Col, Form, Row, Skeleton, Typography } from "antd";

function _EditStatusBook() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [StatusBook, setStatusBook] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        statusBook
          .getById(param.id)
          .then((res) => {
            setStatusBook(res.payload);
            setLoading(false);

            form.setFieldsValue({
              ...res.payload,
              nameStatusBook: res.payload.nameStatusBook,
            });
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy thông tin danh mục cần chỉnh sửa thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
      ]);
    };
    fetchData();
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.id = param.id;
    values.nameStatusBook = values.nameStatusBook || StatusBook.nameStatusBook;
    statusBook
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-tinh-trang-sach");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật không thành công",
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
              Chỉnh sửa Tình trạng sách
            </Typography.Title>
            <Skeleton loading={loading} active>
              <ProForm
                form={form}
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
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="nameStatusBook"
                    required
                    label="Tên tình trạng sách"
                    tooltip="Tên tình trạng sách"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng không để trống!",
                      },
                    ]}
                  />
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

export const EditStatusBook = WithErrorBoundaryCustom(_EditStatusBook);
