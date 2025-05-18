import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { categorySign } from "../../../../api/categorySign";
import { documentStock } from "../../../../api/documentStock";
import { individualSample } from "../../../../api/individualSample";
import ProForm, {
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Skeleton,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import SkeletonInput from "antd/lib/skeleton/Input";

function _NewSpecialRegistrationBooks() {
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [CategorySign, setCategorySign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategorySign, setLoadingCategorySign] = useState(true);

  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        documentStock
          .getAll()
          .then((res) => {
            setLoadingTreeData(false);
            setTreeData(
              res.map((item) =>
                genTreeNode(item?.id, item?.stockName, item?.stockParentId),
              ),
            );
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kho lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categorySign
          .CategorySignByDocument(param.id)
          .then((res) => {
            setCategorySign(res);
            setLoadingCategorySign(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách mã cá biệt thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => setLoading(false)),
      ]);
    };
    fetchData();
  }, [param.id]);

  const onFinish = (values) => {
    console.log(values);
    setBtnLoading(true);
    //regex number only
    const regex = /^[0-9]*$/;
    if (!regex.test(values.quantity)) {
      openNotificationWithIcon(
        "warning",
        "Số lượng phải là số",
        "quantity must be number",
      );
      setBtnLoading(false);
      return;
    } else {
      const quantity = parseInt(values.quantity);
      delete values.quantity;
      values.idDocument = param.id;
      values.documentTypeId = location?.state?.documentTypeId;

      values.IdCategory = values.sign;
      values.SignIndividual = CategorySign.find(
        (item) => item.id === values.sign,
      )?.signCode;

      delete values.sign;

      let arrObject = [];
      for (let i = 0; i < quantity; i++) {
        arrObject.push({
          idDocument: values.idDocument,
          IdCategory: values.IdCategory,
          SignIndividual: values.SignIndividual,
          StockId: values.stockId.split("/")[1],
          documentTypeId: values.documentTypeId,
          entryDate: values.entryDate,
          generalEntryNumber: values.generalEntryNumber,
          price: values.price,
        });
      }
      if (arrObject.length > 0) {
        individualSample
          .create(arrObject)
          .then((res) => {
            openNotificationWithIcon(
              "success",
              "Thêm mới mã cá biệt thành công",
              res?.message,
            );
            setBtnLoading(false);
            navigate(
              `/admin/dang-ky-ca-biet-tung-bo-sach/children/${param.id}`,
            );
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Thêm mới mã cá biệt thất bại",
              err?.response?.data?.message || err?.message,
            );
            setBtnLoading(false);
          });
      }
    }
  };

  const [treeData, setTreeData] = useState([]);
  const [loadingTreeData, setLoadingTreeData] = useState(true);
  const genTreeNode = (id, title, parentId) => {
    return {
      id: id,
      pId: parentId,
      value: `${title}/${id}`,
      title: title,
    };
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={3}>Tạo thêm mã cá biệt</Typography.Title>
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
                        Đơn vị đăng ký
                      </Typography.Title>
                    }
                  >
                    <ProFormSelect
                      width={300}
                      required
                      showSearch
                      label="Tên sách"
                      tooltip="Tên sách đăng ký cá biệt"
                      value={location?.state?.docName}
                      placeholder="Tên sách"
                      disabled
                    />
                    {loadingCategorySign ? (
                      <SkeletonInput active style={{ marginTop: 31 }} />
                    ) : (
                      <ProFormSelect
                        loading={true}
                        width={300}
                        name="sign"
                        placeholder="Loại mã cá biệt"
                        label="Loại mã cá biệt"
                        showSearch
                        options={CategorySign?.map((item) => ({
                          value: item?.id,
                          label: `${item?.signCode} - ${item?.signName}`,
                        }))}
                        required
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn mã cá biệt",
                          },
                        ]}
                      />
                    )}

                    <ProFormText
                      width="xl"
                      name="barcode"
                      placeholder="Mã vạch"
                      label="Mã vạch"
                      disabled
                    />
                    <ProFormMoney
                      label="Giá"
                      name="price"
                      locale="vi-VN"
                      initialValue={0}
                      min={0}
                      width="lg"
                      placeholder={"Giá"}
                      required
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập giá tiền",
                        },
                      ]}
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
                    placeholder="Ngày tạo"
                    disabled
                  />

                  <ProFormDatePicker
                    width="md"
                    name={"entryDate"}
                    label="Ngày vào sổ"
                    required
                    placeholder="Ngày vào sổ"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Ngày vào sổ",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="generalEntryNumber"
                    required
                    label="Số vào sổ tổng quát"
                    tooltip="Số vào sổ tổng quát"
                    placeholder={"Số vào sổ tổng quát"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Số vào sổ tổng quát",
                      },
                    ]}
                  />

                  {/* <ProFormSelect
                    name={"stockId"}
                    label="kho lưu trữ"
                    required
                    showSearch
                    placeholder={"kho lưu trữ"}
                    width={250}
                    options={DocumentStock?.map((item) => ({
                      value: item.id,
                      label: item.stockName,
                    }))}
                    rules={[
                      {
                        required: true,
                        message: "chọn kho lưu trữ",
                      },
                    ]}
                  /> */}
                  <Spin spinning={loadingTreeData} size="large">
                    <Form.Item
                      label="Kho lưu trữ"
                      name={"stockId"}
                      required
                      rules={[
                        {
                          required: true,
                          message: "chọn kho lưu trữ",
                        },
                      ]}
                    >
                      <TreeSelect
                        showSearch
                        treeDataSimpleMode
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        style={{
                          width: 250,
                        }}
                        placeholder="kho lưu trữ"
                        treeData={treeData}
                      />
                    </Form.Item>
                  </Spin>

                  <ProFormSelect
                    name={"isLostedPhysicalVersion"}
                    label="Tình trạng"
                    tooltip="Tình trạng còn hay mất"
                    value={false}
                    width={150}
                    disabled
                    options={[
                      {
                        label: "Vẫn còn",
                        value: false,
                      },
                      {
                        label: "Đã mất",
                        value: true,
                      },
                    ]}
                  />
                  <ProFormDigit
                    label="Số lượng"
                    tooltip="Số lượng mã cá biệt muốn tạo, giới hạn tối đa là 100/lần"
                    name="quantity"
                    width="sm"
                    placeholder={"Số lượng"}
                    min={1}
                    defaultValue={1}
                    max={10000}
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

export const NewSpecialRegistrationBooks = WithErrorBoundaryCustom(
  _NewSpecialRegistrationBooks,
);
