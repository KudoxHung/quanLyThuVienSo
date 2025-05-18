import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { receipt } from "../../../api/receipt";
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

function _ManageVoucherExport() {
  const navigate = useNavigate();
  const [Receipt, setReceipt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [visibleListBooks, setVisibleListBooks] = useState(false);
  const [BooksRecord, setBooksRecord] = useState([]);
  const [Books, setBooks] = useState([]);
  const [ManagingUnit, setManagingUnit] = useState("");
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;
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
      .GetListReceiptExportManyParam(getRandomuserParams(params))
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
      "filtersPhieuXuat",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: newPagination,
      }),
    );

    console.log("Updated filters:", combinedFilters);
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersPhieuXuat"));
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
    const fecthData = async () => {
      Promise.all([
        // books
        //   .getAll(0, 0, 1)
        //   .then((res) => {
        //     setBooks(res);
        //   })
        //   .catch((err) => {
        //     openNotificationWithIcon(
        //       "error",
        //       "Lấy danh sách sách thất bại",
        //       err?.response?.data?.message || err?.message
        //     );
        //   }),
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
      ]);
    };
    fecthData();
  }, []);

  const handleDelete = (id) => {
    console.log("kt", id);
    setBtnLoading(true);
    receipt
      .delete(id)
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res.message);
        setBtnLoading(false);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        console.log(err.response); // Kiểm tra lỗi đầy đủ
        openNotificationWithIcon(
          "error",
          "Lỗi",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const handlePrint = (id, type) => {
    setBtnLoading(true);
    receipt
      .exportBooksToWord(id, type)
      .then((res) => {
        if (
          res.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          openNotificationWithIcon("success", "Thành công", "Xuất thành công");
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          if (type === 1) {
            link.setAttribute("download", "Phiếu xuất.docx");
          } else {
            link.setAttribute("download", "Biên bản xuất.docx");
          }
          document.body.appendChild(link);
          link.click();
        } else {
          if (!res.success) {
            openNotificationWithIcon(
              "warning",
              "Thông báo lỗi",
              "Vui lòng xác nhận xuất sách trước khi in",
            );
          }
        }
        setBtnLoading(false);
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        openNotificationWithIcon("warning", "Thông báo lỗi", "Không thể xuất");
      });
  };

  const handleConfirmExportBooks = (id) => {
    setBtnLoading(true);
    receipt
      .ConfirmExportBooks(id)
      .then((res) => {
        if (res.success) {
          openNotificationWithIcon("success", "Thành công", res.message);
        } else {
          openNotificationWithIcon("warning", "Thông báo", res.message);
        }
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Lỗi", err.message);
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: "Số phiếu xuất",
      dataIndex: "receiptCode",
      key: "receiptCode",
      fixed: "left",
      ...getColumnSearchProps("receiptCode"),
      filteredValue: filtersState?.filteredInfo?.receiptCode || null,
      sorter: true,
    },
    {
      title: "Bên xuất",
      dataIndex: "receiverName",
      key: "receiverName",
      ...getColumnSearchProps("receiverName"),
      filteredValue: filtersState?.filteredInfo?.receiverName || null,
    },
    {
      title: "Chức vụ bên xuất",
      dataIndex: "receiverPosition",
      key: "receiverPosition",
      ...getColumnSearchProps("receiverPosition"),
      filteredValue: filtersState?.filteredInfo?.receiverPosition || null,
    },
    {
      title: "Đại diện bên xuất",
      dataIndex: "receiverUnitRepresent",
      key: "receiverUnitRepresent",
      ...getColumnSearchProps("receiverUnitRepresent"),
      filteredValue: filtersState?.filteredInfo?.receiverUnitRepresent || null,
    },

    {
      title: "Bên nhận",
      dataIndex: "deliverName",
      key: "deliverName",
      ...getColumnSearchProps("deliverName"),
      filteredValue: filtersState?.filteredInfo?.deliverName || null,
    },
    {
      title: "Chức vụ bên nhận",
      dataIndex: "deliverPosition",
      key: "deliverPosition",
      ...getColumnSearchProps("deliverPosition"),
      filteredValue: filtersState?.filteredInfo?.deliverPosition || null,
    },
    {
      title: "Đại diện bên nhận",
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
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: Receipt.map((Receipt) => ({
        text: Receipt.createdDate,
        value: Receipt.createdDate,
      })),
      ...getColumnSearchDateProps("createdDate"),
      filteredValue: filtersState?.filteredInfo?.createdDate || null,
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
                navigate(`/admin/phieu-xuat/edit/${record.idReceipt}`)
              }
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleConfirmExportBooks(record.idReceipt)}
            >
              <Button
                type="primary"
                style={{
                  backgroundColor: "purple",
                  borderColor: "purple",
                  color: "white",
                }}
                loading={btnLoading}
                icon={<PrinterOutlined />}
              >
                Xác nhận xuất sách
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
                In phiếu xuất
              </Button>
            </Popconfirm>
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
            <Title level={5}>Quản lý phiếu xuất sách</Title>
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
        Tổng số sách: {BooksRecord?.length}
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

export const ManageBookEntryTicket =
  WithErrorBoundaryCustom(_ManageVoucherExport);
