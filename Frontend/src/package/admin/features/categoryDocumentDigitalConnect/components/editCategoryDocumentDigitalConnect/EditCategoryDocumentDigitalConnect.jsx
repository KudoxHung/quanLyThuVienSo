import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { documentType } from "../../../../api/documentType";
import ProForm, {
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Button, Card, Col, Row, Skeleton, Typography } from "antd";
import moment from "moment";

function _EditCategoryDocumentDigitalConnect() {
  const param = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [CategoryBooks, setCategoryBooks] = useState([]);

  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    documentType
      .getById(param.id)
      .then((res) => {
        setCategoryBooks(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thông tin tài liệu số theo id thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.id = param.id;
    values.docTypeName = values.docTypeName || CategoryBooks.docTypeName;
    documentType
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật danh mục tài liệu số thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-tai-lieu-so-dung-chung");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật danh mục tài liệu số thất bại",
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
              Chỉnh sửa danh mục tài liệu số dùng chung
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
                      <Typography.Title level={5}>Danh mục</Typography.Title>
                    }
                  >
                    <ProFormText
                      width={300}
                      name="docTypeName"
                      required
                      label="Tên danh mục"
                      tooltip="Tên danh mục tài liệu số"
                      placeholder={CategoryBooks?.docTypeName}
                      value={CategoryBooks?.docTypeName}
                    />
                    <ProFormText
                      width="xl"
                      name="createdDate"
                      label="Ngày tạo"
                      placeholder={moment(CategoryBooks?.createdDate).format(
                        "DD/MM/YYYY HH:mm:ss",
                      )}
                      disabled
                    />
                  </ProFormGroup>
                </ProFormGroup>
                <ProFormTextArea
                  name="description"
                  label="Ghi chú"
                  value={CategoryBooks?.description}
                  placeholder="Ghi chú"
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
export const EditCategoryDocumentDigitalConnect = WithErrorBoundaryCustom(
  _EditCategoryDocumentDigitalConnect,
);
