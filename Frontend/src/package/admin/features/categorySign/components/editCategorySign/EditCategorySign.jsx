import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categorySign } from "../../../../api/categorySign";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";
function _EditCategorySign() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [CategorySign, setCategorySign] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    categorySign
      .getById(param.id)
      .then((res) => {
        setCategorySign(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh mục ký tên theo id thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.CategorySign = values.CategorySign || CategorySign.CategorySign;
    values.Id = CategorySign.id;
    categorySign
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật mã cá biệt",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/ma-ca-biet");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật mã cá biệt",
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
            <Typography.Title level={3}>Chỉnh sửa mã cá biệt</Typography.Title>
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
                      <Typography.Title level={5}>Mã cá biệt</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="signName"
                      required
                      label="Tên mã cá biệt"
                      tooltip="Tên mã cá biệt"
                      placeholder={CategorySign?.signName}
                      value={CategorySign?.signName}
                    />
                    <ProFormText
                      width="xl"
                      name="signCode"
                      value={CategorySign?.signCode}
                      placeholder="Mã mã cá biệt"
                      label="Mã mã cá biệt"
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
                      moment(CategorySign?.createdDate).format(
                        "DD/MM/YYYY HH:mm:ss",
                      ) || "Ngày tạo"
                    }
                    disabled
                  />
                  <ProFormSwitch
                    label="Tình trạng ẩn hiện"
                    disabled
                    value={CategorySign?.isHided}
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

export const EditCategorySign = WithErrorBoundaryCustom(_EditCategorySign);
