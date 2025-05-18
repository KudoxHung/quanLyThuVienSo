import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { documentType } from "../../../../api/documentType";
import ProForm, {
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function _NewCategoryMagazine() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.status = 2; // is magazine
    documentType
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm danh mục báo, tạp chí thành công",
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-bao-tap-chi");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm danh mục báo, tạp chí thất bại",
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
              Thêm mới danh mục báo tạp chí
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
                    name="createdDate"
                    label="Ngày tạo"
                    placeholder={new Date().toLocaleDateString()}
                    disabled
                  />
                  <ProFormText
                    width="xl"
                    name="docTypeName"
                    required
                    label="Tên danh mục"
                    tooltip="Tên danh mục báo tạp chí"
                    placeholder={"Tên danh mục"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Tên danh mục",
                      },
                    ]}
                  />

                  <ProFormSelect
                    required
                    name="releaseTerm"
                    label="Kỳ hạn phát hành"
                    placeholder={"Kỳ hạn phát hành"}
                    showSearch
                    options={[
                      { value: 1, label: "Hàng ngày" },
                      { value: 2, label: "2 số/tuần" },
                      { value: 3, label: "3 số/tuần" },
                      { value: 4, label: "Hàng tuần" },
                      { value: 5, label: "2 số/tháng" },
                      { value: 6, label: "3 số/tháng" },
                      { value: 7, label: "Hàng tháng" },
                      { value: 8, label: "Hàng quý" },
                      { value: 9, label: "Khác" },
                    ]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Kỳ hạn phát hành!",
                      },
                    ]}
                    width={200}
                  />
                  <ProFormText
                    width="xl"
                    name="language"
                    label="Ngôn ngữ"
                    placeholder={"Việt"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Ngôn ngữ!",
                      },
                    ]}
                  />
                </ProFormGroup>
              </ProFormGroup>
              <ProFormGroup>
                <ProFormText
                  width="xl"
                  name="placeOfProduction"
                  required
                  label="Nơi sản xuất"
                  tooltip="Nơi sản xuất ví dụ: Huyện Ba Tri, Tỉnh Bến Tre"
                  placeholder={"huyện Ba Tri, tỉnh Bến Tre"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Nơi sản xuất",
                    },
                  ]}
                />
                <ProFormText
                  width="xl"
                  name="paperSize"
                  required
                  label="Khổ giấy"
                  tooltip="Đây là khổ giấy của báo tạp chí này, ví dụ: 20x30"
                  placeholder={"20x30"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Khổ giấy",
                    },
                  ]}
                />
                <ProFormText
                  width="xl"
                  name="numberOfCopies"
                  required
                  label="Số bản nhập"
                  tooltip="Số bản nhập"
                  placeholder={"5 Tờ/Số"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập Số bản nhập",
                    },
                  ]}
                />
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

export const NewCategoryMagazine =
  WithErrorBoundaryCustom(_NewCategoryMagazine);
