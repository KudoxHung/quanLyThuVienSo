import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categorySuppliers } from "../../../../api/categorySuppliers";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";

function _EditSuppliers() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [Suppliers, setSuppliers] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    categorySuppliers
      .getById(param.id)
      .then((res) => {
        setSuppliers(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "lấy nhà cung cấp theo id thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.supplierName = values.supplierName || Suppliers.supplierName;
    const suppliers = { ...Suppliers, ...values };
    categorySuppliers
      .update(Suppliers.id, suppliers)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật nhà cung cấp thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/nha-cung-cap");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật nhà cung cấp thất bại",
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
              Chỉnh sửa nhà cung cấp
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
                      <Typography.Title level={5}>
                        Nhà Cung cấp
                      </Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="supplierName"
                      required
                      label="Tên nhà cung cấp"
                      tooltip="Tên nhà cung cấp"
                      placeholder={Suppliers?.supplierName}
                      value={Suppliers?.supplierName}
                    />
                    <ProFormText
                      width="xl"
                      name="supplierCode"
                      value={Suppliers?.supplierCode}
                      required
                      placeholder="Mã nhà cung cấp"
                      label="Mã nhà cung cấp"
                    />
                    <ProFormText
                      width="xl"
                      name="taxCode"
                      value={Suppliers?.taxCode}
                      placeholder="Mã số thuế"
                      label="Mã số thuế"
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
                    placeholder={
                      moment(Suppliers?.createdDate).format(
                        "DD/MM/YYYY HH:mm:ss",
                      ) || "Ngày tạo"
                    }
                    disabled
                  />
                </ProForm.Group>

                <ProFormTextArea
                  name={"address"}
                  label="Địa chỉ"
                  width="lg"
                  placeholder={"..."}
                  value={Suppliers?.address}
                />
                <ProFormTextArea
                  name={"note"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                  value={Suppliers?.note}
                />
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

export const EditSuppliers = WithErrorBoundaryCustom(_EditSuppliers);
