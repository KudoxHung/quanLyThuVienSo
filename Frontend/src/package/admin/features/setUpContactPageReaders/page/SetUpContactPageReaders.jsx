import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Spin,
  Typography,
} from "antd";

import "./SetUpContactPageReaders.css";

function _SetUpContactPageReaders() {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    document.title = "Cài đặt trang liên hệ";
  }, []);
  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 2)
      .then((res) => {
        form.setFieldsValue(res[0]);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Có lỗi gì đó.", err?.message);
      })
      .finally(() => setLoading(false));
  }, [form]);
  const onFinish = (values) => {
    setBtnLoading(true);
    ContactAndIntroduction.create({ type: 2, ...values })
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon("success", "Lưu lại thành công", res?.message);
      })
      .catch((err) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "error",
          "Có lỗi gì đó.",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  return (
    <div className="layout-content SetUpContactPageReaders">
      <Spin spinning={loading}>
        <Skeleton loading={loading} active avatar paragraph={{ rows: 15 }}>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <Typography.Title level={5}>
                  Thiết lập liên hệ trang bạn đọc
                </Typography.Title>
                <Form
                  onFinish={onFinish}
                  layout={"vertical"}
                  initialValues={{
                    remember: true,
                  }}
                  className="ant-advanced-search-form"
                  name="normal_login"
                  form={form}
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Thông tin liên hệ bất kì"
                        name="col"
                        tooltip="Thông tin liên hệ bất kì có thể là số điện thoại, mã số thuế, tên đơn vị chủ quản, địa chỉ, vv..."
                      >
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col1">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col2">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col3">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col4">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          loading={btnLoading}
                          htmlType="submit"
                        >
                          Lưu lại
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col5">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col6">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col7">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Thông tin liên hệ bất kì" name="col8">
                        <Input.TextArea placeholder="Tiều đề: ...." showCount />
                      </Form.Item>
                      <Form.Item label="Tên huyện" name="col9">
                        <Input.TextArea showCount />
                      </Form.Item>
                      <Form.Item
                        label="Tên đơn vị ( tên trường )"
                        name="col10"
                        tooltip="Thông tin đơn vị chủ quản có thể là tên đơn vị, tên trường, vv..."
                      >
                        <Input.TextArea
                          placeholder="Tên đơn vị ( tên trường )"
                          showCount
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Skeleton>
      </Spin>
    </div>
  );
}

export const SetUpContactPageReaders = WithErrorBoundaryCustom(
  _SetUpContactPageReaders,
);
