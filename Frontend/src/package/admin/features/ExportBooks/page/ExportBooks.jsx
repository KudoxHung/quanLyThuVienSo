import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VariableSizeList } from "react-window";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { getCookie, openNotificationWithIcon } from "../../../../client/utils";
import { auditBookList } from "../../../api/auditBookList";
import { books } from "../../../api/books";
import { categoryPublishers } from "../../../api/categoryPublishers";
import { categorySign } from "../../../api/categorySign";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { individualSample } from "../../../api/individualSample";
import { Participant } from "../../../api/participant";
import { receipt } from "../../../api/receipt";
import { statusBook } from "../../../api/statusBook.";
import { users } from "../../../api/users";
import ModalProgress from "../../../components/ModalProgress/ModalProgress";
import { ModalAddLineExportBooks } from "../components/ModalAddLineExportBooks";
import { ModalSelectBooks } from "../components/ModalSelectBooks";
import BỉeuMauHuongDan from "./../../../asset/files/Hướng dẫn sử dụng biểu mẫu nhập sách.docx";
import {
  DownloadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  TreeSelect,
  Typography,
  Upload,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

function _ExportBooks() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [Books, setBooks] = useState([]);
  const [AuditBookList, setAuditBookList] = useState([]);
  const [BooksLoading, setBooksLoading] = useState(true);
  const [UserAdmin, setUserAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [StockLoading, setStockLoading] = useState(true);
  const [listDocumentId, setListDocumentId] = useState([]);
  const [listIndividual, setlistIndividual] = useState([]);
  const [ManagingUnit, setManagingUnit] = useState("");
  const [isModalSelectBooks, setIsModalSelectBooks] = useState(false);
  const [optionsOriginal, setOptionsOriginal] = useState([]);
  const [optionsOriginalSearch, setOptionsOriginalSearch] = useState([]);
  const [optionsBookStatus, setOptionsBookStatus] = useState([]);
  const [optionsBookStatusSearch, setOptionsBookStatusSearch] = useState([]);
  const [optionsNameParticipant, setOptionsNameParticipant] = useState([]);
  const [optionsNameParticipantSearch, setOptionsNameParticipantSearch] =
    useState([]);
  const [optionsMissionParticipant, setOptionsMissionParticipant] = useState(
    [],
  );
  const [optionsMissionParticipantSearch, setOptionsMissionParticipantSearch] =
    useState([]);
  const [optionsPositionParticipant, setOptionsPositionParticipant] = useState(
    [],
  );
  const [
    optionsPositionParticipantSearch,
    setOptionsPositionParticipantSearch,
  ] = useState([]);
  const [CategoryPublishers, setCategoryPublishers] = useState([]);
  const [StatusBook, setStatusBook] = useState([]);
  const [isOpenAddLine, setIsOpenAddLine] = useState(false);
  const [listIdIndividualSelected, setListIdIndividualSelected] = useState("");
  const [startProgress, setStartProgress] = useState(false);
  const [StatusBookSuperFluous, setStatusBookSuperFluous] = useState([]);

  useEffect(() => {
    document.title = "Xuất sách";
  }, []);
  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        users
          .getUsers()
          .then((res) => {
            setUserAdmin(res.data);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "lấy các người dùng thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => setLoading(false)),
        books
          .getAll(0, 0, 1)
          .then((res) => {
            setBooks(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "lấy sách mới thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => setBooksLoading(false)),
        auditBookList
          .getAllAuditBookList(0, 0)
          .then((res) => {
            setAuditBookList(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "lấy danh sách kiểm kê sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        ContactAndIntroduction.read(1, 1, 2)
          .then((res) => {
            setManagingUnit(res[0].col10);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "lấy tên đơn vị thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        receipt.GetListOriginal().then((res) => {
          setOptionsOriginal(
            res.map((el) => {
              return {
                value: el,
              };
            }),
          );
        }),
        receipt.GetListBookStatus().then((res) => {
          setOptionsBookStatus(
            res.map((el) => {
              return {
                value: el,
              };
            }),
          );
        }),
        Participant.GetlistNameParticipants(0, 0).then((res) => {
          setOptionsNameParticipant(
            res.map((el) => {
              return {
                value: el,
              };
            }),
          );
        }),
        Participant.GetlistMissionParticipants(0, 0).then((res) => {
          setOptionsMissionParticipant(
            res.map((el) => {
              return {
                value: el,
              };
            }),
          );
        }),
        Participant.GetlistPositionParticipants(0, 0).then((res) => {
          setOptionsPositionParticipant(
            res.map((el) => {
              return {
                value: el,
              };
            }),
          );
        }),
      ]);
    };
    fecthData();
  }, []);
  useEffect(() => {
    if (listDocumentId.length > 0) {
      setlistIndividual([]);

      form.setFieldsValue({
        documentListId: [],
      });
      listDocumentId.forEach((item, index) => {
        form.setFields([
          {
            name: ["documentListId", index, "idDocument"],
            value: item,
          },
        ]);
        setlistIndividual((prev) => [...prev, []]);
      });
    } else if (listDocumentId.length === 0) {
      setlistIndividual([]);

      form.setFieldsValue({
        documentListId: [],
      });
    }
  }, [listDocumentId]);

  useEffect(() => {
    if (listDocumentId.length > 0) {
      listDocumentId.forEach((id, index) => {
        if (id !== 0) {
          form.setFields([
            {
              name: ["documentListId", index, "price"],
              value:
                Books.find((el) => el.document.id === id)?.document?.price || 0,
            },
          ]);
          form.setFields([
            {
              name: ["documentListId", index, "quantity"],
              value: 1,
            },
          ]);
          form.setFields([
            {
              name: ["documentListId", index, "publisher"],
              value:
                Books.find((el) => el.document.id === id)?.document
                  ?.publisher || 0,
            },
          ]);

          form.setFields([
            {
              name: ["documentListId", index, "statusBookName"],
              value: id,
            },
          ]);

          Promise.all([
            categorySign
              .CategorySignByDocument(id)
              .then((res) => {
                setlistIndividual((pre) => {
                  const newIndividualSample = pre.map((item, indexs, arr) =>
                    index === indexs && res !== null
                      ? (arr[indexs] = [...res])
                      : item,
                  );

                  if (newIndividualSample[index]?.length === 1) {
                    form.setFields([
                      {
                        name: ["documentListId", index, "idCategory"],
                        value: newIndividualSample[index][0].id,
                      },
                    ]);
                  } else {
                    form.setFields([
                      {
                        name: ["documentListId", index, "idCategory"],
                        value: undefined,
                      },
                    ]);
                  }
                  return [...newIndividualSample];
                });
              })
              .catch((err) => {
                // openNotificationWithIcon(
                //   "error",
                //   "Lấy mã cá biệt theo sách thất bại",
                //   err?.response?.data?.message || err?.message
                // );
              }),
            statusBook
              .GetStatusBookByIdDocument(id)
              .then((res) => {
                form.setFields([
                  {
                    name: ["documentListId", index, "statusBookName"],
                    value: res.result.payload.nameStatusBook,
                  },
                ]);
              })
              .catch((err) => {
                openNotificationWithIcon(
                  "error",
                  "lấy sách mới thất bại",
                  err?.response?.data?.message || err?.message,
                );
              }),
            individualSample
              .GetIndividualStockNotRepeat(id)
              .then((res) => {
                if (res.stocks.length >= 1) {
                  form.setFields([
                    {
                      name: ["documentListId", index, "idStock"],
                      value: res?.stocks[0]?.idStock,
                    },
                  ]);
                }
              })
              .catch((err) => {
                // openNotificationWithIcon(
                //   "error",
                //   "Lấy mã kho lưu trữ theo sách thất bại",
                //   err?.response?.data?.message || err?.message
                // );
              }),
          ]);
        }
      });
    }
  }, [listDocumentId]);

  useEffect(() => {
    categoryPublishers
      .getAll()
      .then((res) => {
        setCategoryPublishers(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "lấy các người dùng thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    statusBook
      .GetAllStatusBook(0, 0, 1)
      .then((res) => {
        setStatusBook(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy trạng thái sách thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  const props = {
    name: "file",
    action: `${apiUrl}/api/Book/ImportFileWordInsertBook?type=4`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },

    onChange(info) {
      if (info.file.status === "done") {
        openNotificationWithIcon(
          "success",
          `${info.file.name} - ${info.file.response}`,
        );
      } else if (info.file.status === "error") {
        openNotificationWithIcon(
          "warning",
          `${info.file.name} - ${info.file.response}`,
        );
      }
    },

    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const propsBieuMau = {
    name: "file",
    action: `${apiUrl}/api/Book/ImportFileWordInsertBook?type=3`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },

    onChange(info) {
      if (info.file.status === "done") {
        openNotificationWithIcon(
          "success",
          `${info.file.name} - ${info.file.response}`,
        );
      } else if (info.file.status === "error") {
        openNotificationWithIcon(
          "warning",
          `${info.file.name} - ${info.file.response}`,
        );
      }
    },

    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const handleSearchNameParticipant = (value) => {
    setOptionsNameParticipantSearch(
      !value
        ? []
        : optionsNameParticipant.filter((item) => item.value.includes(value)),
    );
  };
  const handleSearchPositionParticipant = (value) => {
    setOptionsPositionParticipantSearch(
      !value
        ? []
        : optionsPositionParticipant.filter((item) =>
            item.value.includes(value),
          ),
    );
  };
  const handleSearchMissionParticipant = (value) => {
    setOptionsMissionParticipantSearch(
      !value
        ? []
        : optionsMissionParticipant.filter((item) =>
            item.value.includes(value),
          ),
    );
  };

  const handleSubmit = (values) => {
    if (values.documentListId.length === 0) {
      openNotificationWithIcon(
        "warning",
        "Thất bại !",
        "Vui lòng chọn sách để xuất",
      );
      return;
    }
    console.log(values);
    values.receiverIdUser = UserAdmin.id;
    values.createdDate = values.createdDate || moment().format("YYYY-MM-DD");
    values.recordBookDate =
      values.recordBookDate || moment().format("YYYY-MM-DD");
    values.exportDate = values.exportDate || moment().format("YYYY-MM-DD");
    receipt
      .InsertReceiptExportBooks(values)
      .then((res) => {
        if (res.success) {
          openNotificationWithIcon(
            "success",
            "Thông báo !",
            res?.message || res?.data?.message,
          );
          return navigate("/admin/phieu-xuat");
        } else {
          openNotificationWithIcon(
            "warning",
            "Thất bại !",
            res?.message || res?.data?.message,
          );
        }
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thất bại !",
          "Có lỗi khi tạo phiếu xuất sách",
        );
        console.log("err :>> ", err);
      });
  };

  return (
    <div className="layout-content">
      <ModalProgress
        start={startProgress}
        title={"Tiến trình đang thực hiện"}
      />
      <ModalSelectBooks
        BooksLoading={BooksLoading}
        isModalOpen={isModalSelectBooks}
        setIsModalOpen={setIsModalSelectBooks}
        books={Books}
        setListDocumentId={setListDocumentId}
        ListDocumentId={listDocumentId}
      />
      <ModalAddLineExportBooks
        visible={isOpenAddLine}
        setVisible={setIsOpenAddLine}
        form={form}
        StatusBook={StatusBook}
        listIdIndividualSelected={listIdIndividualSelected}
        setStartProgress={setStartProgress}
      />

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Card bordered={false} className="criclebox h-full">
          <Row gutter={[24, 0]}>
            {/* 5 button liên quan đến file word */}
            <Col sm={24} xs={24} md={24} lg={24} xl={24}>
              <Typography.Title level={5}>Xuất sách</Typography.Title>
              <Space
                style={{
                  marginBottom: 16,
                }}
              >
                <Upload
                  {...props}
                  accept=".docx, .doc"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isWord =
                      file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    if (!isWord) {
                      openNotificationWithIcon(
                        "warning",
                        "Bạn chỉ có thể tải lên tệp Word!",
                        "Vui lòng chọn lại tệp Word!",
                      );
                    }
                    return isWord;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} loading={btnLoading}>
                    Tải phiếu xuất lên
                  </Button>
                </Upload>

                <Button
                  icon={<DownloadOutlined />}
                  loading={btnLoading}
                  onClick={() => {
                    books
                      .GetFileImageWordInsertBook(3)
                      .then((res) => {
                        openNotificationWithIcon(
                          "success",
                          "Thành công",
                          res?.message,
                        );
                        const url = window.URL.createObjectURL(new Blob([res]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          "phiếu xuất sách hiện tại.docx",
                        );
                        document.body.appendChild(link);
                        link.click();
                      })
                      .catch((err) => {
                        openNotificationWithIcon(
                          "warning",
                          "Không tìm thấy phiếu xuất sách nào",
                          "Vui lòng tải phiếu xuất lên",
                        );
                      });
                  }}
                >
                  Xem phiếu xuất hiện tại
                </Button>

                <Upload
                  {...propsBieuMau}
                  accept=".docx, .doc"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isWord =
                      file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    if (!isWord) {
                      openNotificationWithIcon(
                        "warning",
                        "Bạn chỉ có thể tải lên tệp Word!",
                        "Vui lòng chọn lại tệp Word!",
                      );
                    }
                    return isWord;
                  }}
                  maxCount={1}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={btnLoading}
                    ghost
                    type="primary"
                  >
                    Tải biên bản lên
                  </Button>
                </Upload>
                <Button
                  icon={<DownloadOutlined />}
                  loading={btnLoading}
                  onClick={() => {
                    books
                      .GetFileImageWordInsertBook(4)
                      .then((res) => {
                        openNotificationWithIcon(
                          "success",
                          "Thành công",
                          res?.message,
                        );
                        const url = window.URL.createObjectURL(new Blob([res]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          "Biên bản xuất sách hiện tại.docx",
                        );
                        document.body.appendChild(link);
                        link.click();
                      })
                      .catch((err) => {
                        openNotificationWithIcon(
                          "warning",
                          "Không tìm thấy biên bản",
                          "Vui lòng tải biên bản lên",
                        );
                      });
                  }}
                  ghost
                  type="primary"
                >
                  Xem biên bản hiện tại
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  loading={btnLoading}
                  type="primary"
                  onClick={() => {
                    window.location.href = BỉeuMauHuongDan;
                  }}
                >
                  Xem hướng dẫn
                </Button>
              </Space>
            </Col>

            {/* Form thông tin cơ bản của xuất sách*/}
            <Col sm={24} xs={24} md={24} lg={24} xl={24}>
              <ProForm.Group
                label={<Typography.Title level={5}>Thông tin</Typography.Title>}
              >
                <ProFormText
                  width="md"
                  name="receiptType"
                  initialValue={1}
                  hidden
                />
                <ProFormDatePicker
                  width="md"
                  name={"createdDate"}
                  label="Ngày tạo phiếu"
                  required
                  placeholder="Ngày tạo phiếu"
                  value={moment()}
                  format="DD/MM/YYYY"
                  disabled={true}
                  tooltip="Ngày tạo phiếu trên hệ thống"
                />
                <ProFormDatePicker
                  width="md"
                  name={"exportDate"}
                  label="Ngày xuất"
                  required
                  placeholder="Ngày xuất"
                  format="DD/MM/YYYY"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn Ngày xuất",
                    },
                  ]}
                />
                <ProFormDatePicker
                  width="md"
                  name={"recordBookDate"}
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
              </ProForm.Group>

              <ProForm.Group>
                <ProFormTextArea
                  name={"reason"}
                  label="Lý do xuất"
                  placeholder="Lý do xuất"
                  width="xl"
                />
              </ProForm.Group>

              <ProFormGroup>
                <ProFormGroup
                  label={
                    <Typography.Title level={5}>Người xuất</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="receiverName"
                    required
                    label="Tên người xuất"
                    tooltip="Tên người xuất"
                    placeholder={"Tên người xuất"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên người xuất",
                      },
                      {
                        validator: (_, value) => {
                          if (value && value.trim() === "") {
                            return Promise.reject(
                              new Error(
                                "Tên người xuất không được chỉ là khoảng trắng",
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="receiverPosition"
                    label="Chức vụ người xuất"
                    placeholder={"Chức vụ người xuất"}
                  />
                  <ProFormText
                    width="xl"
                    name="receiverUnitRepresent"
                    label="Đại diện bên xuất"
                    placeholder={"Đại diện bên xuất"}
                  />
                </ProFormGroup>
              </ProFormGroup>

              <ProFormGroup>
                <ProFormGroup
                  label={
                    <Typography.Title level={5}>Người nhận</Typography.Title>
                  }
                >
                  <ProFormText
                    width="xl"
                    name="deliverName"
                    required
                    label="Tên người nhận"
                    tooltip="Tên người nhận"
                    placeholder={"Tên người nhận"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên người nhận",
                      },
                      {
                        validator: (_, value) => {
                          if (value && value.trim() === "") {
                            return Promise.reject(
                              new Error(
                                "Tên người nhận không được chỉ là khoảng trắng",
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="deliverPosition"
                    label="Chức vụ bên nhận"
                    placeholder={"Chức vụ bên nhận"}
                  />
                  <ProFormText
                    width="xl"
                    name="deliverUnitRepresent"
                    label="Đại diện bên nhận"
                    placeholder={"Đại diện bên nhận"}
                  />
                </ProFormGroup>
              </ProFormGroup>

              <ProFormGroup
                label={
                  <Typography.Title level={5}>
                    Thành phần tham dự
                  </Typography.Title>
                }
              >
                <Form.List name="participants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{
                            display: "flex",
                            marginBottom: 8,
                          }}
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, "name"]}>
                            <AutoComplete
                              options={optionsNameParticipantSearch}
                              onSearch={handleSearchNameParticipant}
                            >
                              <Input placeholder="Họ và tên" />
                            </AutoComplete>
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "position"]}>
                            <AutoComplete
                              options={optionsPositionParticipantSearch}
                              onSearch={handleSearchPositionParticipant}
                            >
                              <Input placeholder="Chức vụ" />
                            </AutoComplete>
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "mission"]}>
                            <AutoComplete
                              options={optionsMissionParticipantSearch}
                              onSearch={handleSearchMissionParticipant}
                            >
                              <Input placeholder="Nhiệm vụ" />
                            </AutoComplete>
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "note"]}>
                            <TextArea placeholder="Ghi chú" rows={1} />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm thành phần
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </ProFormGroup>
            </Col>

            {/*Button chọn sách*/}
            <Col sm={24} xs={24} md={24} lg={24} xl={24}>
              <Button
                type="dashed"
                onClick={() => {
                  const listIdIndividualSelected = form
                    .getFieldValue("documentListId")
                    ?.map((item) => item.idIndividual);
                  setListIdIndividualSelected(listIdIndividualSelected);
                  setIsOpenAddLine(true);
                }}
                block
                icon={<PlusOutlined />}
                style={{ marginBottom: 20 }}
              >
                Chọn sách
              </Button>
            </Col>

            {/*Danh sách sách đã chọn*/}
            <Col sm={24} xs={24} md={24} lg={24} xl={24}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Danh sách Sách đã chọn" key="1">
                  <Card bordered={false} className={"criclebox"}>
                    <Form.List name="documentListId">
                      {(fields, { add, remove }) => (
                        <div>
                          <VariableSizeList
                            height={400}
                            itemCount={fields.length}
                            itemSize={() => 50}
                            width="100%"
                          >
                            {({ index, style }) => {
                              const { key, name, ...restField } = fields[index];
                              const bookName = form.getFieldValue([
                                "documentListId",
                                name,
                                "bookName",
                              ]);
                              return (
                                <div key={key} style={style}>
                                  <Form.Item
                                    name={[name, "idDocument"]}
                                    hidden
                                  />
                                  <Form.Item
                                    name={[name, "idIndividualSample"]}
                                    hidden
                                  />
                                  <Space
                                    key={name}
                                    style={{
                                      marginBottom: -8,
                                    }}
                                    wrap
                                  >
                                    <Form.Item
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            STT
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Typography.Text
                                        style={{
                                          width: 50,
                                          display: "inline-block",
                                        }}
                                        strong
                                      >
                                        {name + 1}
                                      </Typography.Text>
                                    </Form.Item>

                                    <Tooltip title={bookName}>
                                      <Form.Item
                                        {...restField}
                                        style={{ width: 250 }}
                                        name={[name, "documentName"]}
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              Tên sách
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <Input placeholder="Sách" readOnly />
                                      </Form.Item>
                                    </Tooltip>
                                    <Form.Item
                                      {...restField}
                                      style={{ width: 100 }}
                                      name={[name, "numIndividual"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Số ĐKCB
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Input
                                        placeholder="Số ĐKCB"
                                        readOnly
                                        style={{
                                          fontWeight: "bold",
                                          color: "black",
                                        }}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      style={{ width: 150 }}
                                      name={[name, "publisher"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Nhà xuất bản
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Input placeholder="Loại sách" readOnly />
                                    </Form.Item>

                                    <Form.Item
                                      {...restField}
                                      style={{ width: 100 }}
                                      name={[name, "price"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Giá bìa
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <InputNumber
                                        placeholder="Giá bìa"
                                        readOnly
                                        min={0}
                                        formatter={(value) =>
                                          `${value} đ`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ",",
                                          )
                                        }
                                        parser={(value) =>
                                          value.replace(/\$\s?|(,*)/g, "")
                                        }
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      {...restField}
                                      name={[name, "statusIndividual"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Tình trạng sách
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Input
                                        placeholder="Tình trạng sách"
                                        readOnly
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      {...restField}
                                      name={[name, "note"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Ghi chú
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Input placeholder="Ghi chú" />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                    />
                                  </Space>
                                </div>
                              );
                            }}
                          </VariableSizeList>
                        </div>
                      )}
                    </Form.List>
                  </Card>
                </Tabs.TabPane>
              </Tabs>
            </Col>

            <Divider />

            {/*Button gửi form*/}
            <Col sm={24} xs={24} md={24} lg={24} xl={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={btnLoading}
                  block
                >
                  Xác nhận Tạo phiếu xuất
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}

export const ExportBooks = WithErrorBoundaryCustom(_ExportBooks);
