import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { books } from "../../../../client/api/books";
import { openNotificationWithIcon } from "../../../../client/utils";
import { receipt } from "../../../api/receipt";
import { generateDocument } from "../../ImportBooks";
import {
  BookOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  List,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import moment from "moment";

function _ManageMagazineEntryTicket() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [Receipt, setReceipt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [visibleListBooks, setVisibleListBooks] = useState(false);
  const [BooksRecord, setBooksRecord] = useState([]);
  const [Books, setBooks] = useState([]);

  useEffect(() => {
    document.title = "Quản lý phiếu nhập báo tạp chí";
  }, []);

  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        receipt
          .getAll()
          .then((res) => {
            setReceipt(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lỗi", err.message);
          }),
        books
          .getNewBooks(0, 0)
          .then((res) => {
            setBooks(res);
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
  }, [postLength]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleDelete = (id) => {
    setBtnLoading(true);
    receipt
      .delete(id)
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res.message);
        setBtnLoading(false);
        setPostLength(postLength - 1);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Lỗi", err.message);
        setBtnLoading(false);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handlePrint = (id) => {
    setBtnLoading(true);
    receipt
      .getById(id)
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

        res.ManagingUnit = " ";
        generateDocument(res);
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Lỗi", err.message);
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: "Số phiếu nhập",
      dataIndex: "receiptCode",
      key: "receiptCode",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.receiptCode,
        value: Receipt.idReceipt,
      })),
      fixed: "left",

      filteredValue: filteredInfo.receiptCode || null,
      sorter: (a, b) => a.receiptCode.length - b.receiptCode.length,
      sortOrder:
        sortedInfo.columnKey === "receiptCode" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.idReceipt.startsWith(value),
    },
    {
      title: "Bên nhận",
      dataIndex: "receiverName",
      key: "receiverName",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.receiverName,
        value: Receipt.idReceipt,
      })),

      filteredValue: filteredInfo.receiverName || null,
      sorter: (a, b) => a.receiverName.length - b.receiverName.length,
      sortOrder:
        sortedInfo.columnKey === "receiverName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.receiverName.startsWith(value),
    },
    {
      title: "Chức vụ bên nhận",
      dataIndex: "receiverPosition",
      key: "receiverPosition",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.receiverPosition,
        value: Receipt.idReceipt,
      })),

      filteredValue: filteredInfo.receiverPosition || null,
      sorter: (a, b) => a.receiverPosition.length - b.receiverPosition.length,
      sortOrder:
        sortedInfo.columnKey === "receiverPosition" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.receiverPosition.startsWith(value),
    },
    {
      title: "Đại diện bên nhận",
      dataIndex: "receiverUnitRepresent",
      key: "receiverUnitRepresent",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.receiverUnitRepresent,
        value: Receipt.idReceipt,
      })),

      filteredValue: filteredInfo.receiverUnitRepresent || null,
      sorter: (a, b) =>
        a.receiverUnitRepresent.length - b.receiverUnitRepresent.length,
      sortOrder:
        sortedInfo.columnKey === "receiverUnitRepresent"
          ? sortedInfo.order
          : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.receiverUnitRepresent.startsWith(value),
    },

    {
      title: "Bên giao",
      dataIndex: "deliverName",
      key: "deliverName",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.deliverName,
        value: Receipt.idReceipt,
      })),

      filteredValue: filteredInfo.deliverName || null,
      sorter: (a, b) => a.deliverName.length - b.deliverName.length,
      sortOrder:
        sortedInfo.columnKey === "deliverName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.deliverName.startsWith(value),
    },
    {
      title: "Chức vụ bên giao",
      dataIndex: "deliverPosition",
      key: "deliverPosition",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.deliverPosition,
        value: Receipt.idReceipt,
      })),

      filteredValue: filteredInfo.deliverPosition || null,
      sorter: (a, b) => a.deliverPosition.length - b.deliverPosition.length,
      sortOrder:
        sortedInfo.columnKey === "deliverPosition" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.deliverPosition.startsWith(value),
    },
    {
      title: "Đại diện bên giao",
      dataIndex: "deliverUnitRepresent",
      key: "deliverUnitRepresent",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.deliverUnitRepresent,
        value: Receipt.idReceipt,
      })),

      filteredValue: filteredInfo.deliverUnitRepresent || null,
      sorter: (a, b) =>
        a.deliverUnitRepresent.length - b.deliverUnitRepresent.length,
      sortOrder:
        sortedInfo.columnKey === "deliverUnitRepresent"
          ? sortedInfo.order
          : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.deliverUnitRepresent.startsWith(value),
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
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.createdDate,
        value: Receipt.createdDate,
      })),
      filteredValue: filteredInfo.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createdDate.startsWith(value),

      render: (text, record) => moment(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handlePrint(record.idReceipt)}
            >
              <Button
                type="primary"
                loading={btnLoading}
                icon={<PrinterOutlined />}
              >
                In
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
            <Title level={5}>Quản lý phiếu nhập sách báo tạp chí</Title>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={Receipt}
              onChange={handleChange}
              loading={loading}
              pagination={{
                showTotal: (total) => `Tổng cộng ${total} phiếu`,
                defaultPageSize: 6,
              }}
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
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                  <span>
                    Thành tiền:{" "}
                    {item?.total.toLocaleString("vi-VN", {
                      style: "currency",
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
export const ManageMagazineEntryTicket = WithErrorBoundaryCustom(
  _ManageMagazineEntryTicket,
);
