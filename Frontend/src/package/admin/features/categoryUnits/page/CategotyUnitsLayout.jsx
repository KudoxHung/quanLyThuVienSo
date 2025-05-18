import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
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

function _CategotyUnitsLayout() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [CategoryUnits, setCategoryUnits] = useState([]);
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
    document.title = "Danh mục đơn vị lớp học, phòng ban";
  }, []);

  useEffect(() => {
    categoryUnits
      .getAll()
      .then((res) => {
        setCategoryUnits(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy các đơn vị thất bại",
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
      "filtersDonVi",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersDonVi"));
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
    categoryUnits
      .delete(id)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xóa đơn vị thành công",
          res.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa đơn vị thất bại",
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
      title: "Tên đơn vị lớp học, phòng ban",
      dataIndex: "unitName",
      key: "unitName",
      filters: CategoryUnits.map((CategoryUnits) => ({
        text: CategoryUnits.unitName,
        value: CategoryUnits.unitName,
      })),
      fixed: "left",

      filteredValue: filteredInfo.unitName || null,
      sorter: (a, b) => a.unitName.length - b.unitName.length,
      sortOrder: sortedInfo.columnKey === "unitName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.unitName?.startsWith(value),
    },
    {
      title: "Mã đơn vị",
      dataIndex: "unitCode",
      key: "unitCode",
      filters: CategoryUnits.map((Units) => ({
        text: Units.unitCode,
        value: Units.id,
      })),
      filteredValue: filteredInfo.unitCode || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.id === value;
      },
    },
    {
      title: "Đơn vị cha",
      dataIndex: "parentId",
      key: "parentId",
      filters: CategoryUnits.map((Units) => ({
        text: CategoryUnits.find((item) => item.id === Units.parentId)
          ?.unitName,
        value: Units.parentId,
      })),
      filteredValue: filteredInfo.parentId || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        record.parentId?.startsWith(value);
      },
      render: (parentId) => {
        return CategoryUnits.find((item) => item.id === parentId)?.unitName;
      },
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: CategoryUnits.map((CategoryUnits) => ({
        text: moment(CategoryUnits.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: CategoryUnits.createdDate,
      })),
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
                navigate(`/admin/don-vi/edit/${record.id}`);
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
            <Title level={5}>Quản lý danh mục đơn vị lớp học, phòng ban</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => navigate("/admin/don-vi/new")}>
                Thêm mới danh mục đơn vị lớp học, phòng ban
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
              dataSource={CategoryUnits}
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

export const CategotyUnitsLayout =
  WithErrorBoundaryCustom(_CategotyUnitsLayout);
