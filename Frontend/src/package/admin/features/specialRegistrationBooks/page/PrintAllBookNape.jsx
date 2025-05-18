import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { document } from "../../../api/document";
import { documentStock } from "../../../api/documentStock";
import { documentType } from "../../../api/documentType";
import { individualSample } from "../../../api/individualSample";
import {
  CheckSquareOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _PrintAllBookNape() {
  const navigate = useNavigate();
  // const param = useParams();
  const [loading, setLoading] = useState(false);
  const [IndividualSample, setIndividualSample] = useState([]);
  const [IndividualByDateNotRepeat, setIndividualByDateNotRepeat] = useState(
    [],
  );
  const [typeSpineBook, setTypeSpineBook] = useState("");
  const [ModalSelectTypeSpineBook, setModalSelectTypeSpineBook] =
    useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [IndividualStockNotRepeat, setIndividualStockNotRepeat] = useState([]);
  const [DocumentStock, setDocumentStock] = useState([]);
  const [Document, setDocument] = useState({});
  const [listDocumentTypeIdSelected, setListDocumentTypeIdSelected] = useState(
    [],
  );

  const [DocumentBooks, setDocumentBooks] = useState([]);
  const [selectedItems, setSelectedItems] = useState(undefined);

  const [listBookSelected, setListBookSelected] = useState([]);
  const [listIdDocumentSelected, setListIdDocumentSelected] = useState([]);
  const [IdDocumentSelected, setIdDocumentSelected] = useState([]);

  // const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    document.title = "In gáy sách nhiều loại sách";
  }, []);

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
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
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
    individualSample
      .GetBookAndIndividualManyParam(selectedItems, getRandomuserParams(params))
      .then((res) => {
        if (res.individuals !== null) {
          setIndividualSample(res.individuals);
        } else {
          setIndividualSample([]);
        }
        setDocument(res.document);
        setPagination({
          ...params.pagination,
          total: res?.totalCount,
          showTotal: (total) => `Tổng số: ${total} bản ghi`,
        });
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => setLoading(false));
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setIdDocumentSelected(selectedRows.map((item) => item.idDocument));
      setListDocumentTypeIdSelected([
        ...listDocumentTypeIdSelected,
        ...selectedRows.map((item) => item.documentTypeId),
      ]);
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      if (!selected) {
        setListBookSelected(
          listBookSelected.filter((item) => item !== record.id),
        );
        setListIdDocumentSelected(
          listIdDocumentSelected.filter((item) => item !== record.idDocument),
        );
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (!selected) {
        const listIdIndividual = changeRows.map((item) => item.id);
        setListIdDocumentSelected(
          listIdDocumentSelected.filter(
            (item) => item !== changeRows[0]?.idDocument,
          ),
        );
        const a = listBookSelected.filter((x) => !listIdIndividual.includes(x));
        setListBookSelected(a);
      }
    },
  };
  useEffect(() => {
    if (selectedItems !== undefined) {
      fetchData({
        pagination,
      });
      setSelectedRowKeys(listBookSelected);
    }
  }, [selectedItems]);
  useEffect(() => {
    if (selectedItems !== undefined) {
      const fetchData = async () => {
        Promise.all([
          individualSample
            .GetIndividualByDateNotRepeat(selectedItems)
            .then((res) => {
              setIndividualByDateNotRepeat([...res]);
            })
            .catch((err) => {
              openNotificationWithIcon(
                "error",
                "Lấy dữ liệu thất bại",
                err?.response?.data?.message || err?.message,
              );
            }),
          individualSample
            .GetIndividualStockNotRepeat(selectedItems)
            .then((res) => {
              setIndividualStockNotRepeat([...res.stocks]);
            })
            .catch((err) => {
              console.error("err IndividualStockNotRepeat", err);
            }),
        ]);
      };
      fetchData();
    }
  }, [selectedItems]);
  useEffect(() => {
    const fecthData = async () => {
      await Promise.all([
        books
          .GetSpineBookByMultipleDocumentType(0, 0)
          .then((res) => {
            setDocumentBooks(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "Warning",
              "Lấy danh sách sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        documentStock
          .getAll()
          .then((res) => {
            setDocumentStock(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kho lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fecthData();
  }, []);
  useEffect(() => {
    if (selectedRowKeys) {
      setListBookSelected((prev) => [...prev, ...selectedRowKeys]);
      setListBookSelected((prev) => [...new Set(prev)]);

      setListIdDocumentSelected((prev) => [...prev, ...IdDocumentSelected]);

      setListIdDocumentSelected((prev) => [...new Set(prev)]);
    }
  }, [selectedRowKeys, IdDocumentSelected]);

  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "docName",
      key: "docName",
      fixed: "left",
      render: (_, record) => Document.docName,
    },
    {
      title: "Mã cá biệt",
      dataIndex: "numIndividual",
      key: "numIndividual",
      sorter: true,
      ...getColumnSearchProps("numIndividual"),
      render: (_, record) => record.numIndividual.split("/")[0],
    },
    {
      title: "Mã vạch",
      dataIndex: "barcode",
      key: "barcode",
      ...getColumnSearchProps("barcode"),
    },
    {
      title: "Tên kho",
      dataIndex: "stockId",
      key: "stockId",
      filters: IndividualStockNotRepeat.map((stock) => ({
        text: stock.individualName,
        value: stock.idStock,
      })),
      sorter: true,
      filterSearch: true,
      render: (stockId) => {
        return DocumentStock.find((stock) => stock.id === stockId)?.stockName;
      },
    },
    {
      title: "Tình trạng vật lý",
      dataIndex: "isLostedPhysicalVersion",
      key: "isLostedPhysicalVersion",
      filters: [
        {
          text: <Tag color="red">Mất phẩm</Tag>,
          value: true,
        },
        {
          text: <Tag color="green">Có phẩm</Tag>,
          value: false,
        },
      ],
      render: (isLostedPhysicalVersion) => {
        if (isLostedPhysicalVersion) {
          return <Tag color="red">Mất phẩm</Tag>;
        } else {
          return <Tag color="green">Có phẩm</Tag>;
        }
      },
    },
    {
      title: "Trạng thái mượn",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? (
          <Tag color="green">Đang còn</Tag>
        ) : status === 0 ? (
          <Tag color="yellow">Đang mượn</Tag>
        ) : status === 2 ? (
          <Tag color="orange">Trễ hạn đã trả</Tag>
        ) : status === 3 ? (
          <Tag color="red">Đã mất</Tag>
        ) : status === 4 ? (
          <Tag color="#d62c2c">Đã trả có sách mất</Tag>
        ) : (
          ""
        ),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: IndividualByDateNotRepeat.map((date) => ({
        text: moment(date).format("DD/MM/YYYY HH:mm:ss"),
        value: IndividualSample.date,
      })),
      sorter: true,
      filterSearch: true,
      render: (createdDate) => {
        return moment(createdDate).format("DD/MM/YYYY HH:mm:ss");
      },
    },
  ];

  const { Title } = Typography;
  return (
    <div className="layout-content">
      <Modal
        title="Chọn loại sách muốn in"
        visible={ModalSelectTypeSpineBook}
        onCancel={() => setModalSelectTypeSpineBook(false)}
        onOk={async () => {
          try {
            let check = false;
            console.log(listDocumentTypeIdSelected);
            for (const id of listDocumentTypeIdSelected) {
              if (check) break;
              const res = await documentType.getById(id);
              if (res.docTypeName.trim().toLowerCase() !== "sách thiếu nhi") {
                check = true;
                break;
              }
            }
            console.log(check);
            if (typeSpineBook === "104" && check) {
              openNotificationWithIcon(
                "warning",
                "Mẫu này chỉ in những sách thiếu nhi",
                "Mời bạn chọn lại!",
              );
              return;
            }

            return navigate(
              `/Print/PrintSpineAll/00000000-0000-0000-0000-000000000000&${typeSpineBook}`,
              {
                state: { ListIdIndividual: listBookSelected },
              },
            );
          } catch (error) {
            console.error("Error fetching document type:", error);
            openNotificationWithIcon(
              "error",
              "Lỗi",
              "Có lỗi xảy ra trong quá trình lấy thông tin loại tài liệu.",
            );
          }
        }}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="In theo định dạng"
          onChange={(e) => {
            setTypeSpineBook(e);
          }}
          value={typeSpineBook}
          options={[
            {
              label: <span>Gáy sách theo mã vạch</span>,
              title: "Gáy sách theo mã vạch",
              options: [
                { label: <span>Gách sách theo mã vạch 01</span>, value: "101" },
                { label: <span>Gách sách theo mã vạch 02</span>, value: "102" },
                { label: <span>Gách sách theo mã vạch 03</span>, value: "103" },
                { label: <span>Gáy mã màu sách thiếu nhi</span>, value: "104" },
              ],
            },
            {
              label: <span>Gáy sách theo ký kiệu nhan đề</span>,
              title: "Gáy sách theo ký kiệu nhan đề",
              options: [
                {
                  label: <span>Gáy sách theo ký kiệu nhan đề</span>,
                  value: "2",
                },
              ],
            },
          ]}
        />
      </Modal>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>In gáy sách nhiều loại sách</Title>
            <Space
              style={{
                marginBottom: 16,
                width: "100%",
              }}
              wrap
            >
              <Tooltip title="Vui lòng không in hơn 50 gáy /1 lần">
                <Button
                  icon={<PrinterOutlined />}
                  onClick={(e) => {
                    setModalSelectTypeSpineBook(true);
                  }}
                  disabled={
                    listBookSelected.length === 0 ||
                    listBookSelected.length > 50
                  }
                >
                  In nhiều bộ gáy sách ({listBookSelected.length})
                </Button>
              </Tooltip>
              <Select
                showSearch
                placeholder="Mẫu sách"
                value={selectedItems}
                onChange={(e) => {
                  setSelectedItems(e);
                  documentType.getDocumentById(e).then((res) => {
                    setDocumentId(res.documentTypeId);
                  });
                }}
                style={{
                  width: "500px",
                }}
                optionFilterProp="label"
              >
                {DocumentBooks?.map((item) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item.docName}
                  >
                    {listIdDocumentSelected.find((x) => x === item.id) ? (
                      <>
                        <CheckSquareOutlined
                          style={{
                            color: "#1890ff",
                            fontSize: "20px",
                          }}
                        />{" "}
                        {"-"}{" "}
                      </>
                    ) : (
                      ""
                    )}{" "}
                    <span className="demo-option-label-item">
                      {item.docName}
                    </span>
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Table
              scroll={{ x: 400 }}
              rowKey={(record) => record.id}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={IndividualSample}
              onChange={handleTableChange}
              loading={loading}
              pagination={pagination}
              rowSelection={rowSelection}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const PrintAllBookNape = WithErrorBoundaryCustom(_PrintAllBookNape);
