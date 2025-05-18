import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { getCookie, openNotificationWithIcon } from "../../../../client/utils";
import { categorySign } from "../../../api/categorySign";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import moment from "moment";

function _CategorySignLayout() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [CategorySign, setCategorySign] = useState([]);
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
    document.title = "Danh mục mã cá biệt";
  }, []);

  useEffect(() => {
    categorySign
      .getAll()
      .then((res) => {
        setCategorySign(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách mã cá biệt thất bại",
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
      "filtersMaCaBiet",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersMaCaBiet"));
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
    categorySign
      .delete(id)
      .then((res) => {
        openNotificationWithIcon("success", "Xóa thành công", res?.message);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa thành công",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handleHided = (id) => {
    setBtnLoading(true);
    categorySign
      .hided(id, true)
      .then((res) => {
        openNotificationWithIcon("success", "Ẩn thành công", res.message);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Ẩn thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handleShow = (id) => {
    setBtnLoading(true);
    categorySign
      .hided(id, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hiển thị thành công",
          res?.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Hiển thị thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  const props = {
    name: "file",
    action: `${apiUrl}/api/CategorySign/InsertCategorySignByExcel`,
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === "done") {
        message.success(
          `${info.file.name} Lấy biểu mẫu excel danh sách mã cá biệt thành công`,
        );
        setPostLength(postLength + 1);
      } else if (info.file.status === "error") {
        message.error(
          `${info.file.name} Lấy biểu mẫu excel danh sách mã cá biệt không thành công.`,
        );
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const columns = [
    {
      title: "Tên mã cá biệt",
      dataIndex: "signName",
      key: "signName",
      filters: CategorySign.map((CategorySign) => ({
        text: CategorySign.signName,
        value: CategorySign.signName,
      })),
      fixed: "left",

      filteredValue: filteredInfo.signName || null,
      sorter: (a, b) => a.signName.length - b.signName.length,
      sortOrder: sortedInfo.columnKey === "signName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.signName?.startsWith(value),
    },

    {
      title: "Mã cá biệt",
      dataIndex: "signCode",
      key: "signCode",
      filters: CategorySign.map((CategorySign) => ({
        text: CategorySign.signCode,
        value: CategorySign.signCode,
      })),
      filteredValue: filteredInfo.signCode || null,
      sorter: (a, b) => a.signCode.length - b.signCode.length,
      sortOrder: sortedInfo.columnKey === "signCode" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.signCode?.startsWith(value),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: CategorySign.map((CategorySign) => ({
        text: moment(CategorySign.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: CategorySign.createdDate,
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
      title: "Tình trạng",
      dataIndex: "isHided",
      key: "isHided",
      filters: CategorySign.map((CategorySign) => ({
        text: CategorySign.isHided ? "Ẩn" : "Hiển thị",
        value: CategorySign.isHided,
      })),
      filteredValue: filteredInfo.isHided || null,
      sorter: (a, b) => a.isHided.length - b.isHided.length,
      sortOrder: sortedInfo.columnKey === "isHided" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.isHided?.startsWith(value),
      render: (_, record) =>
        record.isHided ? (
          <Tag color={"red"}>Ẩn</Tag>
        ) : (
          <Tag color={"success"}>Hiển thị</Tag>
        ),
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              loading={btnLoading}
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/ma-ca-biet/edit/${record.id}`);
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
            {record?.isHided ? (
              <Button
                type="default"
                loading={btnLoading}
                onClick={(e) => handleShow(record.id)}
                icon={<EyeOutlined />}
              >
                Hiển thị
              </Button>
            ) : (
              <Button
                type="default"
                loading={btnLoading}
                onClick={(e) => handleHided(record.id)}
                icon={<EyeInvisibleOutlined />}
              >
                Ẩn
              </Button>
            )}
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
            <Title level={5}>Quản lý danh mục mã cá biệt</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button
                onClick={(e) => navigate("/admin/ma-ca-biet/new")}
                loading={btnLoading}
              >
                Thêm mới danh mục mã cá biệt
              </Button>
              <Upload {...props}>
                <Button
                  style={{ color: "green", borderColor: "green" }}
                  icon={[
                    <svg
                      t="1661919181496"
                      className="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="8531"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                        fill="green"
                        p-id="8532"
                      ></path>
                    </svg>,
                  ]}
                  loading={btnLoading}
                >
                  Lấy biểu mẫu excel
                </Button>
              </Upload>

              <Button
                loading={btnLoading}
                onClick={(e) =>
                  categorySign
                    .GetFileExcelCategorySign()
                    .then((res) => {
                      openNotificationWithIcon(
                        "success",
                        "Tải biểu mẫu excel danh sách mã cá biệt thành công",
                        res?.message,
                      );
                      const url = window.URL.createObjectURL(new Blob([res]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", "Mau_ImportMaCaBiet.xlsx");
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch((err) => {
                      openNotificationWithIcon(
                        "error",
                        "Lỗi",
                        err?.response?.data?.message || err?.message,
                      );
                    })
                }
                style={{ color: "green", borderColor: "green" }}
                icon={[
                  <svg
                    t="1661919181496"
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="8531"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                      fill="green"
                      p-id="8532"
                    ></path>
                  </svg>,
                ]}
              >
                Tải biểu mẫu excel
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={CategorySign}
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

export const CategorySignLayout = WithErrorBoundaryCustom(_CategorySignLayout);
