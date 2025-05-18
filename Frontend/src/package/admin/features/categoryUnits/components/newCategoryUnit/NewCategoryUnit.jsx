import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categoryUnits } from "../../../../api/categoryUnits";
import ProForm, {
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Typography } from "antd";

function _NewCategoryUnit() {
  const navigate = useNavigate();
  const [CategoryUnits, setCategoryUnits] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    categoryUnits
      .getAll()
      .then((res) => {
        setCategoryUnits(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy các đơn vị thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    categoryUnits
      .create(values)
      .then((res) => {
        openNotificationWithIcon("success", "Thêm mới đơn vị thành công");
        setBtnLoading(false);
        navigate("/admin/don-vi");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm mới đơn vị thất bại",
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
              Thêm mới đơn vị lớp học, phòng ban
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
              <ProFormGroup
                label={<Typography.Title level={5}>Đơn vị</Typography.Title>}
              >
                <ProFormText
                  width="xl"
                  name="unitName"
                  required
                  label="Tên đơn vị lớp học, phòng ban"
                  tooltip="Tên đơn vị lớp học, phòng ban"
                  placeholder={"Tên đơn vị lớp học, phòng ban"}
                  rules={[
                    {
                      required: true,
                      message: "vui lòng nhập tên đơn vị lớp học, phòng ban",
                    },
                  ]}
                />

                <ProFormSelect
                  width="xl"
                  name="parentId"
                  placeholder={"Chọn đơn vị cha"}
                  label="Đơn vị cha"
                  showSearch
                  options={CategoryUnits.map((item) => ({
                    label: item?.unitName,
                    value: item?.id,
                  }))}
                />
              </ProFormGroup>
              <ProFormGroup>
                <ProFormText
                  width="xl"
                  name="unitCode"
                  placeholder={"Mã đơn vị"}
                  label="Mã đơn vị"
                  required
                  rules={[
                    {
                      required: true,
                      message: "vui lòng nhập mã đơn vị",
                    },
                    {
                      pattern: /^[a-zA-Z0-9]+$/, // Biểu thức chính quy để kiểm tra không sử dụng Tiếng Việt có dấu và dấu cách
                      message:
                        "Không sử dụng Tiếng Việt có dấu, dấu cách và kí tự đặc biệt",
                    },
                  ]}
                />
              </ProFormGroup>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewCategoryUnit = WithErrorBoundaryCustom(_NewCategoryUnit);
