import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { documentStock } from "../../../api/documentStock";
import { documentType } from "../../../api/documentType";
import { individualSample } from "../../../api/individualSample";
import { ModalConfirmDelete } from "../components/ModalConfirmDelete/ModalConfirmDelete";
import {
  DeleteOutlined,
  EditOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ProFormMoney } from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _SpecialRegistrationChildBooksLayout() {
  const navigate = useNavigate();
  const param = useParams();
  const [loading, setLoading] = useState(true);
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
  const [openModalConfirmDelete, setModalOpenConfirmDelete] = useState(false);
  const [dataModalConfirmDelete, setDataModalConfirmDelete] = useState({});

  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);

  useEffect(() => {
    document.title = "Đăng ký cá biệt từng bộ sách";
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
      .GetBookAndIndividualManyParam(param.id, getRandomuserParams(params))
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
    onChange: (newSelectedRowKeys, selectedRows, info) => {
      // Khi thay đổi lựa chọn, chúng ta sẽ lấy các keys đã được chọn mới
      const selectedKeys = newSelectedRowKeys;

      // Cập nhật lại selectedRowKeys
      setSelectedRowKeys(selectedKeys);

      // Cập nhật danh sách documentTypeId đã chọn
      setListDocumentTypeIdSelected(
        selectedRows.map((item) => item.documentTypeId),
      );
    },
  };

  useEffect(() => {
    fetchData({
      pagination,
    });
  }, [postLength]);

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        individualSample
          .GetIndividualByDateNotRepeat(param.id)
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
          .GetIndividualStockNotRepeat(param.id)
          .then((res) => {
            setIndividualStockNotRepeat([...res.stocks]);
          })
          .catch((err) => {
            console.error("err IndividualStockNotRepeat", err);
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
    fetchData();
  }, [postLength, param.id]);

  const handleDeleteMany = async () => {
    setBtnLoading(true);
    try {
      const res =
        await individualSample.DeleteIndividualSampleByList(selectedRowKeys);
      if (res.message === "Xóa thành công !") {
        openNotificationWithIcon("success", "Xóa thành công", res.message);
        setPostLength(postLength + 1);
        setSelectedRowKeys([]);
        setModalOpenConfirmDelete(false);
      }
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Xóa thất bại",
        error?.response?.data?.message || error?.message,
      );
    } finally {
      setBtnLoading(false);
    }
  };
  const checkAfterDeleteMany = async () => {
    setBtnLoading(true);
    try {
      const res =
        await individualSample.CheckIdIndividualExitsInDocumentInvoice(
          selectedRowKeys,
        );
      if (res.success) {
        setModalOpenConfirmDelete(true);
        setDataModalConfirmDelete({
          message: res.message,
          numIndividualExist: res.numIndividualExist,
        });
      } else await handleDeleteMany();
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Đã xảy ra lỗi thực thi",
        error?.response?.data?.message || error?.message,
      );
    } finally {
      setBtnLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "docName",
      key: "docName",
      fixed: "left",
      render: (_, record) => (
        <Tooltip title={Document.docName}>
          <Typography.Text>
            {Document.docName?.length > 22
              ? `${Document.docName?.slice(0, 22)}...`
              : Document.docName}
          </Typography.Text>
        </Tooltip>
      ),
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      //filteredValue: filteredInfo. || null,
      render: (_, record) => record.price,
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
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              disabled={record.isLostedPhysicalVersion}
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/admin/dang-ky-ca-biet-tung-bo-sach/children/edit/${record.id}`,
                  {
                    state: {
                      docName: Document?.docName,
                      idDocName: Document?.id,
                    },
                  },
                );
              }}
              icon={<EditOutlined />}
            >
              Sửa
            </Button>
            {/* <Button
              disabled={record.isLostedPhysicalVersion}
              type='dashed'
              loading={btnLoading}
              icon={<PrinterOutlined />}
              onClick={(e) => {
                window.open(
                  `/Print/PrintSpine/${record.id}&00000000-0000-0000-0000-000000000000&null`
                );
              }}
            >
              In gáy sách
            </Button> */}
          </Space>
        );
      },
    },
  ];

  const { Title } = Typography;
  return (
    <div className="layout-content">
      <ModalConfirmDelete
        visible={openModalConfirmDelete}
        setVisible={setModalOpenConfirmDelete}
      >
        <Typography.Title level={4}>
          Thông báo:{" "}
          <Typography.Text type={"danger"}>
            {dataModalConfirmDelete?.message}
          </Typography.Text>
        </Typography.Title>
        <Typography.Title level={5}>Danh sách dưới đây: </Typography.Title>
        <Space direction={"vertical"} style={{ width: "100%" }}>
          {dataModalConfirmDelete?.numIndividualExist
            ?.split("/")
            ?.map((item, index) => (
              <Typography.Text type={"danger"} key={index}>
                {" "}
                {index + 1}. {item}
              </Typography.Text>
            ))}
        </Space>
        <Space
          direction={"horizontal"}
          style={{ justifyContent: "end", marginTop: 30, width: "100%" }}
        >
          <Button
            type={"primary"}
            onClick={() => setModalOpenConfirmDelete(false)}
          >
            Hủy
          </Button>
          <Button
            type={"danger"}
            onClick={() => {
              handleDeleteMany();
            }}
          >
            Vẫn xóa
          </Button>
        </Space>
      </ModalConfirmDelete>
      <Modal
        title="Chọn loại sách muốn in"
        visible={ModalSelectTypeSpineBook}
        onCancel={() => setModalSelectTypeSpineBook(false)}
        onOk={async () => {
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
          if (typeSpineBook === "104" && check) {
            openNotificationWithIcon(
              "warning",
              "Mẫu này chỉ in những sách thiếu nhi",
              "Mời bạn chọn lại!",
            );
            return;
          }
          return navigate(`/Print/PrintSpine/${param.id}&${typeSpineBook}`, {
            state: { ListIdIndividual: selectedRowKeys },
          });
        }}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="In theo định dạng"
          onChange={(e) => setTypeSpineBook(e)}
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
            <Title level={5}>Danh mục mã cá biệt</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button
                onClick={(e) =>
                  navigate(
                    `/admin/dang-ky-ca-biet-tung-bo-sach/children/new/${param.id}`,
                    {
                      state: {
                        docName: Document?.docName,
                        documentTypeId: Document?.documentTypeId,
                      },
                    },
                  )
                }
              >
                Tạo mã cá biệt
              </Button>
              <Tooltip title="Vui lòng không in hơn 50 gáy /1 lần">
                <Button
                  icon={<PrinterOutlined />}
                  onClick={(e) => {
                    setModalSelectTypeSpineBook(true);
                  }}
                  disabled={
                    selectedRowKeys.length === 0 || selectedRowKeys.length > 50
                  }
                >
                  In nhiều bộ gáy sách ({selectedRowKeys.length})
                </Button>
              </Tooltip>
              <Popconfirm
                title={"Bạn chắc chắn ?"}
                onConfirm={() => checkAfterDeleteMany()}
              >
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  disabled={selectedRowKeys.length === 0}
                  loading={btnLoading}
                >
                  Xóa nhiều bộ sách ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
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

export const SpecialRegistrationChildBooksLayout = WithErrorBoundaryCustom(
  _SpecialRegistrationChildBooksLayout,
);
