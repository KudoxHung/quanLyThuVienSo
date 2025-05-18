import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { books } from "../../../api/books";
import { documentInVoice } from "../../../api/documentInVoice";
import { individualSample } from "../../../api/individualSample";
import PhieuMuonSach from "./../../../asset/files/PhieuMuonTaiLieu.docx";
import {
  BarcodeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ProForm, ProFormSelect, ProFormTextArea } from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import moment from "moment";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

import "./LoanSlip.css";

function _LoanSlipLayout() {
  const [loading, setLoading] = useState(false);
  const [Users, setUsers] = useState([]);
  const [Units, setUnits] = useState([]);
  const [Individuals, setIndividuals] = useState([]);
  const [IndividualSampleId, setIndividualSampleId] = useState([]);
  const [IndividualSample, setIndividualSample] = useState([]);
  const [documentIdRef, setDocumentIdRef] = useState([]);
  const [Books, setBooks] = useState([]);
  const [BooksFilterIndividualSample, setBooksFilterIndividualSample] =
    useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [valueBarcode, setValueBarcode] = useState("");
  const [listBooksbyBarcode, setListBooksbyBarcode] = useState([]);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lập phiếu mượn";
  });

  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        users
          .getAllUnit()
          .then((res) => {
            setUnits(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách đơn vị thất bại",
              err?.reponese?.data?.message || err?.message,
            );
          }),
        individualSample
          .getAll(0, 0)
          .then((res) => {
            setIndividuals(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy mã cá biệt thất bại",
              err?.reponese?.data?.message || err?.message,
            );
          }),
        users
          .getAllUsersNotBlock(0, 0)
          .then((res) => {
            setUsers(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách người dùng thất bại",
              err?.reponese?.data?.message,
            );
            setLoading(false);
          }),
        books
          .GetBookExistIndividualCode(1)
          .then((res) => {
            setBooks(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách thất bại",
              err?.reponese?.data?.message,
            );
            setLoading(false);
          }),
      ]);
    };
    fecthData();
  }, []);

  useEffect(() => {
    IndividualSampleId.forEach((id, index) => {
      if (id !== 0) {
        documentInVoice
          .GetBookAndIndividualNotBorrow(id)
          .then((res) => {
            if (res.individuals !== null) {
              setIndividualSample((pre) => {
                const newIndividualSample = pre.map((item, indexs, arr) =>
                  index === indexs
                    ? (arr[indexs] = [...res?.individuals])
                    : item,
                );
                return [...newIndividualSample];
              });
            } else {
              setIndividualSample((pre) => {
                const newIndividualSample = pre.map((item, indexs, arr) =>
                  index === indexs ? (arr[indexs] = []) : item,
                );
                return [...newIndividualSample];
              });
            }
          })
          .catch((err) => {
            console.log(
              `Lấy mã cá biệt theo id ${id} thất bại`,
              err?.reponese?.data?.message,
            );
          });
      }
    });
  }, [IndividualSampleId]);

  useEffect(() => {
    setBooksFilterIndividualSample((pre) => {
      // remove elements with IndividualSampleId in array pre
      const newBooks = Books.filter((item) => {
        return !IndividualSampleId.includes(item?.document?.id);
      });
      return [...newBooks];
    });
  }, [IndividualSampleId, Books]);

  const handleBarcodeScanner = (e) => {
    setValueBarcode(e);
    if (e !== "" && e.length === 13) {
      setBtnLoading(true);
      individualSample
        .GetSpineByBarcode(e)
        .then((res) => {
          if (res.barcode == null) {
            openNotificationWithIcon(
              "info",
              "Bản sách đã mất, không tồn tại hoặc đã được mượn."`Số mã vạch ${e}`,
            );
            setBtnLoading(false);
            setValueBarcode("");
          } else {
            setListBooksbyBarcode((prev) =>
              prev.find((item) => item.barcode === res.barcode)
                ? [...prev]
                : [...prev, res],
            );
            setBtnLoading(false);
            setValueBarcode("");
          }
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Lấy thông tin sách theo mã vạch thất bại",
            err?.reponese?.data?.message || err?.message,
          );
          setValueBarcode("");
          setBtnLoading(false);
        });
    }
  };

  const onFinish = (values) => {
    console.log(1);
    if (listBooksbyBarcode.length === 0) {
      if (
        values?.documentAndIndividual?.length === undefined ||
        values?.documentAndIndividual?.length === 0
      ) {
        openNotificationWithIcon("warning", "Vui lòng chọn sách");
        return;
      }
    }
    setBtnLoading(true);
    values.dateIn = moment(values.restdate[0]).format("DD/MM/YYYY HH:mm");
    values.dateOut = moment(values.restdate[1]).format("DD/MM/YYYY HH:mm");
    // values.createDate = moment().format("DD/MM/YYYY HH:mm");
    delete values.restdate;
    let tempArr = [];
    if (values?.documentAndIndividual?.length > 0) {
      tempArr = [...values?.documentAndIndividual, ...listBooksbyBarcode];
    } else {
      tempArr = [...listBooksbyBarcode];
    }
    // loop tempArr groups {idDocument,idIndividual:[]} with the same idDocument
    const newTempArr = tempArr.reduce((acc, cur, pre) => {
      const found = acc.find((item) => item.idDocument === cur.idDocument);
      if (found) {
        found.idIndividual.push(cur.idIndividual);
      } else {
        acc.push({
          idDocument: cur.idDocument,
          idIndividual: [cur.idIndividual],
        });
      }
      return acc;
    }, []);

    values.documentAndIndividual = newTempArr.map((items) => ({
      idDocument: items.idDocument,
      idIndividual: items.idIndividual.reduce((acc, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((item) => {
            acc.push(item);
          });
        } else {
          acc.push(cur);
        }
        return acc;
      }, []),
    }));

    documentInVoice
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Lập phiếu mượn thành công",
          res?.message,
        );
        setBtnLoading(false);

        documentInVoice
          .getById(res?.id)
          .then((respone) => {
            //openNotificationWithIcon("success", "Xuất phiếu mượn thành công");
            respone.fullname = Users.find(
              (el) => el.id === respone.userId,
            )?.fullname;
            respone.userCode = Users.find(
              (el) => el.id === respone.userId,
            )?.userCode;
            respone.unitName = Units.find(
              (el) =>
                el.id === Users.find((el) => el.id === respone.userId)?.unitId,
            )?.unitName;
            respone.dateOutEdit = moment(respone.dateOut).format(
              "DD/MM/YYYY HH:mm",
            );
            respone.dateInEdit = moment(respone.dateIn).format(
              "DD/MM/YYYY HH:mm",
            );
            respone.documentAndIndividualView.sort(
              (a, b) =>
                Books.find((el) => el.document.id === a.idDocument)?.document
                  ?.docName.length -
                Books.find((el) => el.document.id === b.idDocument)?.document
                  ?.docName.length,
            );
            respone.table = [
              ...respone.documentAndIndividualView.map((item, index) => ({
                index: index + 1,
                documentName: Books.find(
                  (el) => el.document.id === item.idDocument,
                )?.document?.docName,
                Individual: Individuals.find(
                  (el) => el.id === item.idIndividual,
                )?.numIndividual.split("/")[0],
              })),
            ];

            // generateDocument(respone); Cho nay de in phieu muon khi bam xac nhap hoan thanh lap phieu muon
            setTimeout(() => {
              navigate("/admin/tra-sach");
            }, 1000);
          })
          .catch((err) => {
            openNotificationWithIcon("success", "Xuất phiếu mượn thất bại");
            navigate("/admin/tra-sach");
          });
      })
      .catch((err) => {
        console.log("err", err);
        openNotificationWithIcon(
          "error",
          "Lập phiếu mượn thất bại",
          `${err?.response?.data?.message}`,
        );
        setBtnLoading(false);
      });
  };
  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={3}>Tạo phiếu mượn</Typography.Title>
            <Skeleton loading={loading} active>
              <ProForm
                form={form}
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
                      <Space
                        style={{
                          justifyContent: "flex-end",
                          width: "100%",
                          marginTop: 20,
                        }}
                        wrap
                      >
                        <Button
                          size="large"
                          key="rest"
                          onClick={() => props.form?.resetFields()}
                          loading={btnLoading}
                        >
                          Cài lại
                        </Button>
                        <Button
                          size="large"
                          type="primary"
                          key="submit"
                          onClick={() => props.form?.submit?.()}
                          loading={btnLoading}
                        >
                          Xác nhận
                        </Button>
                      </Space>,
                    ];
                  },
                }}
              >
                <Row gutter={[24, 0]}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Spin spinning={Users.length === 0}>
                      <Form.Item
                        label={
                          <Typography.Title level={5}>
                            Tìm người mượn thủ công
                          </Typography.Title>
                        }
                        name={"userId"}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn người mượn",
                          },
                        ]}
                      >
                        <Select
                          suffixIcon={<SearchOutlined />}
                          showSearch
                          placeholder={"Chọn người mượn"}
                          optionFilterProp={"label"}
                          options={[
                            ...Users.map((user) => ({
                              value: user?.id,
                              label:
                                user?.fullname +
                                " - " +
                                user?.userCode +
                                " - " +
                                user?.email,
                            })),
                          ]}
                          onChange={() =>
                            form.setFieldsValue({ userIdBarCode: "" })
                          }
                        />
                      </Form.Item>
                    </Spin>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Spin spinning={Users.length === 0}>
                      <Form.Item
                        label={
                          <Typography.Title level={5}>
                            Tìm người mượn bằng quét mã vạch
                          </Typography.Title>
                        }
                        name={"userIdBarCode"}
                      >
                        <Input
                          allowClear
                          suffix={<BarcodeOutlined style={{ fontSize: 24 }} />}
                          placeholder={"Quét mã vạch người dùng"}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length !== 0) {
                              setTimeout(() => {
                                const user = Users.find(
                                  (el) => el.userCode === value,
                                );
                                if (user) {
                                  form.setFieldsValue({
                                    userId: user.id,
                                  });
                                }
                              }, 500);
                            }
                          }}
                        />
                      </Form.Item>
                    </Spin>
                  </Col>
                </Row>
                <Form.Item
                  label={
                    <Typography.Title level={5}>
                      Thời gian mượn
                    </Typography.Title>
                  }
                  name="restdate"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <DatePicker.RangePicker
                    ranges={{
                      "Mượn 1 ngày": [moment(), moment().add(1, "days")],
                      "Mượn 3 ngày": [moment(), moment().add(3, "days")],
                      "Mượn 5 ngày": [moment(), moment().add(5, "days")],
                      "Mượn 7 ngày": [moment(), moment().add(6, "days")],
                      "Mượn 14 ngày": [moment(), moment().add(14, "days")],
                      "Mượn 21 ngày": [moment(), moment().add(21, "days")],
                      "Mượn 30 ngày": [moment(), moment().add(30, "days")],
                      "Mượn 60 ngày": [moment(), moment().add(60, "days")],
                      "Mượn 90 ngày": [moment(), moment().add(90, "days")],
                      "Tháng này": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                    }}
                    format="DD-MM-YYYY HH:mm"
                    placeholder={["Ngày mượn", "Ngày trả"]}
                  />
                </Form.Item>
                <ProFormTextArea
                  name={"note"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                />
                <Input.TextArea
                  placeholder={` Quét mã vạch ở đây`}
                  rows={3}
                  onChange={(e) => handleBarcodeScanner(e.target.value)}
                  style={{
                    marginBottom: 15,
                  }}
                  value={valueBarcode}
                />
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.List
                      name="documentAndIndividual"
                      required
                      style={{ height: 500, overflow: "auto" }}
                    >
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={name} direction="horizontal">
                              <Form.Item
                                {...restField}
                                style={{ marginBottom: 0 }}
                              >
                                <Space key={name} direction="horizontal">
                                  <ProFormSelect
                                    style={{ width: 300 }}
                                    disabled={documentIdRef[name]}
                                    label="Sách mượn"
                                    required
                                    name={[name, "idDocument"]}
                                    onChange={(value) => {
                                      setIndividualSampleId((pre) => {
                                        const newIndividualSampleId = pre.map(
                                          (item, index, arr) =>
                                            index === name
                                              ? (arr[index] = value)
                                              : item,
                                        );
                                        return [...newIndividualSampleId];
                                      });
                                    }}
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder={"Sách mượn"}
                                    options={[
                                      ...BooksFilterIndividualSample.map(
                                        (book) => ({
                                          value: book?.document?.id,
                                          label: book?.document?.docName,
                                        }),
                                      ),
                                    ]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng chọn sách",
                                      },
                                    ]}
                                  />
                                  <ProFormSelect
                                    mode="multiple"
                                    label="Mã cá biệt"
                                    required
                                    showSearch
                                    name={[name, "idIndividual"]}
                                    onChange={(value) => {
                                      if (value !== undefined) {
                                        setDocumentIdRef((prev) => {
                                          const newDocumentIdRef = prev.map(
                                            (item, index, arr) =>
                                              index === name
                                                ? (arr[index] = true)
                                                : item,
                                          );
                                          return [...newDocumentIdRef];
                                        });
                                      } else {
                                        setDocumentIdRef((prev) => {
                                          const newDocumentIdRef = prev.map(
                                            (item, index, arr) =>
                                              index === name
                                                ? (arr[index] = false)
                                                : item,
                                          );
                                          return [...newDocumentIdRef];
                                        });
                                      }
                                    }}
                                    placeholder={"Mã cá biệt"}
                                    options={[
                                      ...IndividualSample[name]?.map(
                                        (IndividualSample) => ({
                                          value: IndividualSample?.id,
                                          label:
                                            IndividualSample?.numIndividual.split(
                                              "/",
                                            )[0],
                                        }),
                                      ),
                                    ]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng chọn mã cá biệt",
                                      },
                                    ]}
                                    disabled={
                                      IndividualSample[name].length === 0
                                    }
                                  />
                                </Space>
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(name);
                                  setIndividualSampleId((pre) => {
                                    pre.splice(name, 1);
                                    return [...pre];
                                  });
                                  // setIndividualSample((pre) => {
                                  //   pre.splice(name, 1);
                                  //   return [...pre];
                                  // });
                                  setDocumentIdRef((prev) => {
                                    prev.splice(name, 1);
                                    return [...prev];
                                  });
                                }}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                                setIndividualSampleId((prev) => [...prev, 0]);
                                setIndividualSample((prev) => [...prev, []]);
                                setDocumentIdRef((prev) => [...prev, false]);
                              }}
                              block
                              icon={<PlusOutlined />}
                            >
                              Thêm sách mượn
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Card
                      title={`Danh sách sách mượn - Tổng sách : ${listBooksbyBarcode.length} `}
                    >
                      <List
                        showSearch
                        loading={false}
                        itemLayout="horizontal"
                        dataSource={listBooksbyBarcode}
                        style={{
                          width: "100%",
                          overflow: "auto",
                          height: "400px",
                        }}
                        renderItem={(item, index) => (
                          <List.Item
                            actions={[
                              <MinusCircleOutlined
                                onClick={() =>
                                  setListBooksbyBarcode((prev) => {
                                    //delete item from listBooksbyBarcode
                                    prev.splice(index, 1);
                                    return [...prev];
                                  })
                                }
                              />,
                            ]}
                          >
                            <Skeleton
                              avatar
                              title={false}
                              loading={btnLoading}
                              active
                            >
                              <List.Item.Meta
                                title={
                                  <Tooltip
                                    title={
                                      Books.find(
                                        (book) =>
                                          book.document.id === item?.idDocument,
                                      )?.document?.docName
                                    }
                                  >
                                    <Typography.Text>
                                      {Books.find(
                                        (book) =>
                                          book.document.id === item?.idDocument,
                                      )?.document?.docName?.length > 22
                                        ? `${Books.find(
                                            (book) =>
                                              book.document.id ===
                                              item?.idDocument,
                                          )?.document?.docName?.slice(
                                            0,
                                            22,
                                          )}...`
                                        : Books.find(
                                            (book) =>
                                              book.document.id ===
                                              item?.idDocument,
                                          )?.document?.docName}
                                    </Typography.Text>
                                  </Tooltip>
                                }
                                description={`Mã cá biệt : ${item?.numIndividual.split("/")[0]}`}
                              />
                              Mã vạch : {item?.barcode}
                            </Skeleton>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </ProForm>
            </Skeleton>
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
  loadFile(PhieuMuonSach, function (error, content) {
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
    saveAs(out, `PhieuMuonTaiLieu-${data?.invoiceCode}.docx`);
  });
};

export const LoanSlipLayout = WithErrorBoundaryCustom(_LoanSlipLayout);
