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

function _NewChildSymbolPriceRating() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [DocumentStock, setDocumentStock] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    documentStock
      .getById(param.id)
      .then((res) => {
        setDocumentStock(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "getById nhà xuất bản thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.stockParentId = DocumentStock.id;
    documentStock
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "thêm mới kho lưu trữ con thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/kho-luu-tru/children/" + param.id);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "thêm mới kho lưu trữ con thất bại",
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
              Thêm mới kho lưu trữ con
            </Typography.Title>
            <Skeleton loading={loading} active>
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
                      <Typography.Title level={5}>kho lưu trữ</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="stockName"
                      required
                      label="Tên kho con"
                      tooltip="Tên kho con"
                      placeholder={"Tên kho con"}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng nhập tên kho con",
                        },
                      ]}
                    />
                    <ProFormText
                      width="xl"
                      name="temp"
                      value={DocumentStock?.stockCode}
                      placeholder="Mã kho cha"
                      label="Mã kho cha"
                      disabled
                    />
                    <ProFormText
                      width="xl"
                      name="temp2"
                      value={DocumentStock?.stockName}
                      label="Tên kho cha"
                      disabled
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
                    placeholder={"Ngày tạo"}
                    disabled
                  />
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
            </Skeleton>
            <Skeleton loading={loading} active />
            <Skeleton loading={loading} active />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewChildSymbolPriceRating = WithErrorBoundaryCustom(
  _NewChildSymbolPriceRating,
);
