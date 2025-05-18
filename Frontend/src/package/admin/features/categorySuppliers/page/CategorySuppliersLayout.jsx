import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { categorySuppliers } from "../../../api/categorySuppliers";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";

function _CategorySuppliersLayout() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [CategorySuppliers, setCategorySuppliers] = useState([]);
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
    document.title = "Danh mục nhà cung cấp";
  }, []);

  useEffect(() => {
    categorySuppliers
      .getAll()
      .then((res) => {
        setCategorySuppliers(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy nhà cung cấp thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
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
      "filtersNhaCungCap",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersNhaCungCap"));
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
    categorySuppliers
      .delete(id)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "xóa nhà cung cấp thành công",
          res.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "xóa nhà cung cấp thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const columns = [
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      filters: CategorySuppliers.map((CategorySuppliers) => ({
        text: CategorySuppliers.supplierName,
        value: CategorySuppliers.supplierName,
      })),
      fixed: "left",

      filteredValue: filtersState?.filteredInfo?.supplierName || null,
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
      sortOrder:
        sortedInfo.columnKey === "supplierName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.supplierName?.startsWith(value),
    },

    {
      title: "Mã nhà cung cấp",
      dataIndex: "supplierCode",
      key: "supplierCode",
      filters: CategorySuppliers.map((CategorySuppliers) => ({
        text: CategorySuppliers.supplierCode,
        value: CategorySuppliers.supplierCode,
      })),
      filteredValue: filtersState?.filteredInfo?.supplierCode || null,
      sorter: (a, b) => a.supplierCode.length - b.supplierCode.length,
      sortOrder:
        sortedInfo.columnKey === "supplierCode" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.supplierCode?.startsWith(value),
    },
    {
      title: "Mã số thuế",
      dataIndex: "taxCode",
      key: "taxCode",
      filters: CategorySuppliers.map((CategorySuppliers) => ({
        text: CategorySuppliers.taxCode,
        value: CategorySuppliers.taxCode,
      })),
      filteredValue: filtersState?.filteredInfo?.taxCode || null,
      sorter: (a, b) => a.taxCode.length - b.taxCode.length,
      sortOrder: sortedInfo.columnKey === "taxCode" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.taxCode?.startsWith(value),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      filters: CategorySuppliers.map((CategorySuppliers) => ({
        text: CategorySuppliers.address,
        value: CategorySuppliers.address,
      })),
      filteredValue: filtersState?.filteredInfo?.address || null,
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.address?.startsWith(value),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      filters: CategorySuppliers.map((CategorySuppliers) => ({
        text: CategorySuppliers.note,
        value: CategorySuppliers.note,
      })),
      filteredValue: filtersState?.filteredInfo?.note || null,
      sorter: (a, b) => a.note.length - b.note.length,
      sortOrder: sortedInfo.columnKey === "note" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.note?.startsWith(value),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: CategorySuppliers.map((CategorySuppliers) => ({
        text: CategorySuppliers.createdDate,
        value: CategorySuppliers.createdDate,
      })),
      filteredValue: filtersState?.filteredInfo?.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createdDate?.startsWith(value),
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/nha-cung-cap/edit/${record.id}`);
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
            <Title level={5}>Quản lý danh mục nhà cung cấp</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => navigate("/admin/nha-cung-cap/new")}>
                Thêm mới danh mục nhà cung cấp
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={CategorySuppliers}
              onChange={handleChange}
              loading={loading}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const CategorySuppliersLayout = WithErrorBoundaryCustom(
  _CategorySuppliersLayout,
);
