import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categoryUnits } from "../../../../api/categoryUnits";
import ProForm, {
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";

function _EditCategoryUnit() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [CategoryUnits, setCategoryUnits] = useState([]);
  const [Units, setUnits] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        categoryUnits
          .getById(param.id)
          .then((res) => {
            setUnits(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy đơn vị theo id thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
        categoryUnits
          .getAll()
          .then((res) => {
            setCategoryUnits(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy các đơn vị thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
      ]);
    };
    fetchData();
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.id = param.id;
    values.unitName = values.unitName || Units.unitName;
    values.parentId = values.parentId || Units.parentId;
    values.unitCode = values.unitCode || Units.unitCode;
    categoryUnits
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật đơn vị thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/don-vi");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật đơn vị thất bại",
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
              Chỉnh sửa đơn vị lớp học, phòng ban
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
                <ProFormGroup
                  label={<Typography.Title level={5}>Đơn vị</Typography.Title>}
                >
                  <ProFormText
                    width="xl"
                    name="unitName"
                    required
                    label="Tên đơn vị lớp học, phòng ban"
                    tooltip="Tên đơn vị lớp học, phòng ban"
                    placeholder={Units?.unitName}
                    value={Units?.unitName}
                  />

                  <ProFormSelect
                    width="xl"
                    name="parentId"
                    placeholder={
                      CategoryUnits.find((unit) => Units.parentId === unit.id)
                        ?.unitName || "Chọn đơn vị lớp học, phòng ban"
                    }
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
                    value={Units?.unitCode}
                    name="unitCode"
                    placeholder={"Mã đơn vị"}
                    label="Mã đơn vị"
                    required
                  />
                </ProFormGroup>
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

export const EditCategoryUnit = WithErrorBoundaryCustom(_EditCategoryUnit);
