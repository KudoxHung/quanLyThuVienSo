import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../../client/utils";
import { categorySignParents } from "../../../../../api/categorySignParents";
import { categorySignV1 } from "../../../../../api/categorySignV1";
import ProForm, {
  ProFormDateTimePicker,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";
function _EditCategorySignV1() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [CategorySign, setCategorySign] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loadingCategorySign, setLoadingCategorySign] = useState(true);
  const [loadingCategorySignParent, setLoadingCategorySignParent] =
    useState(true);
  const [CategorySignParent, setCategorySignParent] = useState([]);
  const [IdCategory, setIdCategory] = useState();
  const [pparentName, setPparentName] = useState();
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
  useEffect(() => {
    categorySignV1
      .readById(param.id)
      .then((res) => {
        setCategorySign(res);
        setIdCategory(res.idCategoryParent);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thông tin kí hiệu thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  useEffect(() => {
    console.log(IdCategory);
    if (IdCategory) {
      categorySignParents
        .readById(IdCategory)
        .then((res) => {
          setPparentName(res.id);
          setLoadingCategorySignParent(false);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Lấy danh sách kí hiệu phân loại thất bại",
            err?.response?.data?.message || err?.message,
          );
        });
    }
  }, [IdCategory]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.CategorySign = values.CategorySign || CategorySign.CategorySign;
    values.Id = CategorySign.id;
    console.log(values);
    categorySignV1
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật kí hiệu phân loại",
          res?.message,
        );
        setBtnLoading(false);
        setPparentName("");
        navigate("/admin/ky-hieu");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật kí hiệu phân loại",
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
              Chỉnh sửa kí hiệu phân loại
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
                        Kí hiệu phân loại
                      </Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="signName"
                      required
                      label="Tên kí hiệu phân loại"
                      tooltip="Tên kí hiệu phân loại"
                      placeholder={CategorySign?.signName}
                      value={CategorySign?.signName}
                    />
                    <ProFormText
                      width="xl"
                      name="signCode"
                      required
                      value={CategorySign?.signCode}
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
                        options={[
                          ...CategorySignParent.map((item) => ({
                            value: item.id,
                            label: `${item.parentCode} - ${item.parentName}`,
                          })),
                        ]}
                        value={pparentName}
                      />
                    </ProForm.Group>
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

export const EditCategorySignV1 = WithErrorBoundaryCustom(_EditCategorySignV1);
