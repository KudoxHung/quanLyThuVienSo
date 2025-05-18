import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { readMoney } from "../../../../../units/Read_money";
import { openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { receipt } from "../../../api/receipt";
import { generateDocument } from "../../ImportBooks";
import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Input,
  List,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import moment from "moment";

function _ManageBookEntryTicket() {
  const navigate = useNavigate();
  const [Receipt, setReceipt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [visibleListBooks, setVisibleListBooks] = useState(false);
  const [BooksRecord, setBooksRecord] = useState([]);
  const [Books, setBooks] = useState([]);
  const [ManagingUnit, setManagingUnit] = useState("");
  const [filters, setFilters] = useState(null);
  const [sorters, setSorters] = useState(null);
  const [filtersState, setFiltersState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    pagination: null,
  });
  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });
  const searchInput = useRef(null);
  const handleSearch = (confirm) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm theo ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Cài lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
            }}
          >
            Lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });
  // getColumnSearchDateProps
  const getColumnSearchDateProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <DatePicker
          ref={searchInput}
          placeholder={`Tìm theo ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e ? [e] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Cài lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
            }}
          >
            Lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    showTotal: (total) => `Tổng số: ${total} bản ghi`,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  const fetchData = (params = {}) => {
    setLoading(true);
    receipt
      .GetListReceiptManyParam(getRandomuserParams(params))
      .then((res) => {
        setReceipt(res);
        setPagination({
          ...params.pagination,
          total: res[0]?.total,
          showTotal: (total) => `Tổng số: ${total} bản ghi`,
        });
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  // const handleTableChange = (newPagination, filters, sorter) => {
  //   fetchData({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination: newPagination,
  //     ...filters
  //   });
  // };

  // useEffect(() => {
  //   fetchData({
  //     pagination
  //   });
  // }, [postLength]);
  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log("newPagination", newPagination);

    // Gộp bộ lọc cũ và mới, chỉ ghi đè nếu giá trị mới không phải null
    const combinedFilters = { ...newFilters };
    // Cập nhật bộ lọc, sắp xếp và phân trang
    setFilters(combinedFilters);
    setSorters(sorter);

    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...combinedFilters,
    });

    const filtersState = {
      filteredInfo: combinedFilters,
      sortedInfo: sorter,
      pagination: newPagination,
    };
    setFiltersState(filtersState);

    // Lưu trạng thái vào localStorage
    localStorage.setItem(
      "filtersPhieuNhap",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: newPagination,
      }),
    );

    console.log("Updated filters:", combinedFilters);
  };
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersPhieuNhap"));
    console.log("savedFilters", savedFilters);

    setFiltersState(savedFilters);

    if (savedFilters?.filteredInfo) {
      console.log("alo", savedFilters?.filteredInfo);
      setFilters(savedFilters.filteredInfo);
    }

    if (savedFilters?.sortedInfo) {
      setSorters(savedFilters.sortedInfo);
    }

    if (savedFilters?.pagination) {
      setPagination(savedFilters.pagination);
    }
    fetchData({
      sortField: savedFilters?.sortedInfo?.field || sorters?.field,
      sortOrder: savedFilters?.sortedInfo?.order || sorters?.order,
      pagination: savedFilters?.pagination ?? pagination,
      ...(savedFilters?.filteredInfo || filters),
    });
  }, [postLength]);

  useEffect(() => {
    document.title = "Quản lý phiếu nhập";
  }, []);

  useEffect(() => {
    setBtnLoading(true);
    const fecthData = async () => {
      Promise.all([
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
          })
          .finally(() => setBtnLoading(false)),
      ]);
    };
    fecthData();
  }, []);

  const loadBookByListIdDocument = () => {
    books
      .getAll(0, 0, 1)
      .then((res) => {
        setBooks(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách sách thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handleDelete = (id) => {
    setBtnLoading(true);
    receipt
      .delete(id)
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res.message);
        setBtnLoading(false);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Lỗi", err.response.data.message);
        setBtnLoading(false);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handlePrint = async (id, type) => {
    try {
      setBtnLoading(true);

      // Lấy thông tin phiếu
      const res = await receipt.getById(id);
      console.log("res", res);

      let ListIdDocument = "";
      res.documentListId.forEach((item) => {
        ListIdDocument += `,${item.idDocument}`;
      });

      // Đợi kết quả từ books.getAll
      const res2 = await books.getAllVer2(0, 0, 1, ListIdDocument);

      // Cập nhật state books
      setBooks(res2);

      // Tiếp tục xử lý với res sau khi đã Cập nhật books
      res.deliverPosition = res.deliverPosition || " ";
      res.deliverUnitRepresent = res.deliverUnitRepresent || " ";
      res.reason = res.reason || " ";
      res.original = res.original || " ";
      res.bookStatus = res.bookStatus || " ";
      res.receiverPosition = res.receiverPosition || " ";
      res.receiverUnitRepresent = res.receiverUnitRepresent || " ";
      res.hours = moment().format("H");
      res.mins = moment().format("mm");
      res.hoursAddOne = moment().add(1, "hours").format("H");
      res.minsAddOneHours = moment().add(1, "hours").format("mm");
      res.day = moment(res.createdDate).format("DD");
      res.month = moment(res.createdDate).format("MM");
      res.year = moment(res.createdDate).format("YYYY");
      res.totalQuality = res.receiptDetail.reduce(
        (pre, cur) => pre + cur.quantity,
        0,
      );

      // Tính tổng giá
      const TotalPrice = res.receiptDetail
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
        .reduce((pre, cur) => pre + cur.price * cur.quantity, 0);
      res.totalPrice = TotalPrice.toLocaleString("vi-VN", { currency: "VND" });
      res.totalPriceText = readMoney(TotalPrice + "");

      // Sắp xếp và xử lý bảng
      res.table = [
        ...res.receiptDetail
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
          .map((item, index) => ({
            index: index + 1,
            documentName: item.documentName,
            quantity: item.quantity,
            price: item.price.toLocaleString("vi-VN", { currency: "VND" }),
            total: item.total.toLocaleString("vi-VN", { currency: "VND" }),
            namePublisher: item.namePublisher,
            note: item.note || " ",
          })),
      ];

      // Cập nhật chi tiết tài liệu với tên danh mục
      res.receiptDetail = res.receiptDetail
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
        .map((item) => ({
          ...item,
          categoryName:
            res2.find((book) => book.document.id === item.idDocument)
              ?.nameCategory || "Không có",
        }));

      // Tính toán và xử lý danh mục
      res.nameCategorys = res.receiptDetail
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
        .reduce((pre, cur) => {
          const existing = pre.find(
            (item) => item.nameCategory === cur.categoryName,
          );
          if (!existing) {
            pre.push({
              nameCategory: cur.categoryName,
              quantity: res.receiptDetail
                .filter((i) => i.categoryName === cur.categoryName)
                .reduce((p, c) => p + c.quantity, 0),
              totalPrice: res.receiptDetail
                .filter((i) => i.categoryName === cur.categoryName)
                .reduce((p, c) => p + c.price * c.quantity, 0)
                .toLocaleString("vi-VN", { currency: "VND" }),
            });
          }
          return pre;
        }, []);

      // Tiếp tục xử lý sau khi books được Cập nhật
      res.ManagingUnit = ManagingUnit;
      res.listParticipants = res.participants.map((item, index) => ({
        index: index + 1,
        name: item.name || "",
        position: item.position || "",
        mission: item.mission || "",
        note: item.note || "",
      }));

      // Gọi hàm generateDocument sau khi tất cả đã được Cập nhật
      generateDocument(res, type);
    } catch (err) {
      openNotificationWithIcon("error", "Lỗi", err.message);
    } finally {
      setBtnLoading(false);
    }
  };

  const columns = [
    {
      title: "Số phiếu nhập",
      dataIndex: "receiptCode",
      key: "receiptCode",
      fixed: "left",
      ...getColumnSearchProps("receiptCode"),
      filteredValue: filtersState?.filteredInfo?.receiptCode || null,
      sorter: true,
    },
    {
      title: "Bên nhận",
      dataIndex: "receiverName",
      key: "receiverName",
      ...getColumnSearchProps("receiverName"),
      filteredValue: filtersState?.filteredInfo?.receiverName || null,
    },
    {
      title: "Chức vụ bên nhận",
      dataIndex: "receiverPosition",
      key: "receiverPosition",
      ...getColumnSearchProps("receiverPosition"),
      filteredValue: filtersState?.filteredInfo?.receiverPosition || null,
    },
    {
      title: "Đại diện bên nhận",
      dataIndex: "receiverUnitRepresent",
      key: "receiverUnitRepresent",
      ...getColumnSearchProps("receiverUnitRepresent"),
      filteredValue: filtersState?.filteredInfo?.receiverUnitRepresent || null,
    },

    {
      title: "Bên giao",
      dataIndex: "deliverName",
      key: "deliverName",
      ...getColumnSearchProps("deliverName"),
      filteredValue: filtersState?.filteredInfo?.deliverName || null,
    },
    {
      title: "Chức vụ bên giao",
      dataIndex: "deliverPosition",
      key: "deliverPosition",
      ...getColumnSearchProps("deliverPosition"),
      filteredValue: filtersState?.filteredInfo?.deliverPosition || null,
    },
    {
      title: "Đại diện bên giao",
      dataIndex: "deliverUnitRepresent",
      key: "deliverUnitRepresent",
      ...getColumnSearchProps("deliverUnitRepresent"),
      filteredValue: filtersState?.filteredInfo?.deliverUnitRepresent || null,
    },
    {
      title: "Xem sách",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="dashed"
              loading={btnLoading}
              icon={<BookOutlined />}
              onClick={(e) => {
                setBooksRecord(record.receiptDetail);
                setVisibleListBooks(true);
              }}
            >
              Xem sách
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Ngày nhập",
      dataIndex: "importDate",
      key: "importDate",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.importDate,
        value: Receipt.importDate,
      })),
      ...getColumnSearchDateProps("importDate"),
      filteredValue: filtersState?.filteredInfo?.importDate || null,
      sorter: true,

      render: (text, record) => moment(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              loading={btnLoading}
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/admin/phieu-nhap/edit/${record.idReceipt}`)
              }
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handlePrint(record.idReceipt, 2)}
            >
              <Button
                type="primary"
                loading={btnLoading}
                icon={<PrinterOutlined />}
              >
                In phiếu nhập
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handlePrint(record.idReceipt, 1)}
            >
              <Button
                type="primary"
                loading={btnLoading}
                icon={<PrinterOutlined />}
              >
                In biên bản
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDelete(record.idReceipt)}
            >
              <Button
                type="danger"
                loading={btnLoading}
                icon={<DeleteOutlined />}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const { Title } = Typography;
  return (
    <div className="layout-content">
      <ListBooks
        setVisibleListBooks={setVisibleListBooks}
        visibleListBooks={visibleListBooks}
        BooksRecord={BooksRecord}
      />
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>Quản lý phiếu nhập sách</Title>
            <Table
              scroll={{ x: 400 }}
              rowKey={(record) => record.id}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={Receipt}
              onChange={handleTableChange}
              loading={loading}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
function ListBooks({ setVisibleListBooks, visibleListBooks, BooksRecord }) {
  return (
    <Drawer
      title="Danh sách nhập"
      width={520}
      placement="right"
      onClose={(e) => {
        setVisibleListBooks(false);
      }}
      visible={visibleListBooks}
      BooksRecord={BooksRecord}
    >
      <Typography.Title level={5}>
        Tổng số sách:{BooksRecord?.length}
      </Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={BooksRecord}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size={100} shape="square" alt="avatar book" />}
              title={
                <Link to={`/detail-page/${item?.idDocument}`} target="_blank">
                  {item?.documentName}
                </Link>
              }
              description={
                <Space size={"small"} direction={"vertical"}>
                  <span>Số Lượng: {item?.quantity}</span>
                  <span>
                    Đơn giá:{" "}
                    {item?.price.toLocaleString("vi-VN", {
                      currency: "VND",
                    })}
                  </span>
                  <span>
                    Thành tiền:{" "}
                    {item?.total.toLocaleString("vi-VN", {
                      currency: "VND",
                    })}
                  </span>
                  <span>Nhà xuất bản: {item?.namePublisher}</span>
                  <span>Chú thích: {item?.namePublisher}</span>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export const ManageBookEntryTicket = WithErrorBoundaryCustom(
  _ManageBookEntryTicket,
);
