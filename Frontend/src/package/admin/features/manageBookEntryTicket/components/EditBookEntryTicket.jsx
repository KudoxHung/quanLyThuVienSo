import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VariableSizeList } from "react-window";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { readMoney } from "../../../../../units/Read_money";
import { getCookie, openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { categoryColor } from "../../../api/categoryColor";
import { categorySign } from "../../../api/categorySign";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { documentStock } from "../../../api/documentStock";
import { individualSample } from "../../../api/individualSample";
import { Participant } from "../../../api/participant";
import { receipt } from "../../../api/receipt";
import { supply } from "../../../api/supply";
import { users } from "../../../api/users";
import { ModalSelectBooks } from "../../ImportBooks/components/ModalSelectBooks";
import { ModalSelectBooksNew } from "../../ImportBooks/components/ModalSelectBooksNew";
import BỉeuMauHuongDan from "./../../../asset/files/Hướng dẫn sử dụng biểu mẫu nhập sách.docx";
import PhieuNhapSach from "./../../../asset/files/PhieuNhapSach.docx";
import {
  DownloadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  AutoComplete,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Pagination,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tooltip,
  TreeSelect,
  Typography,
  Upload,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import moment from "moment";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

function _EditBookEntryTicket() {
  const param = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [listRepicetById, setListRepicetById] = useState([]);
  // const [price, setPrice] = useState([]);
  // const [quantity, setQuantity] = useState([]);
  const [Books, setBooks] = useState([]);
  const [listSupply, setListSupply] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchDocName, setSearchDocName] = useState(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [booksLoading, setBooksLoading] = useState(true);
  useEffect(() => {
    document.title = "Chỉnh sửa phiếu nhập";
  }, []);
  useEffect(() => {
    if (param.id) {
      supply
        .getSupply(0, 0)
        .then((res) => {
          setListSupply(res);
          console.log("res", res);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "lấy nguồn cung cấp thất bại",
            err?.response?.data?.message || err?.message,
          );
        })
        .finally(() => {
          // setStockLoading(false);
        }),
        receipt
          .getById(param.id)
          .then((res) => {
            form.setFieldsValue({
              ...res,
            });
            setListRepicetById(res);
            const sortedDocuments = res.receiptDetail
              .sort((a, b) => {
                // Kiểm tra trường hợp null
                if (!a.createdDate) return 1; // Đẩy null xuống cuối
                if (!b.createdDate) return -1;

                // Sắp xếp theo createdDate
                const dateComparison =
                  new Date(a.createdDate) - new Date(b.createdDate);

                if (dateComparison === 0) {
                  if (a.documentName && b.documentName) {
                    return a.documentName.localeCompare(b.documentName);
                  }
                  // Nếu một trong hai idDocument là null hoặc undefined, xử lý như sau
                  return a.documentName ? -1 : 1; // Đẩy bản ghi có idDocument vào trước
                }

                return dateComparison; // Nếu không bằng nhau, sắp xếp theo createdDate
              })
              .map((x) => {
                return {
                  id: x.idDocument,
                  docName: x.documentName,
                };
              }); // Lấy idDocument sau khi đã sắp xếp
            console.log(sortedDocuments);
            setListDocumentId(sortedDocuments); // Cập nhật danh sách idDocument
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "lấy thông tin phiếu nhập sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          });
    }
  }, [param, form]);
  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
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
              "lấy kho lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setStockLoading(false);
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
              "lấy các người dùng thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => setLoading(false)),
        books
          .getAllListBookInportBook(pageSize, currentPage, 1, searchDocName)
          .then((res) => {
            if (res !== undefined && res !== null) {
              setTotalBooks(res[0]?.total);
            }
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
            value: item.id,
          },
        ]);
        form.setFields([
          {
            name: ["documentListId", index, "docName"],
            value: item.docName,
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
      listDocumentId.forEach((item, index) => {
        if (item.id !== 0) {
          form.setFields([
            {
              name: ["documentListId", index, "price"],
              value:
                listRepicetById?.receiptDetail
                  .sort(
                    (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
                  )
                  ?.find((el) => el.idDocument === item.id)?.price ||
                Books.find((el) => el.id === item.id)?.price ||
                0,
            },
          ]);
          form.setFields([
            {
              name: ["documentListId", index, "quantity"],
              value:
                listRepicetById?.receiptDetail
                  .sort(
                    (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
                  )
                  ?.find((el) => el.idDocument === item.id)?.quantity || 1,
            },
          ]);
          form.setFields([
            {
              name: ["documentListId", index, "note"],
              value:
                listRepicetById?.receiptDetail
                  .sort(
                    (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
                  )
                  ?.find((el) => el.idDocument === item.id)?.note || "",
            },
          ]);

          Promise.all([
            categorySign
              .CategorySignByDocument(item.id)
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
            individualSample
              .GetIndividualStockNotRepeat(item.id)
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

  const fetchBooks = async (currentPage, pageSize, searchDocName) => {
    setBooksLoading(true);
    try {
      books
        .getAllListBookInportBook(pageSize, currentPage, 1, searchDocName)
        .then((res) => {
          if (res !== undefined && res !== null && res.length >= 1) {
            setTotalBooks(res[0].total);
          } else {
            setTotalBooks(0);
          }
          setBooks(res);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "lấy sách mới thất bại",
            err?.response?.data?.message || err?.message,
          );
        })
        .finally(() => setBooksLoading(false));
    } catch (error) {
      setBooksLoading(false);
    }
  };

  const handlePageChange = async (page, size, searchDocName) => {
    setCurrentPage(page);
    setPageSize(size);
    setSearchDocName(searchDocName);
    await fetchBooks(page, size, searchDocName);
  };

  const onFinish = async (values) => {
    // Duyệt qua mảng documentListId để kiểm tra
    const check = !values.documentListId.some(
      (item) => !item.idCategory || !item.idStock,
    );
    console.log(check);
    if (!check) {
      openNotificationWithIcon(
        "error",
        "Cập nhật thất bại !",
        "Có 1 số Sách chưa có mã cá biệt hoặc kho lưu trữ, bạn hãy kểm tra lại",
      );
      setBtnLoading(false); // Dừng loading
      return; // Ngừng thực hiện tiếp
    }

    setBtnLoading(true);
    try {
      values.receiverIdUser = UserAdmin.id;
      values.createdDate = values.createdDate || moment().format("YYYY-MM-DD");
      values.importDate = values.importDate || moment().format("YYYY-MM-DD");
      values.recordBookDate =
        values.recordBookDate || moment().format("YYYY-MM-DD");
      values.documentListId = values.documentListId.map((item, index) => ({
        idCategory: item.idCategory,
        idDocument: item.idDocument,
        price: item.price,
        quantity: item.quantity,
        idStock: item.idStock,
        note: item.note,
      }));
      values.generalEntryNumber = values.generalEntryNumber || null;

      const res = await receipt.UpdateReceipt(values);
      if (res.success) {
        openNotificationWithIcon(
          "success",
          "Cập nhật thành công",
          res?.response?.data?.message || res?.message,
        );
        return navigate("/admin/phieu-nhap");
      } else {
        openNotificationWithIcon(
          "error",
          "Cập nhật thất bại",
          res?.response?.data?.message || res?.message,
        );
        return navigate("/admin/phieu-nhap");
      }
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Cập nhật thất bại",
        error?.response?.data?.message || error?.message,
      );
    } finally {
      setBtnLoading(false);
    }
  };

  const [treeData, setTreeData] = useState([]);
  const [loadingTreeData, setLoadingTreeData] = useState(true);
  const genTreeNode = (id, title, parentId) => {
    return {
      id: id,
      pId: parentId,
      value: id,
      title: title,
    };
  };

  const handleSearchOriginal = (value) => {
    setOptionsOriginalSearch(
      !value
        ? []
        : optionsOriginal.filter((item) => item.value.includes(value)),
    );
  };
  const handleSearchBookStatus = (value) => {
    setOptionsBookStatusSearch(
      !value
        ? []
        : optionsBookStatus.filter((item) => item.value.includes(value)),
    );
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

  const [currentPage2, setCurrentPage2] = useState(1); // Trang hiện tại
  const [pageSize2, setPageSize2] = useState(5); // Số lượng mục trên mỗi trang

  return (
    <div className="layout-content">
      <ModalSelectBooksNew
        booksLoading={booksLoading}
        isModalOpen={isModalSelectBooks}
        setIsModalOpen={setIsModalSelectBooks}
        books={Books}
        setListDocumentId={setListDocumentId}
        ListDocumentId={listDocumentId}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalBooks={totalBooks}
      />
      {/*<ModalSelectBooks*/}
      {/*  BooksLoading={BooksLoading}* /}
      {/*  isModalOpen={isModalSelectBooks}*/}
      {/*  setIsModalOpen={setIsModalSelectBooks}*/}
      {/*  books={Books}*/}
      {/*  setListDocumentId={setListDocumentId}*/}
      {/*  ListDocumentId={listDocumentId}*/}
      {/*/>*/}
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card
            bordered={false}
            className="criclebox h-full"
            title={
              <Typography.Title level={5}>
                Chỉnh sửa phiếu nhập
              </Typography.Title>
            }
          >
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                          marginTop: 10,
                        }}
                      >
                        <Button
                          size="large"
                          type="primary"
                          key="submit"
                          onClick={() => props.form?.submit?.()}
                          loading={btnLoading}
                          style={{ flex: 1 }}
                        >
                          Xác nhận
                        </Button>
                        <Button
                          style={{
                            flex: 1,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "rgba(255, 255, 255, 1)", // Đặt màu viền trắng
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Thêm hiệu ứng bóng
                          }}
                          size="large"
                          key="rest"
                          // onClick={() => props.form?.resetFields()}
                          loading={btnLoading}
                          onClick={() => navigate(-1)}
                        >
                          Quay lại
                        </Button>
                      </div>,
                    ];
                  },
                }}
              >
                <Form.Item name={"idReceipt"} style={{ display: "none" }} />
                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormDatePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày tạo phiếu"
                    format="DD/MM/YYYY"
                    disabled={true}
                  />
                  <ProFormDatePicker
                    width="md"
                    name={"importDate"}
                    label="Ngày nhập"
                    required
                    placeholder="Ngày nhập"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Ngày nhập",
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
                  <ProFormText
                    width="xl"
                    name="receiptNumber"
                    label="Số chứng từ"
                    tooltip="Số chứng từ"
                    placeholder={"Số chứng từ"}
                  />
                  <ProFormText
                    width="xl"
                    name="generalEntryNumber"
                    required
                    label="Số vào sổ tổng quát"
                    tooltip="Số vào sổ tổng quát có thể để trống. Bạn có thể quay lại chỉnh sửa sau"
                    placeholder={"Số vào sổ tổng quát"}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <Form.Item name={"original"} label="Nguồn sách">
                    <Select
                      style={{ minWidth: "200px" }}
                      showSearch
                      placeholder="Nguồn sách"
                      // onSearch={handleSearchOriginal}
                      filterOption={
                        (input, option) =>
                          option?.children
                            .toLowerCase()
                            .includes(input.toLowerCase()) // Lọc tùy chọn dựa trên đầu vào
                      }
                    >
                      {listSupply.map((option) => (
                        <Select.Option
                          key={option.id}
                          value={option.nameSupply}
                        >
                          {option.nameSupply}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/*<Form.Item name={"original"} label="Nguồn sách">*/}
                  {/*  <AutoComplete options={optionsOriginalSearch} onSearch={handleSearchOriginal}>*/}
                  {/*    <TextArea rows={3} placeholder="Nguồn sách" />*/}
                  {/*  </AutoComplete>*/}
                  {/*</Form.Item>*/}
                  <Form.Item name={"bookStatus"} label="Tình trạng sách">
                    <AutoComplete
                      options={optionsBookStatusSearch}
                      onSearch={handleSearchBookStatus}
                    >
                      <TextArea rows={3} placeholder="Tình trạng sách" />
                    </AutoComplete>
                  </Form.Item>
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
                        {
                          validator: (_, value) => {
                            if (value && value.trim() === "") {
                              return Promise.reject(
                                new Error(
                                  "Tên người giao không được chỉ là khoảng trắng",
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

                {/*<ProFormGroup label={<Typography.Title level={5}>Sách</Typography.Title>}>*/}
                {/*  <Form.List*/}
                {/*    name="documentListId"*/}
                {/*    required*/}
                {/*    rules={[*/}
                {/*      {*/}
                {/*        validator: (_, names) => {*/}
                {/*          if (names.length < 1) {*/}
                {/*            openNotificationWithIcon("warning", "Vui lòng chọn sách");*/}
                {/*            return Promise.reject();*/}
                {/*          }*/}
                {/*          return Promise.resolve();*/}
                {/*        }*/}
                {/*      }*/}
                {/*    ]}*/}
                {/*  >*/}
                {/*    {(fields, { add, remove }) => (*/}
                {/*      <Space direction="vertical">*/}
                {/*        {fields.map(({ key, name, ...restField }) => (*/}
                {/*          <Space key={name} direction="horizontal">*/}
                {/*            <Form.Item {...restField}>*/}
                {/*              <Space key={name} direction="horizontal">*/}
                {/*                <ProFormText*/}
                {/*                  width="xl"*/}
                {/*                  name={[name, "docName"]} // Change this to access the specific docName*/}
                {/*                  label="Sách mới"*/}
                {/*                  tooltip="Sách mới"*/}
                {/*                  disabled={true}*/}
                {/*                />*/}

                {/*                <ProFormSelect*/}
                {/*                  hidden={true}*/}
                {/*                  label="Sách mới"*/}
                {/*                  required*/}
                {/*                  width={250}*/}
                {/*                  name={[name, "idDocument"]}*/}
                {/*                  disabled={true}*/}
                {/*                  placeholder={"Sách mới"}*/}
                {/*                  options={[*/}
                {/*                    ...Books.map((book) => ({*/}
                {/*                      value: book?.document?.id,*/}
                {/*                      label: book?.document?.docName*/}
                {/*                    }))*/}
                {/*                  ]}*/}
                {/*                  rules={[*/}
                {/*                    {*/}
                {/*                      required: true,*/}
                {/*                      message: "Vui lòng chọn sách"*/}
                {/*                    }*/}
                {/*                  ]}*/}
                {/*                />*/}
                {/*                <ProFormSelect*/}
                {/*                  label="Mã cá biệt"*/}
                {/*                  width={250}*/}
                {/*                  required*/}
                {/*                  // initialValue={*/}
                {/*                  //   listIndividual[name]?.length === 1*/}
                {/*                  //     ? listIndividual[name][0]?.id*/}
                {/*                  //     : undefined*/}
                {/*                  // }*/}
                {/*                  name={[name, "idCategory"]}*/}
                {/*                  showSearch*/}
                {/*                  placeholder={"Mã cá biệt"}*/}
                {/*                  options={[*/}
                {/*                    ...listIndividual[name]?.map((CategorySign) => ({*/}
                {/*                      value: CategorySign?.id,*/}
                {/*                      label: `${CategorySign?.signCode} - ${CategorySign?.signName}`*/}
                {/*                    }))*/}
                {/*                  ]}*/}
                {/*                  rules={[*/}
                {/*                    {*/}
                {/*                      required: true,*/}
                {/*                      message: "Vui lòng chọn mã cá biệt"*/}
                {/*                    }*/}
                {/*                  ]}*/}
                {/*                  disabled={listIndividual[name].length === 0}*/}
                {/*                />*/}
                {/*                <Spin spinning={loadingTreeData} size="large">*/}
                {/*                  <Form.Item*/}
                {/*                    label="Kho lưu trữ"*/}
                {/*                    width={250}*/}
                {/*                    name={[name, "idStock"]}*/}
                {/*                    required*/}
                {/*                    rules={[*/}
                {/*                      {*/}
                {/*                        required: true,*/}
                {/*                        message: "chọn kho lưu trữ"*/}
                {/*                      }*/}
                {/*                    ]}*/}
                {/*                  >*/}
                {/*                    <TreeSelect*/}
                {/*                      showSearch*/}
                {/*                      loading={StockLoading}*/}
                {/*                      treeDataSimpleMode*/}
                {/*                      dropdownStyle={{*/}
                {/*                        maxHeight: 400,*/}
                {/*                        overflow: "auto"*/}
                {/*                      }}*/}
                {/*                      style={{*/}
                {/*                        width: 250*/}
                {/*                      }}*/}
                {/*                      placeholder="kho lưu trữ"*/}
                {/*                      treeData={treeData}*/}
                {/*                      disabled={listIndividual[name].length === 0}*/}
                {/*                    />*/}
                {/*                  </Form.Item>*/}
                {/*                </Spin>*/}
                {/*                /!* <ProFormSelect*/}
                {/*                    label="Kho lưu trữ"*/}
                {/*                    required*/}
                {/*                    name={[name, "idStock"]}*/}
                {/*                    showSearch*/}
                {/*                    placeholder={"Kho lưu trữ"}*/}
                {/*                    options={[*/}
                {/*                      ...DocumentStock.map((DocumentStock) => ({*/}
                {/*                        value: DocumentStock?.id,*/}
                {/*                        label: DocumentStock?.stockName,*/}
                {/*                      })),*/}
                {/*                    ]}*/}
                {/*                    rules={[*/}
                {/*                      {*/}
                {/*                        required: true,*/}
                {/*                        message: "Vui lòng chọn Kho lưu trữ",*/}
                {/*                      },*/}
                {/*                    ]}*/}
                {/*                    disabled={StockLoading}*/}
                {/*                  /> *!/*/}
                {/*                <ProFormMoney*/}
                {/*                  label="Giá"*/}
                {/*                  width={100}*/}
                {/*                  name={[name, "price"]}*/}
                {/*                  locale="vi-VN"*/}
                {/*                  min={0}*/}
                {/*                  placeholder={"Giá"}*/}
                {/*                  // onChange={(value) => {*/}
                {/*                  //   setPrice((prev) => {*/}
                {/*                  //     const newPrice = prev.map(*/}
                {/*                  //       (item, index, arr) =>*/}
                {/*                  //         index === name*/}
                {/*                  //           ? (arr[index] = value)*/}
                {/*                  //           : item*/}
                {/*                  //     );*/}
                {/*                  //     return [...newPrice];*/}
                {/*                  //   });*/}
                {/*                  // }}*/}
                {/*                />*/}
                {/*                <ProFormDigit*/}
                {/*                  width={80}*/}
                {/*                  label="Số bản"*/}
                {/*                  initialValue={1}*/}
                {/*                  min={1}*/}
                {/*                  name={[name, "quantity"]}*/}
                {/*                  placeholder={"Số bản"}*/}
                {/*                  // onChange={(value) =>*/}
                {/*                  //   setQuantity((prev) => {*/}
                {/*                  //     const newQuality = prev.map(*/}
                {/*                  //       (item, index, arr) =>*/}
                {/*                  //         index === name*/}
                {/*                  //           ? (arr[index] = value)*/}
                {/*                  //           : item*/}
                {/*                  //     );*/}
                {/*                  //     return [...newQuality];*/}
                {/*                  //   })*/}
                {/*                  // }*/}
                {/*                />*/}
                {/*                /!* <ProFormMoney*/}
                {/*                    locale='vi-VN'*/}
                {/*                    label='Thành tiền'*/}
                {/*                    placeholder={"Thành tiền"}*/}
                {/*                    value={price[name] * quantity[name]}*/}
                {/*                    disabled*/}
                {/*                  /> *!/*/}

                {/*                <ProFormTextArea*/}
                {/*                  name={[name, "note"]}*/}
                {/*                  label="Chú thích"*/}
                {/*                  placeholder={"Chú thích"}*/}
                {/*                  // rows={1}*/}
                {/*                />*/}
                {/*              </Space>*/}
                {/*            </Form.Item>*/}
                {/*          </Space>*/}
                {/*        ))}*/}
                {/*      </Space>*/}
                {/*    )}*/}
                {/*  </Form.List>*/}
                {/*</ProFormGroup>*/}
                <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      // setListDocumentId((prev) => [...prev, 0]);
                      // setlistIndividual((prev) => [...prev, []]);
                      // setPrice((prev) => [...prev, 0]);
                      // setQuantity((prev) => [...prev, 1]);
                      setIsModalSelectBooks(true);

                      // add();
                    }}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 20 }}
                  >
                    Chọn sách
                  </Button>
                </Col>

                {/*Danh sách Sách đã chọn*/}
                <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                  <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Danh sách Sách đã chọn" key="1">
                      <Card bordered={false} className={"criclebox"}>
                        <Form.List name="documentListId">
                          {(fields, { add, remove }) => {
                            const startIdx = (currentPage2 - 1) * pageSize2; // Bắt đầu từ mục đầu tiên của trang hiện tại
                            const endIdx = currentPage2 * pageSize2; // Đến mục cuối cùng của trang hiện tại
                            const paginatedFields = fields.slice(
                              startIdx,
                              endIdx,
                            ); // Lấy các mục thuộc trang hiện tại

                            return (
                              <div>
                                <VariableSizeList
                                  height={400}
                                  itemCount={paginatedFields.length}
                                  itemSize={() => 60}
                                  width="100%"
                                >
                                  {({ index, style }) => {
                                    const { key, name, ...restField } =
                                      paginatedFields[index]; // Chỉ lấy các mục thuộc trang hiện tại
                                    // const { key, name, ...restField } = fields[index];
                                    const bookName = form.getFieldValue([
                                      "documentListId",
                                      name,
                                      "docName",
                                    ]);
                                    return (
                                      <div key={key} style={style}>
                                        <Form.Item
                                          name={[name, "idDocument"]}
                                          hidden
                                        />
                                        <Space
                                          key={name}
                                          style={{
                                            marginBottom: -8,
                                          }}
                                          wrap
                                        >
                                          <Tooltip title={bookName}>
                                            <Form.Item
                                              {...restField}
                                              style={{ width: 200 }}
                                              name={[name, "docName"]}
                                              label={
                                                name === 0 ? (
                                                  <Typography.Text strong>
                                                    Sách mới
                                                  </Typography.Text>
                                                ) : (
                                                  " "
                                                )
                                              }
                                            >
                                              <Input
                                                placeholder="Sách mới"
                                                readOnly
                                              />
                                            </Form.Item>
                                          </Tooltip>
                                          <Form.Item
                                            {...restField}
                                            style={{ width: 200 }}
                                            name={[name, "idCategory"]}
                                            label={
                                              name === 0 ? (
                                                <Typography.Text strong>
                                                  Mã cá biệt
                                                </Typography.Text>
                                              ) : (
                                                " "
                                              )
                                            }
                                            // rules={[
                                            //   {
                                            //     required: true,
                                            //     message: "Vui lòng chọn mã cá biệt"
                                            //   }
                                            // ]}
                                          >
                                            <Select
                                              showSearch
                                              placeholder="Chọn mã cá biệt"
                                              options={
                                                listIndividual[name]?.length
                                                  ? listIndividual[name]?.map(
                                                      (CategorySign) => ({
                                                        value: CategorySign?.id,
                                                        label: `${CategorySign?.signCode} - ${CategorySign?.signName}`,
                                                      }),
                                                    )
                                                  : []
                                              }
                                              disabled={
                                                !listIndividual[name]?.length
                                              }
                                              style={{
                                                fontWeight: "bold",
                                                color: "black",
                                              }}
                                            />
                                          </Form.Item>
                                          <Form.Item
                                            {...restField}
                                            style={{ width: 200 }}
                                            name={[name, "idStock"]}
                                            label={
                                              name === 0 ? (
                                                <Typography.Text strong>
                                                  Kho lưu trữ
                                                </Typography.Text>
                                              ) : (
                                                " "
                                              )
                                            }
                                            // rules={[
                                            //   {
                                            //     required: true,
                                            //     message: "Vui lòng chọn kho lưu trữ"
                                            //   }
                                            // ]}
                                          >
                                            <TreeSelect
                                              showSearch
                                              loading={StockLoading}
                                              treeDataSimpleMode
                                              dropdownStyle={{
                                                maxHeight: 400,
                                                overflow: "auto",
                                              }}
                                              style={{
                                                width: 200,
                                              }}
                                              placeholder="kho lưu trữ"
                                              treeData={treeData}
                                              disabled={
                                                listIndividual[name].length ===
                                                0
                                              }
                                            />
                                          </Form.Item>

                                          <Form.Item
                                            {...restField}
                                            label={
                                              name === 0 ? (
                                                <Typography.Text strong>
                                                  Giá
                                                </Typography.Text>
                                              ) : (
                                                " "
                                              )
                                            }
                                            name={[name, "price"]}
                                            // rules={[
                                            //   {
                                            //     required: true,
                                            //     message: "Vui lòng nhập giá"
                                            //   }
                                            // ]}
                                          >
                                            <InputNumber
                                              // onChange={(value) => {
                                              //   form.setFieldsValue({ [name]: { price: value } }); // Cập nhật giá trị vào form
                                              // }}
                                              placeholder="Giá"
                                              min={0}
                                              formatter={(value) =>
                                                `${value} đ`.replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ",",
                                                )
                                              }
                                              //parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                            />
                                          </Form.Item>

                                          <Form.Item
                                            {...restField}
                                            style={{ marginBottom: 0 }}
                                            label={
                                              name === 0 ? (
                                                <Typography.Text strong>
                                                  Số bản
                                                </Typography.Text>
                                              ) : (
                                                " "
                                              )
                                            }
                                            name={[name, "quantity"]}
                                          >
                                            <ProFormDigit
                                              width={80}
                                              min={1}
                                              initialValue={1}
                                              placeholder="Số bản"
                                            />
                                          </Form.Item>
                                          <Form.Item
                                            {...restField}
                                            name={[name, "note"]}
                                            label={
                                              name === 0 ? (
                                                <Typography.Text strong>
                                                  Chú thích
                                                </Typography.Text>
                                              ) : (
                                                " "
                                              )
                                            }
                                          >
                                            <Input placeholder="Chú thích" />
                                          </Form.Item>
                                          <Form.Item
                                            label={name === 0 ? "" : ""}
                                            {...restField}
                                            style={{ marginBottom: 0 }}
                                          >
                                            <MinusCircleOutlined
                                              onClick={() => {
                                                const id = form.getFieldValue([
                                                  "documentListId",
                                                  name,
                                                  "idDocument",
                                                ]);
                                                setListDocumentId(
                                                  listDocumentId.filter(
                                                    (item) => item.id !== id,
                                                  ),
                                                );
                                                remove(name);
                                              }}
                                            />
                                          </Form.Item>
                                        </Space>
                                      </div>
                                    );
                                  }}
                                </VariableSizeList>
                                <Pagination
                                  current={currentPage2}
                                  pageSize={pageSize2}
                                  total={fields.length}
                                  onChange={(page, pageSize) => {
                                    setCurrentPage2(page);
                                    setPageSize2(pageSize);
                                  }}
                                  showSizeChanger
                                  pageSizeOptions={[5, 10, 20, 50]}
                                />
                              </div>
                            );
                          }}
                        </Form.List>
                      </Card>
                    </Tabs.TabPane>
                  </Tabs>
                </Col>
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

export const generateDocument = async (data, type = 0) => {
  if (type === 0) {
    await Promise.all([
      //Phiếu nhập sách
      books
        .GetFileImageWordInsertBook(2)
        .then((res) => {
          loadFile(
            window.URL.createObjectURL(new Blob([res])),
            function (error, content) {
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
                // console.log(JSON.stringify({ error: error }, replaceErrors));

                if (
                  error.properties &&
                  error.properties.errors instanceof Array
                ) {
                  const errorMessages = error.properties.errors
                    .map(function (error) {
                      return error.properties.explanation;
                    })
                    .join("\n");
                  // console.log("errorMessages", errorMessages);
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
              saveAs(out, `Phiếu nhập sách-${data?.receiptCode}.docx`);
            },
          );
          openNotificationWithIcon("success", "Tải phiếu nhập sách thành công");
        })
        .catch((err) => {
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
              // console.log(JSON.stringify({ error: error }, replaceErrors));

              if (
                error.properties &&
                error.properties.errors instanceof Array
              ) {
                const errorMessages = error.properties.errors
                  .map(function (error) {
                    return error.properties.explanation;
                  })
                  .join("\n");
                // console.log("errorMessages", errorMessages);
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
            saveAs(out, `Phiếu nhập sách-${data?.receiptCode}.docx`);
          });
          openNotificationWithIcon(
            "success",
            "Tải phiếu nhập sách thành công",
            "Sử dụng phiếu nhập mặc định",
          );
        }),
      //Biểu mẫu nhập sách
      books
        .GetFileImageWordInsertBook(1)
        .then((res) => {
          loadFile(
            window.URL.createObjectURL(new Blob([res])),
            function (error, content) {
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
                // console.log(JSON.stringify({ error: error }, replaceErrors));

                if (
                  error.properties &&
                  error.properties.errors instanceof Array
                ) {
                  const errorMessages = error.properties.errors
                    .map(function (error) {
                      return error.properties.explanation;
                    })
                    .join("\n");
                  // console.log("errorMessages", errorMessages);
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
              saveAs(out, `Biên bản nhập sách-${data?.receiptCode}.docx`);
            },
          );
          openNotificationWithIcon(
            "success",
            "Tải biên bản nhập sách thành công",
          );
        })
        .catch((err) => {
          openNotificationWithIcon(
            "warning",
            "Không tìm thấy biên bản",
            "Vui lòng tải lên",
          );
        }),
    ]);
  } else if (type === 2) {
    //Phiếu nhập sách
    books
      .GetFileImageWordInsertBook(2)
      .then((res) => {
        loadFile(
          window.URL.createObjectURL(new Blob([res])),
          function (error, content) {
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
              // console.log(JSON.stringify({ error: error }, replaceErrors));

              if (
                error.properties &&
                error.properties.errors instanceof Array
              ) {
                const errorMessages = error.properties.errors
                  .map(function (error) {
                    return error.properties.explanation;
                  })
                  .join("\n");
                // console.log("errorMessages", errorMessages);
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
            saveAs(out, `Phiếu nhập sách-${data?.receiptCode}.docx`);
          },
        );
        openNotificationWithIcon("success", "Tải phiếu nhập sách thành công");
      })
      .catch((err) => {
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
            // console.log(JSON.stringify({ error: error }, replaceErrors));

            if (error.properties && error.properties.errors instanceof Array) {
              const errorMessages = error.properties.errors
                .map(function (error) {
                  return error.properties.explanation;
                })
                .join("\n");
              // console.log("errorMessages", errorMessages);
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
          saveAs(out, `Phiếu nhập sách-${data?.receiptCode}.docx`);
        });
        openNotificationWithIcon(
          "success",
          "Tải phiếu nhập sách thành công",
          "Sử dụng phiếu nhập mặc định",
        );
      });
  } else if (type === 1) {
    //Biểu mẫu nhập sách
    books
      .GetFileImageWordInsertBook(1)
      .then((res) => {
        loadFile(
          window.URL.createObjectURL(new Blob([res])),
          function (error, content) {
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
              // console.log(JSON.stringify({ error: error }, replaceErrors));

              if (
                error.properties &&
                error.properties.errors instanceof Array
              ) {
                const errorMessages = error.properties.errors
                  .map(function (error) {
                    return error.properties.explanation;
                  })
                  .join("\n");
                // console.log("errorMessages", errorMessages);
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
            saveAs(out, `Biên bản nhập sách-${data?.receiptCode}.docx`);
          },
        );
        openNotificationWithIcon(
          "success",
          "Tải biên bản nhập sách thành công",
        );
      })
      .catch((err) => {
        openNotificationWithIcon(
          "warning",
          "Không tìm thấy biên bản",
          "Vui lòng tải lên",
        );
      });
  }
};

export const EditBookEntryTicket =
  WithErrorBoundaryCustom(_EditBookEntryTicket);
