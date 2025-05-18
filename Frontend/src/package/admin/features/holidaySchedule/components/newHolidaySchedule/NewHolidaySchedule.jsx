import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { holidaySchedule } from "../../../../api/holidaySchedule";
import {
  ProForm,
  ProFormDateRangePicker,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";
import moment from "moment";

function _NewHolidaySchedule() {
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    document.title = "Lịch nghỉ lễ";
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.fromDate = values.dateRest[0];
    values.toDate = values.dateRest[1];
    delete values.dateRest;
    holidaySchedule
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Tạo lịch nghỉ thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/lich-nghi-le");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Tạo lịch nghỉ thất bại",
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
            <Typography.Title level={3}>Thêm lịch nghỉ lễ</Typography.Title>
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
              <ProFormTextArea
                name="nameRestDate"
                required
                label="Nội dung"
                tooltip="Nội dung lịch nghỉ"
                placeholder={"Nội dung"}
                rules={[
                  {
                    required: true,
                    message: "vui lòng nhập nội dung lịch nghỉ!",
                  },
                ]}
              />

              <ProFormDateRangePicker
                name={"dateRest"}
                label="Thời gian"
                tooltip="Thời gian lịch nghỉ"
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                ranges={{
                  Today: [moment(), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                }}
                rules={[
                  {
                    required: true,
                    message: "vui lòng chọn thời gian nghỉ lễ!",
                  },
                ]}
              />

              <ProFormTextArea
                name={"note"}
                label="Ghi chú"
                width="lg"
                placeholder={"..."}
              />
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewHolidaySchedule = WithErrorBoundaryCustom(_NewHolidaySchedule);
