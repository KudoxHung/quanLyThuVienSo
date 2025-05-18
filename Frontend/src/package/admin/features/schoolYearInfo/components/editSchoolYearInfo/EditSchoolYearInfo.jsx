import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { schoolYear } from "../../../../api/schoolYear";
import ProForm, {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormSwitch,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";
function _EditSchoolYearInfo() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [SchoolYearInfo, setSchoolYearInfo] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    schoolYear
      .getById(param.id)
      .then((res) => {
        setSchoolYearInfo(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "getById năm học thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.Id = SchoolYearInfo.id;

    if (
      moment(values.startSemesterI || SchoolYearInfo.startSemesterI).isAfter(
        moment(values.startSemesterII || SchoolYearInfo.startSemesterII),
      )
    ) {
      openNotificationWithIcon(
        "warning",
        "check semester start date",
        "Thời gian học kì I không được lớn hơn thời gian học kì II",
      );
      setBtnLoading(false);
      return false;
    } else if (
      moment(values.startSemesterII || SchoolYearInfo.startSemesterII).isAfter(
        moment(values.endAllSemester || SchoolYearInfo.endAllSemester),
      )
    ) {
      openNotificationWithIcon(
        "warning",
        "check semester start date",
        "Thời gian học kì II không được lớn hơn thời gian kết thúc học kì",
      );
      setBtnLoading(false);
      return false;
    }

    schoolYear
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật năm học thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/nam-hoc");
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
                      <Typography.Title level={5}>Năm học</Typography.Title>
                    }
                  >
                    <ProFormDateRangePicker
                      width={500}
                      placeholder={[
                        moment(SchoolYearInfo?.fromYear).format("DD/MM/YYYY"),
                        moment(SchoolYearInfo?.toYear).format("DD/MM/YYYY"),
                      ]}
                      name={"restday"}
                      label="Thời gian"
                      tooltip="Thời gian năm học"
                      disabled
                    />
                  </ProFormGroup>
                </ProFormGroup>

                <ProForm.Group
                  label={<Typography.Title level={5}>Học kì</Typography.Title>}
                >
                  <ProFormDatePicker
                    width="md"
                    name={"startSemesterI"}
                    label="Thời gian học kì I"
                    value={SchoolYearInfo?.startSemesterI}
                  />
                  <ProFormDatePicker
                    width="md"
                    name={"startSemesterII"}
                    label="Thời gian học kì II"
                    value={SchoolYearInfo?.startSemesterII}
                  />
                  <ProFormDatePicker
                    width="md"
                    name={"endAllSemester"}
                    label="Thời gian kết thúc học kì"
                    value={SchoolYearInfo?.endAllSemester}
                  />
                </ProForm.Group>
                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormDateTimePicker
                    width={250}
                    name={"createdDate"}
                    label="Ngày tạo"
                    value={moment(SchoolYearInfo?.createdDate).format(
                      "DD/MM/YYYY HH:mm:ss",
                    )}
                    readonly
                  />
                  <ProFormSwitch
                    label="Tình trạng"
                    tooltip="Tình trạng kích hoạt"
                    disabled
                    value={SchoolYearInfo?.isActived}
                  />
                </ProForm.Group>
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
export const EditSchoolYearInfo = WithErrorBoundaryCustom(_EditSchoolYearInfo);
