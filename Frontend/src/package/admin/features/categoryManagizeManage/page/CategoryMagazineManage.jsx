import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { documentType } from "../../../api/documentType";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _CategoryMagazineManage() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [CategoryBooks, setCategoryBooks] = useState([]);
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
    document.title = "Quản lý danh mục báo tạp chí";
  }, []);

  useEffect(() => {
    documentType
      .getAllNotPage(2)
      .then((res) => {
        setCategoryBooks(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách thất bại",
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
      "filtersDanhMucMucBaoTapChi",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(
      localStorage.getItem("filtersDanhMucMucBaoTapChi"),
    );
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
    documentType
      .delete(id)
      .then((res) => {
        openNotificationWithIcon("success", "Xóa thành công", res.message);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa thất bại",
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
      render: (text, record) => {
        return (
          <Tooltip title="Xem báo tạp chí">
            <PlusCircleOutlined
              style={{ fontSize: 19, cursor: "pointer" }}
              onClick={(e) => {
                navigate(`/admin/danh-muc-bao-tap-chi/children/${record.id}`, {
                  state: {
                    categoryName: record.docTypeName,
                  },
                });
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "docTypeName",
      key: "docTypeName",
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
      ),
      filters: CategoryBooks.map((CategoryBooks) => ({
        text: CategoryBooks.docTypeName,
        value: CategoryBooks.docTypeName,
      })),
      fixed: "left",

      filteredValue: filteredInfo.docTypeName || null,
      sorter: (a, b) => a.docTypeName.length - b.docTypeName.length,
      sortOrder:
        sortedInfo.columnKey === "docTypeName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.docTypeName?.startsWith(value),
    },

    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      filters: CategoryBooks.map((CategoryBooks) => ({
        text: CategoryBooks.description,
        value: CategoryBooks.description,
      })),
      filteredValue: filteredInfo.description || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.description?.startsWith(value);
      },
      render: (_, record) => (
        <Tooltip title={record.description}>
          <Typography.Text>
            {record.description?.length > 22
              ? `${record.description?.slice(0, 22)}...`
              : record.description}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: CategoryBooks.map((CategoryBooks) => ({
        text: moment(CategoryBooks.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: CategoryBooks.createdDate,
      })),
      filteredValue: filteredInfo.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createdDate?.startsWith(value),

      render: (text, record) =>
        moment(record.createdDate).format("DD/MM/YYYY HH:mm:ss"),
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
                navigate(`/admin/danh-muc-bao-tap-chi/edit/${record.id}`);
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
            <Title level={5}>Quản lý danh mục sách báo tạp chí</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button
                onClick={(e) => navigate("/admin/danh-muc-bao-tap-chi/new")}
              >
                Thêm mới danh mục
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác" ? { ...col, width: 200 } : col,
              )}
              dataSource={CategoryBooks}
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

export const CategoryMagazineManage = WithErrorBoundaryCustom(
  _CategoryMagazineManage,
);
