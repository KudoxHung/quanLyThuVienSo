import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../../client/utils";
import { categoryColor } from "../../../../../api/categoryColor";
import { categoryPublishers } from "../../../../../api/categoryPublishers";
import { categorySignParents } from "../../../../../api/categorySignParents";
import { categorySignV1 } from "../../../../../api/categorySignV1";
import { documentType } from "../../../../../api/documentType";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function NewCategorySignV1() {
  const navigate = useNavigate();
  const [CategorySignParent, setCategorySignParent] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loadingCategorySign, setLoadingCategorySign] = useState(true);

  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        categorySignParents
          .readAll()
          .then((res) => {
            setCategorySignParent(res);
            setLoadingCategorySign(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kí hiệu phân loại thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fecthData();
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    // values.id = values;
    // values.SignIndividual = CategorySign.find((item) => item.id === values.sign)?.signCode;
    console.log(values);
    categorySignV1
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm mới kí hiệu phân loại thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/ky-hieu");
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
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={3}>
              Thêm kí hiệu phân loại
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
                      Mã kí hiệu phân loại
                    </Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="signName"
                    required
                    label="Tên mã kí hiệu phân loại"
                    tooltip="Tên mã kí hiệu phân loại"
                    placeholder={"Tên mã kí hiệu phân loại"}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên mã kí hiệu phân loại",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="signCode"
                    placeholder="Mã kí hiệu phân loại"
                    label="Mã kí hiệu phân loại"
                  />
                  <ProForm.Group>
                    <ProFormSelect
                      loading={loadingCategorySign}
                      width={300}
                      name="IdCategoryParent"
                      placeholder="Tên mã kí hiệu phân loại cha"
                      label="Tên mã kí hiệu phân loại cha"
                      showSearch
                      options={CategorySignParent.map((item) => ({
                        value: item.id,
                        label: `${item.parentCode} - ${item.parentName}`,
                      }))}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng nhập tên mã kí hiệu phân loại cha",
                        },
                      ]}
                    />
                  </ProForm.Group>
                </ProFormGroup>
              </ProFormGroup>

              <ProForm.Group
                label={<Typography.Title level={5}>Thông tin</Typography.Title>}
              >
                <ProFormDateTimePicker
                  width="md"
                  name={"createdDate"}
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

export default WithErrorBoundaryCustom(NewCategorySignV1);
