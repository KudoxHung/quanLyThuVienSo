import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categoryPublishers } from "../../../../api/categoryPublishers";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";

function _EditPublishers() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [publisher, setPublisher] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    categoryPublishers
      .getById(param.id)
      .then((res) => {
        setPublisher(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy nhà xuất bản theo id thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.publisherName = values.publisherName || publisher.publisherName;

    const Publisher = { ...publisher, ...values };
    categoryPublishers
      .update(publisher.id, Publisher)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật nhà xuất bản thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/nha-xuat-ban");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật nhà xuất bản thất bại",
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
              Chỉnh sửa nhà xuất bản
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
                        Nhà xuất bản
                      </Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="publisherName"
                      required
                      label="Tên nhà xuất bản"
                      tooltip="Tên nhà xuất bản"
                      placeholder={publisher?.publisherName}
                      value={publisher?.publisherName}
                    />
                    <ProFormText
                      width="xl"
                      name="publisherCode"
                      value={publisher?.publisherCode}
                      placeholder="Mã nhà xuất bản"
                      label="Mã nhà xuất bản"
                      required
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
                      moment(publisher?.createdDate).format(
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
                  value={publisher?.address}
                />
                <ProFormTextArea
                  name={"note"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                  value={publisher?.note}
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

export const EditPublishers = WithErrorBoundaryCustom(_EditPublishers);
