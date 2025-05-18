import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { schoolYear } from "../../../../api/schoolYear";
import ProForm, {
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormGroup,
  ProFormSwitch,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function _NewSchoolYearInfo() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = (values) => {
    setBtnLoading(true);

    schoolYear
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật năm học thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-ky-hieu-phan-loai");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật năm học thất bại",
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
            <Typography.Title level={3}>Chỉnh sửa năm học</Typography.Title>
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
                  label={<Typography.Title level={5}>Năm học</Typography.Title>}
                >
                  <ProFormDatePicker
                    width="xl"
                    name="signName"
                    required
                    label="Tên ký hiệu"
                    tooltip="Tên ký hiệu phân loại"
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên ký hiệu phân loại",
                      },
                    ]}
                  />
                  <ProFormDateTimeRangePicker label="Năm học" />
                </ProFormGroup>
              </ProFormGroup>

              <ProForm.Group
                label={<Typography.Title level={5}>Thông tin</Typography.Title>}
              >
                <ProFormDateTimePicker
                  width="md"
                  name={"createdDate"}
                  label="Ngày tạo"
                  disabled
                />
                <ProFormSwitch label="Tình trạng ẩn hiện" disabled />
              </ProForm.Group>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewSchoolYearInfo = WithErrorBoundaryCustom(_NewSchoolYearInfo);
