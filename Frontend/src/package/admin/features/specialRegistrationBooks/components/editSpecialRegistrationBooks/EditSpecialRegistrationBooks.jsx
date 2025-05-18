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
import moment from "moment";

function _EditSpecialRegistrationBooks() {
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [IndividualSample, setIndividualSample] = useState([]);
  const [CategorySign, setCategorySign] = useState([]);
  const [Code, setCode] = useState("SGK");
  const [Number, setNumber] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (IndividualSample) {
      form.setFieldsValue({
        entryDate: IndividualSample.entryDate
          ? moment(IndividualSample.entryDate)
          : null,
        generalEntryNumber: IndividualSample.generalEntryNumber ?? null,
      });
    }
  }, [IndividualSample, form]);

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        individualSample
          .getById(param.id)
          .then((res) => {
            setIndividualSample(res);
            const cut = res.numIndividual.split("/")[0];
            const number = cut.match(/\d+/);
            setNumber(cut.match(/\d+/));
            //get all character before cut
            const code = cut.substring(0, cut.indexOf(number));
            setCode(code);

            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy nhà xuát bản thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
        documentStock
          .getAll(0, 0)
          .then((res) => {
            setLoadingTreeData(false);
            setTreeData(
              res.map((item) =>
                genTreeNode(item.id, item.stockName, item.stockParentId),
              ),
            );
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kho lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
        categorySign
          .getAll()
          .then((res) => {
            setCategorySign(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách mã cá biệt thất bại",
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
    values.id = IndividualSample.id;
    values.idDocument = IndividualSample.idDocument;
    values.idCategory = IndividualSample.numIndividual.split("/")[1];
    values.stockId = values?.stockId?.split("/")[1] || IndividualSample.stockId;
    values.documentTypeId = IndividualSample.documentTypeId;
    values.signIndividual = values.number
      ? `${Code}${values.number}`
      : `${Code}${Number}`;
    values.entryDate = values.entryDate || IndividualSample.entryDate;
    values.generalEntryNumber =
      values.generalEntryNumber || IndividualSample.generalEntryNumber;
    values.price = values.price || IndividualSample.price;
    individualSample
      .update(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật mã cá biệt thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate(
          `/admin/dang-ky-ca-biet-tung-bo-sach/children/${location.state.idDocName}`,
        );
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật mã cá biệt thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
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
            <Typography.Title level={3}>
              Chỉnh sửa đăng ký cá biệt
            </Typography.Title>
            <Skeleton loading={loading} active>
              <ProForm
                autoFocusFirstInput
                form={form}
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
                      showSearch
                      label="Tên sách"
                      tooltip="Tên sách đăng ký cá biệt"
                      value={location.state?.docName}
                      disabled
                    />
                    <ProFormSelect
                      width={300}
                      name="sign"
                      value={Code}
                      placeholder="Mã cá biệt"
                      label="Mã cá biệt"
                      required
                      options={CategorySign.map((item) => ({
                        value: item.id,
                        label: `${item.signCode} - ${item.signName}`,
                      }))}
                      disabled
                    />
                    <ProFormDigit
                      label="Số cá biệt"
                      required
                      name="number"
                      width={80}
                      placeholder={"Số cá biệt"}
                      min={1}
                      value={Number}
                    />
                    <ProFormText
                      width="xl"
                      value={IndividualSample?.barcode}
                      placeholder="Mã vạch"
                      label="Mã vạch"
                      disabled
                    />
                    <ProFormMoney
                      label="Giá"
                      name="price"
                      locale="vi-VN"
                      value={IndividualSample?.price}
                      min={0}
                      width="lg"
                      placeholder={"Giá"}
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
                    placeholder={IndividualSample?.createdDate || "Ngày Tạo"}
                    disabled
                  />
                  <ProFormDatePicker
                    width="md"
                    name="entryDate"
                    label="Ngày vào sổ"
                    placeholder="Ngày vào sổ"
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
                  />
                  {/* <ProFormSelect
                    name={"stockId"}
                    label="kho lưu trữ"
                    showSearch
                    width={250}
                    value={IndividualSample?.stockId || "Kho lưu trữ"}
                    options={DocumentStock?.map((item) => ({
                      value: item.id,
                      label: item.stockName,
                    }))}
                  /> */}
                  <Spin spinning={loadingTreeData} size="large">
                    <Form.Item label="Kho lưu trữ" name={"stockId"} required>
                      <TreeSelect
                        showSearch
                        value={IndividualSample?.stockId}
                        treeDataSimpleMode
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        style={{
                          width: 250,
                        }}
                        placeholder={
                          treeData.find(
                            (el) => el.id === IndividualSample?.stockId,
                          )?.title
                        }
                        treeData={treeData}
                      />
                    </Form.Item>
                  </Spin>
                  <ProFormSelect
                    name={"isLostedPhysicalVersion"}
                    label="Tình trạng"
                    tooltip="Tình trạng còn hay mất"
                    width={150}
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
                    value={IndividualSample?.isLostedPhysicalVersion}
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

export const EditSpecialRegistrationBooks = WithErrorBoundaryCustom(
  _EditSpecialRegistrationBooks,
);
