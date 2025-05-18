import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { documentStock } from "../../../api/documentStock";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tooltip,
  Tree,
  Typography,
} from "antd";

export const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }

    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }

    return node;
  });

function _SymbolPriceRating() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [DocumentStock, setDocumentStock] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [filtersState, setFiltersState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    pagination: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    showTotal: (total) => `Tổng số: ${total} bản ghi`,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  useEffect(() => {
    document.title = "Quản lý kho lưu trữ";
  }, []);

  useEffect(() => {
    documentStock
      .getAllStock(0, 0)
      .then((res) => {
        setDocumentStock(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách kho lưu trữ thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [postLength]);

  const handleChange = (pagination, filters, sorter) => {
    console.log(pagination);
    const combinedFilters = { ...filters };

    setFilteredInfo(combinedFilters);
    setSortedInfo(sorter);
    setPagination(pagination);
    const filtersState = {
      filteredInfo: combinedFilters,
      sortedInfo: sorter,
      pagination: pagination,
    };
    setFiltersState(filtersState);
    // Lưu trạng thái vào localStorage
    localStorage.setItem(
      "filtersKhoLuuTru",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersKhoLuuTru"));
    console.log("savedFilters", savedFilters);

    setFiltersState(savedFilters);

    if (savedFilters?.filteredInfo) {
      setFilteredInfo(savedFilters.filteredInfo);
    }

    if (savedFilters?.sortedInfo) {
      setSortedInfo(savedFilters.sortedInfo);
    }

    if (savedFilters?.pagination) {
      setPagination(savedFilters.pagination);
    }
  }, []);

  const handleDelete = (id) => {
    setBtnLoading(true);
    documentStock
      .delete(id)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xóa kho lưu trữ thành công",
          res.message,
        );
        setBtnLoading(false);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa kho lưu trữ thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
        setPostLength(postLength + 1);
      });
  };

  const columns = [
    {
      fixed: "left",
      title: "Tên kho",
      dataIndex: "stockName",
      key: "stockName",
      filters: DocumentStock.map((DocumentStock) => ({
        text: DocumentStock.stockName,
        value: DocumentStock.stockName,
      })),
      filteredValue: filtersState?.filteredInfo?.stockName || null,
      sorter: (a, b) => a.stockName.length - b.stockName.length,
      sortOrder: sortedInfo.columnKey === "stockName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.stockName.startsWith(value),
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <Tooltip title="xem kho con">
            <PlusCircleOutlined
              style={{ fontSize: 19, cursor: "pointer" }}
              onClick={(e) => {
                navigate(`/admin/kho-luu-tru/children/${record.id}`, {
                  state: { stockName: [record.stockName] },
                });
              }}
            />
          </Tooltip>
          <Tooltip title={text}>
            <Typography.Text>{text}</Typography.Text>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Mã kho",
      dataIndex: "stockCode",
      key: "stockCode",
      filters: DocumentStock.map((DocumentStock) => ({
        text: DocumentStock.stockCode,
        value: DocumentStock.stockCode,
      })),
      filteredValue: filtersState?.filteredInfo?.stockCode || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.stockCode === value,
    },
    {
      title: "Kho cha",
      dataIndex: "stockParentId",
      key: "stockParentId",
      filters: DocumentStock.map((DocumentStock) => ({
        text: DocumentStock.stockParentId,
        value: DocumentStock.stockParentId,
      })),
      filteredValue: filtersState?.filteredInfo?.stockParentId || null,
      sorter: (a, b) => a.stockParentId.length - b.stockParentId.length,
      sortOrder:
        sortedInfo.columnKey === "stockParentId" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.stockParentId.startsWith(value),
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      filters: DocumentStock.map((DocumentStock) => ({
        text: DocumentStock.description,
        value: DocumentStock.description,
      })),
      filteredValue: filtersState?.filteredInfo?.description || null,
      sorter: (a, b) => a.description.length - b.description.length,
      sortOrder:
        sortedInfo.columnKey === "description" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.description.startsWith(value),
    },
    {
      title: "Số thứ tự",
      dataIndex: "ordinalNumber",
      key: "ordinalNumber",
    },
    {
      title: "Xem sách",
      render: (text, record) => (
        <Button
          type="default"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/admin/kho-luu-tru/books-in-stock/${record.id}`, {
              state: { stockName: [record.stockName] },
            });
          }}
        >
          Xem sách trong kho
        </Button>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="default"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/kho-luu-tru/newChild/${record.id}`);
              }}
            >
              Thêm mới kho con
            </Button>
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/kho-luu-tru/edit/${record.id}`);
              }}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDelete(record.id)}
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
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>Quản lý kho lưu trữ</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => setIsModalVisible(true)}>
                Xem sơ đồ tổng quan
              </Button>
              <Button onClick={(e) => navigate("/admin/kho-luu-tru/newAdd")}>
                Thêm mới kho lưu trữ
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={DocumentStock}
              onChange={handleChange}
              loading={loading}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
      <Diagram
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
}

function Diagram({ isModalVisible, setIsModalVisible }) {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentStock
      .getAllStock(0, 0)
      .then((res) => {
        setTreeData(
          res.map((item) => ({
            title: item.stockName,
            key: item.id,
          })),
        );
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Error document stock",
          err?.reponese?.data?.message,
        );
      });
  }, []);

  const onLoadData = ({ key, children }) =>
    documentStock.getAllDocumentStocksByParentId(key).then((res) => {
      setTreeData(
        updateTreeData(
          treeData,
          key,
          res.map((item) => ({
            title: item.stockName,
            key: item.id,
          })),
        ),
      );
    });
  return (
    <Modal
      title="Sơ đồ kho"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={3}>Quản lý kho lưu trữ</Typography.Title>
              <Tree treeData={treeData} loadData={onLoadData} />
            </Card>
          </Spin>
        </Col>
      </Row>
    </Modal>
  );
}

export const SymbolPriceRating = WithErrorBoundaryCustom(_SymbolPriceRating);
