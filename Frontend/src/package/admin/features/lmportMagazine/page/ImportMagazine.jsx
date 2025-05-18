import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { categorySign } from "../../../api/categorySign";
import { documentStock } from "../../../api/documentStock";
import { receipt } from "../../../api/receipt";
import { users } from "../../../api/users";
import PhieuNhapSach from "./../../../asset/files/PhieuNhapSach.docx";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import moment from "moment";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

function _ImportMagazine() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [Books, setBooks] = useState([]);
  const [BooksLoading, setBooksLoading] = useState(true);
  const [UserAdmin, setUserAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [DocumentStock, setDocumentStock] = useState([]);
  const [StockLoading, setStockLoading] = useState(true);
  const [listDocumentId, setListDocumentId] = useState([]);
  const [listIndividual, setlistIndividual] = useState([]);

  useEffect(() => {
    document.title = "Nhập sách báo tạp chí";
  }, []);

  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        documentStock
          .getAll(0, 0)
          .then((res) => {
            setStockLoading(false);
            setDocumentStock(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kho lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        users
          .getUsers()
          .then((res) => {
            setUserAdmin(res.data);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách người dùng thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        books
          .getAll(0, 0, 2)
          .then((res) => {
            setBooks(res);
            setBooksLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách mới thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fecthData();
  }, []);

  useEffect(() => {
    listDocumentId.forEach((id, index) => {
      if (id !== 0) {
        categorySign
          .CategorySignByDocument(id)
          .then((res) => {
            setlistIndividual((pre) => {
              const newIndividualSample = pre.map((item, indexs, arr) =>
                index === indexs && res !== null
                  ? (arr[indexs] = [...res])
                  : item,
              );
              return [...newIndividualSample];
            });
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách mã cá biệt theo id thất bại",
              err?.response?.data?.message || err?.message,
            );
          });
      }
    });
  }, [listDocumentId]);

  const onFinish = (values) => {
    setBtnLoading(true);
    values.receiverIdUser = UserAdmin.id;
    values.receiverName = UserAdmin.fullname;
    values.createdDate = values.createdDate || moment().format("YYYY-MM-DD");

    receipt
      .create(values)
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res.message);
        receipt
          .getById(res.idReceipt)
          .then((res) => {
            res.day = moment(res.createdDate).format("DD");
            res.month = moment(res.createdDate).format("MM");
            res.year = moment(res.createdDate).format("YYYY");
            res.totalQuality = res.receiptDetail.reduce((pre, cur, index) => {
              return pre + cur.quantity;
            }, 0);
            const TotalPrice = res.receiptDetail.reduce((pre, cur, index) => {
              return pre + cur.price * cur.quantity;
            }, 0);

            res.totalPrice = TotalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            });
            res.table = [
              ...res.receiptDetail.map((item, index) => ({
                index: index + 1,
                documentName: item.documentName,
                quantity: item.quantity,
                price: item.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }),
                total: item.total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }),
                namePublisher: item.namePublisher,
                note: item.note,
              })),
            ];
            res.receiptDetail = res.receiptDetail.map((item) => ({
              ...item,
              categoryName: Books.find(
                (book) => book.document.id === item.idDocument,
              )?.nameCategory,
            }));

            res.nameCategorys = [
              ...res.receiptDetail.map((item) => ({
                nameCategory: item.categoryName,
                //sum quantity by nameCategory
                quantity: res.receiptDetail.reduce((pre, cur) => {
                  return (
                    pre +
                    (cur.categoryName === item.categoryName ? cur.quantity : 0)
                  );
                }, 0),
              })),
            ];
            // loop and duplicate filter nameCategory
            res.nameCategorys = res.nameCategorys.reduce((pre, cur, index) => {
              const isExist = pre.find(
                (item) => item.nameCategory === cur.nameCategory,
              );
              if (!isExist) {
                pre.push(cur);
              }
              return pre;
            }, []);
            //sort nameCategory by quantity
            res.nameCategorys = res.nameCategorys.sort((a, b) => {
              return a.quantity - b.quantity;
            });

            res.ManagingUnit = "";
            generateDocument(res);
            setBtnLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "getById error",
              err?.response?.data?.message || err?.message,
            );
          });
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lỗi",
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
            <Typography.Title level={5}>Nhập sách báo tạp chí</Typography.Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => window.open("/admin/khai-bao-sach/new")}>
                Thêm sách mới báo tạp chí
              </Button>
            </Space>
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
                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormDatePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày nhập"
                    required
                    placeholder="Ngày nhập"
                    value={moment().format("DD-MM-YYYY")}
                  />
                  <ProFormText
                    width="md"
                    name={"original"}
                    label="Nguồn cấp"
                    placeholder="Nguồn cấp"
                  />
                  <ProFormTextArea
                    name={"reason"}
                    label="Lý do nhập"
                    placeholder="Lý do nhập"
                  />
                </ProForm.Group>

                <ProFormGroup>
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>Người nhận</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="receiverName"
                      required
                      label="Tên người nhận"
                      tooltip="Tên người nhận"
                      disabled
                      value={UserAdmin.fullname}
                    />
                    <ProFormText
                      width="xl"
                      name="receiverPosition"
                      label="Chức vụ người nhận"
                      placeholder={"Chức vụ người nhận"}
                    />
                    <ProFormText
                      width="xl"
                      name="receiverUnitRepresent"
                      label="Đại diện bên nhận"
                      placeholder={"Đại diện bên nhận"}
                    />
                  </ProFormGroup>
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>Người giao</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="deliverName"
                      required
                      label="Tên người giao"
                      tooltip="Tên người giao"
                      placeholder={"Tên người giao"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên người giao",
                        },
                      ]}
                    />
                    <ProFormText
                      width="xl"
                      name="deliverPosition"
                      label="Chức vụ bên giao"
                      placeholder={"Chức vụ bên giao"}
                    />
                    <ProFormText
                      width="xl"
                      name="deliverUnitRepresent"
                      label="Đại diện bên giao"
                      placeholder={"Đại diện bên giao"}
                    />
                  </ProFormGroup>
                </ProFormGroup>
                <ProFormGroup
                  label={
                    <Typography.Title level={5}>
                      Sách báo tạp chí
                    </Typography.Title>
                  }
                >
                  <Form.List
                    name="documentListId"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn sách để tạo phiếu nhập",
                      },
                    ]}
                  >
                    {(fields, { add, remove }) => (
                      <Space direction="vertical">
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={name} direction="horizontal">
                            <Form.Item {...restField}>
                              <Space key={name} direction="horizontal">
                                <ProFormSelect
                                  label="Sách mới"
                                  required
                                  name={[name, "idDocument"]}
                                  showSearch
                                  onChange={(value) => {
                                    setListDocumentId((prev) => {
                                      const newIndividualSampleId = prev.map(
                                        (item, index, arr) =>
                                          index === name
                                            ? (arr[index] = value)
                                            : item,
                                      );
                                      return [...newIndividualSampleId];
                                    });
                                  }}
                                  placeholder={"Sách mới"}
                                  options={[
                                    ...Books.map((book) => ({
                                      value: book?.document?.id,
                                      label: book?.document?.docName,
                                    })),
                                  ]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn sách",
                                    },
                                  ]}
                                  disabled={BooksLoading}
                                />
                                <ProFormSelect
                                  label="Mã cá biệt"
                                  required
                                  name={[name, "idCategory"]}
                                  showSearch
                                  placeholder={"Mã cá biệt"}
                                  options={[
                                    ...listIndividual[name].map(
                                      (CategorySign) => ({
                                        value: CategorySign?.id,
                                        label: `${CategorySign?.signCode} - ${CategorySign?.signName}`,
                                      }),
                                    ),
                                  ]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn mã cá biệt",
                                    },
                                  ]}
                                  disabled={listIndividual[name].length === 0}
                                />
                                <ProFormSelect
                                  label="Kho lưu trữ"
                                  required
                                  name={[name, "idStock"]}
                                  showSearch
                                  placeholder={"Kho lưu trữ"}
                                  options={[
                                    ...DocumentStock.map((DocumentStock) => ({
                                      value: DocumentStock?.id,
                                      label: DocumentStock?.stockName,
                                    })),
                                  ]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn Kho lưu trữ",
                                    },
                                  ]}
                                  disabled={StockLoading}
                                />
                                <ProFormMoney
                                  label="Giá"
                                  name={[name, "price"]}
                                  locale="vi-VN"
                                  initialValue={0}
                                  min={0}
                                  width="lg"
                                  placeholder={"Giá"}
                                  onChange={(value) => setPrice(value)}
                                />
                                <ProFormDigit
                                  label="Số bản"
                                  initialValue={1}
                                  min={1}
                                  name={[name, "quantity"]}
                                  placeholder={"Số bản"}
                                  onChange={(value) => setQuantity(value)}
                                />
                                <ProFormMoney
                                  locale="vi-VN"
                                  label="Thành tiền"
                                  placeholder={"Thành tiền"}
                                  value={price * quantity}
                                  disabled
                                />

                                <ProFormTextArea
                                  name={[name, "note"]}
                                  label="Chú thích"
                                  placeholder={"Chú thích"}
                                />
                              </Space>
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => {
                                remove(name);
                              }}
                            />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              setListDocumentId((prev) => [...prev, 0]);
                              setlistIndividual((prev) => [...prev, []]);
                              add();
                            }}
                            block
                            icon={<PlusOutlined />}
                          >
                            Thêm sách báo tạp chi
                          </Button>
                        </Form.Item>
                      </Space>
                    )}
                  </Form.List>
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

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
export const generateDocument = (data) => {
  loadFile(PhieuNhapSach, function (error, content) {
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    var doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.setData(data);
    try {
      doc.render();
    } catch (error) {
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function (
            error,
            key,
          ) {
            error[key] = value[key];
            return error;
          }, {});
        }
        return value;
      }
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function (error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    var out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }); //Output the document using Data-URI
    saveAs(out, `PhieuNhapSach-${data?.receiptCode}.docx`);
  });
};

export const ImportMagazine = WithErrorBoundaryCustom(_ImportMagazine);
