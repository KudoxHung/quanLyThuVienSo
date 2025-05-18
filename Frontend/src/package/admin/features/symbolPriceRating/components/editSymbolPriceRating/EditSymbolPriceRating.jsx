import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { documentStock } from "../../../../api/documentStock";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Row,
  Skeleton,
  Typography,
} from "antd";

function _EditSymbolPriceRating() {
  const [form] = Form.useForm();
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        documentStock
          .getById(param.id)
          .then((res) => {
            form.setFieldsValue(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "getById publisher error",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
      ]);
    };
    fetchData();
  }, [form, param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    documentStock
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật kho lưu trữ thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/kho-luu-tru");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật kho lưu trữ thất bại",
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
            <Typography.Title level={3}>Chỉnh sửa kho lưu trữ</Typography.Title>
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
                <ProFormGroup>
                  <Form.Item name={"id"} hidden />
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>kho lưu trữ</Typography.Title>
                    }
                  >
                    <ProFormText
                      name="stockName"
                      required
                      label="Tên kho"
                      tooltip="Tên kho"
                    />
                    <ProFormText
                      width="xl"
                      name="stockCode"
                      placeholder="Mã kho"
                      label="Mã kho"
                      disabled
                    />
                    <ProFormText
                      width="xl"
                      name="stockCode"
                      // placeholder={DocumentStocks.find((item) => item.id === DocumentStock.stockParentId)?.stockName || "kho cha"}
                      label="Kho cha"
                      disabled
                      hidden
                    />
                  </ProFormGroup>
                </ProFormGroup>

                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormDateTimePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày tạo"
                    disabled
                  />
                </ProForm.Group>

                <ProFormTextArea
                  name={"description"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                />

                <Form.Item name="ordinalNumber" label={"Số thứ tự"}>
                  <InputNumber min={0} />
                </Form.Item>
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

export const EditSymbolPriceRating = WithErrorBoundaryCustom(
  _EditSymbolPriceRating,
);
