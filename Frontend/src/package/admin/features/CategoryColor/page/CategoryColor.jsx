import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { categoryColor } from "../../../api/categoryColor";
import { categoryUnits } from "../../../api/categoryUnits";
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
import moment from "moment";

function _CategoryColor() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  // const [CategoryUnits, setCategoryUnits] = useState([]);
  const [CategoryColor, setCategoryColor] = useState([]);
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
    document.title = "Danh mục mã màu";
  }, []);

  useEffect(() => {
    categoryColor
      .getAll(1, 100)
      .then((res) => {
        setCategoryColor(res.listPayload);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Không lấy được thông tin mã màu",
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
      "filtersDanhMucMaMau",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(
      localStorage.getItem("filtersDanhMucMaMau"),
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

  const handleDelete = (idx) => {
    setBtnLoading(true);
    categoryColor
      .delete({ id: idx })
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
      title: "Tên màu",
      dataIndex: "colorName",
      key: "colorName",
      fixed: "left",
      filteredValue: filteredInfo.unitName || null,
      sorter: (a, b) => a.unitName.length - b.unitName.length,
      sortOrder: sortedInfo.columnKey === "unitName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.unitName?.startsWith(value),
    },
    {
      title: "Trình độ đọc",
      dataIndex: "readingLevel",
      key: "readingLevel",
      filteredValue: filteredInfo.readingLevel || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.id === value;
      },
    },
    {
      title: "Mã màu",
      dataIndex: "colorCode",
      key: "colorCode",
    },
    {
      title: "Màu hiển thị",
      dataIndex: "colorCode",
      key: "colorCode",
      render: (text, record) => (
        <Space size="middle">
          <div
            style={{
              backgroundColor: `${text}`,
              width: "30px",
              height: "30px",
            }}
          ></div>
        </Space>
      ),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filteredValue: filteredInfo.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createdDate?.startsWith(value),
      render: (createdDate, record) =>
        moment(createdDate).format("DD/MM/YYYY HH:mm:ss"),
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
                navigate(`/admin/danh-muc-ma-mau/edit/${record.id}`);
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
            <Title level={5}>Quản lý danh mục mã màu</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => navigate("/admin/danh-muc-ma-mau/new")}>
                Thêm mới
              </Button>
            </Space>
            <Table
              scroll={{ x: 1300 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? {
                      ...col,
                      ellipsis: true,
                      width: 200,
                    }
                  : col,
              )}
              dataSource={CategoryColor}
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

export const CategoryColor = WithErrorBoundaryCustom(_CategoryColor);
