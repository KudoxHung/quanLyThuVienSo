import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { holidaySchedule } from "../../../../api/holidaySchedule";
import ProForm, {
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormSwitch,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";

function _EditHolidaySchedule() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restDay, setRestDay] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    holidaySchedule
      .getRestDay(param.id)
      .then((res) => {
        setRestDay(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thông tin ngày nghỉ theo id thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.Id = restDay.id;
    if (values.dateRest) {
      values.fromDate = values?.dateRest[0];
      values.toDate = values?.dateRest[1];
    } else {
      values.fromDate = restDay.fromDate;
      values.toDate = restDay.toDate;
    }
    delete values.dateRest;
    holidaySchedule
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật lịch nghỉ lễ thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/lich-nghi-le");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật lịch nghỉ lễ thất bại",
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
              Chỉnh sửa lịch nghỉ lễ
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
                <ProFormTextArea
                  name="nameRestDate"
                  required
                  label="Nội dung"
                  tooltip="Nội dung lịch nghỉ"
                  placeholder={"Nội dung"}
                  initialValue={restDay.nameRestDate}
                />
                <ProFormGroup
                  label={
                    <Typography.Title level={5}>Thời gian</Typography.Title>
                  }
                >
                  <ProFormDateRangePicker
                    name={"dateRest"}
                    label="Thời gian"
                    tooltip="Thời gian lịch nghỉ"
                    value={[restDay.fromDate, restDay.toDate]}
                  />
                  <ProFormDateTimePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày tạo"
                    placeholder={
                      moment(restDay?.createdDate).format(
                        "DD/MM/YYYY HH:mm:ss",
                      ) || "Ngày Tạo"
                    }
                    disabled
                  />
                  <ProFormSwitch
                    label="Tình trạng"
                    tooltip="Tình trạng kích hoạt"
                    disabled
                    value={restDay?.isActived}
                  />
                </ProFormGroup>

                <ProFormTextArea
                  name={"note"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                  initialValue={restDay?.note}
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

export const EditHolidaySchedule =
  WithErrorBoundaryCustom(_EditHolidaySchedule);
