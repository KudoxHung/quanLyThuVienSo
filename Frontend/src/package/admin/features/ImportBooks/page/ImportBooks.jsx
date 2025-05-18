import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VariableSizeList } from "react-window";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { getCookie, openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { categorySign } from "../../../api/categorySign";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { documentStock } from "../../../api/documentStock";
import { individualSample } from "../../../api/individualSample";
import { Participant } from "../../../api/participant";
import { receipt } from "../../../api/receipt";
import { supply } from "../../../api/supply";
import { users } from "../../../api/users";
import { ModalSelectBooks } from "../components/ModalSelectBooks";
import { ModalSelectBooksNew } from "../components/ModalSelectBooksNew";
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
import { debounce, set } from "lodash";
import moment from "moment";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

function _ImportBooks() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  // const [price, setPrice] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [stock, setStock] = useState({});
  const [Books, setBooks] = useState([]);
  const [Bookss, setBookss] = useState([]);
  //const [BooksLoading, setBooksLoading] = useState(true);
  const [UserAdmin, setUserAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [StockLoading, setStockLoading] = useState(true);
  const [listDocumentId, setListDocumentId] = useState([]);
  const [listSupply, setListSupply] = useState([]);
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

  const [currentPage2, setCurrentPage2] = useState(1); // Trang hiện tại
  const [pageSize2, setPageSize2] = useState(5); // Số lượng mục trên mỗi trang

  const [treeData, setTreeData] = useState([]);
  const [loadingTreeData, setLoadingTreeData] = useState(true);

  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  useEffect(() => {
    document.title = "Nhập sách";
  }, []);

  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        supply
          .getSupply(0, 0)
          .then((res) => {
            setListSupply(res);
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
        books
          .getAllBook(0, 0)
          .then((res) => {
            setBookss(res);
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
      const keysToDeleteStock = Object.entries(stock)
        .filter(
          ([key, value]) => !listDocumentId.find((item) => item.id === key),
        )
        .map(([key]) => key);

      if (keysToDeleteStock.length > 0) {
        setStock((prev) => {
          const updated = { ...prev };
          keysToDeleteStock.forEach((key) => delete updated[key]);
          return updated;
        });
      }

      const keysToDelete = Object.entries(quantity)
        .filter(
          ([key, value]) => !listDocumentId.find((item) => item.id === key),
        )
        .map(([key]) => key);

      if (keysToDelete.length > 0) {
        setQuantity((prev) => {
          const updated = { ...prev };
          keysToDelete.forEach((key) => delete updated[key]);
          return updated;
        });
      }

      listDocumentId.forEach((item, index) => {
        if (item.id !== 0) {
          form.setFields([
            {
              name: ["documentListId", index, "price"],
              value: Bookss.find((el) => el.id === item.id)?.price || 0,
            },
          ]);

          form.setFields([
            {
              name: ["documentListId", index, "quantity"],
              value: quantity[item.id] || 1,
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

                  form.setFields([
                    {
                      name: ["documentListId", index, "idCategory"],
                      value:
                        newIndividualSample[index] &&
                        newIndividualSample[index].length === 1 &&
                        newIndividualSample[index][0]?.id
                          ? newIndividualSample[index][0].id
                          : undefined,
                    },
                  ]);

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
                if (res.stocks === null) {
                  form.setFields([
                    {
                      name: ["documentListId", index, "idStock"],
                      value: stock[item.id] ? stock[item.id] : null,
                    },
                  ]);
                } else {
                  if (res.stocks.length >= 1) {
                    form.setFields([
                      {
                        name: ["documentListId", index, "idStock"],
                        value: stock[item.id]
                          ? stock[item.id]
                          : res?.stocks[0]?.idStock,
                      },
                    ]);
                  }
                }
              })
              .catch((err) => {}),
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

  const onFinish = (values) => {
    setBtnLoading(true);

    // Duyệt qua mảng documentListId để kiểm tra
    const check = !values.documentListId.some(
      (item) => !item.idCategory || !item.idStock,
    );
    if (!check) {
      openNotificationWithIcon(
        "error",
        "Thêm phiếu nhập thất bại !",
        "Có 1 số Sách chưa có mã cá biệt hoặc kho lưu trữ, bạn hãy kểm tra lại",
      );
      setBtnLoading(false);
      return;
    }

    values.receiverIdUser = UserAdmin.id;
    values.createdDate = values.createdDate || moment().format("YYYY-MM-DD");
    values.recordBookDate =
      values.recordBookDate || moment().format("YYYY-MM-DD");
    values.importDate = values.importDate || moment().format("YYYY-MM-DD");
    values.documentListId = values.documentListId.map((item, index) => ({
      idCategory: item.idCategory,
      idDocument: item.idDocument,
      price: item.price,
      quantity: item.quantity,
      idStock: item.idStock,
      note: item.note,
    }));
    values.receiptType = 0;
    values.generalEntryNumber = values.generalEntryNumber || null;
    receipt
      .create(values)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thêm phiếu nhập thành công",
          res?.message,
        );
        navigate("/admin/phieu-nhap");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm phiếu nhập thất bại !",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => setBtnLoading(false));
  };

  const genTreeNode = (id, title, parentId) => {
    return {
      id: id,
      pId: parentId,
      value: id,
      title: title,
    };
  };

  const props = {
    name: "file",
    action: `${apiUrl}/api/Book/ImportFileWordInsertBook?type=2`,
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
    action: `${apiUrl}/api/Book/ImportFileWordInsertBook?type=1`,
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

  const handleChangeQuantity = debounce((value, idd) => {
    setQuantity((prev) => ({
      ...prev,
      [idd]: value,
    }));
  }, 300); // 500ms debounce time

  const handleChangeStock = debounce((value, idd) => {
    setStock((prev) => ({
      ...prev,
      [idd]: value,
    }));
  }, 300);

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

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={5}>Nhập sách</Typography.Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => window.open("/admin/khai-bao-sach/new")}>
                Thêm sách mới
              </Button>
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
                  Tải phiếu nhập lên
                </Button>
              </Upload>
              <Button
                icon={<DownloadOutlined />}
                loading={btnLoading}
                onClick={() => {
                  books
                    .GetFileImageWordInsertBook(2)
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
                        "phiếu nhập nhập sách hiện tại.docx",
                      );
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch((err) => {
                      openNotificationWithIcon("success", "Thành công");
                      window.location.href = PhieuNhapSach;
                    });
                }}
              >
                Xem phiếu nhập hiện tại
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
                    .GetFileImageWordInsertBook(1)
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
                        "Biên bản nhập sách hiện tại.docx",
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
                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
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
                    name={"importDate"}
                    label="Ngày nhập"
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

                <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setIsModalSelectBooks(true);
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
                                    const bookName = form.getFieldValue([
                                      "documentListId",
                                      name,
                                      "docName",
                                    ]);
                                    const idd = form.getFieldValue([
                                      "documentListId",
                                      name,
                                      "idDocument",
                                    ]);
                                    const bookPrice = Bookss.find(
                                      (x) => x.id == idd,
                                    ).price;
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
                                              placeholder="Kho lưu trữ"
                                              treeData={treeData}
                                              disabled={
                                                listIndividual[name].length ===
                                                0
                                              }
                                              onChange={(value) => {
                                                handleChangeStock(value, idd);
                                              }}
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
                                              value={bookPrice || 0}
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
                                              onChange={(value) => {
                                                handleChangeQuantity(
                                                  value,
                                                  idd,
                                                );
                                              }}
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
                                                setQuantity((prev) => ({
                                                  ...prev,
                                                  [idd]: 1,
                                                }));

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

                if (
                  error.properties &&
                  error.properties.errors instanceof Array
                ) {
                  const errorMessages = error.properties.errors
                    .map(function (error) {
                      return error.properties.explanation;
                    })
                    .join("\n");
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

              if (
                error.properties &&
                error.properties.errors instanceof Array
              ) {
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
                console.log(JSON.stringify({ error: error }, replaceErrors));

                if (
                  error.properties &&
                  error.properties.errors instanceof Array
                ) {
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
              console.log(JSON.stringify({ error: error }, replaceErrors));

              if (
                error.properties &&
                error.properties.errors instanceof Array
              ) {
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
              console.log(JSON.stringify({ error: error }, replaceErrors));

              if (
                error.properties &&
                error.properties.errors instanceof Array
              ) {
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

export const ImportBooks = WithErrorBoundaryCustom(_ImportBooks);
