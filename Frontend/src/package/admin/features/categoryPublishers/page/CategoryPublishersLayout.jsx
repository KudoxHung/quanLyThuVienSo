import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { getCookie, openNotificationWithIcon } from "../../../../client/utils";
import { categoryPublishers } from "../../../api/categoryPublishers";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
  Upload,
} from "antd";
import moment from "moment";

function _CategoryPublishersLayout() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [CategoryPublishers, setCategoryPublishers] = useState([]);
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
    document.title = "Danh mục nhà xuất bản";
  }, []);

  useEffect(() => {
    categoryPublishers
      .getAll()
      .then((res) => {
        setCategoryPublishers(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "lấy các người dùng thất bại",
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
      "filtersNhaXuatBan",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersNhaXuatBan"));
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
    categoryPublishers
      .delete(id)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xóa nhà xuất bản thành công",
          res?.message,
        );
        setPostLength(postLength - 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "xóa nhà xuất bản thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  const props = {
    name: "file",
    action: `${apiUrl}/api/CategoryPublishers/InsertCategoryPublish`,
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === "done") {
        message.success(
          `Lấy biểu mẫu excel thêm danh sách nhà xuất bản thành công`,
        );
        setPostLength(postLength + 1);
      } else if (info.file.status === "error") {
        message.error(
          `Lấy biểu mẫu excel thêm danh sách nhà xuất bản thất bại`,
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
      title: "Tên nhà xuất bản",
      dataIndex: "publisherName",
      key: "publisherName",
      filters: CategoryPublishers.map((CategoryPublisher) => ({
        text: CategoryPublisher.publisherName,
        value: CategoryPublisher.publisherName,
      })),
      fixed: "left",
      filteredValue: filtersState?.filteredInfo?.publisherName || null,
      sorter: (a, b) => a.publisherName.length - b.publisherName.length,
      sortOrder:
        sortedInfo.columnKey === "publisherName" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.publisherName?.startsWith(value); // return true or false
      },
    },
    {
      title: "Mã nhà xuất bản",
      dataIndex: "publisherCode",
      key: "publisherCode",
      filters: CategoryPublishers.map((CategoryPublisher) => ({
        text: CategoryPublisher.publisherCode,
        value: CategoryPublisher.publisherCode,
      })),
      filteredValue: filtersState?.filteredInfo?.publisherCode || null,
      sorter: (a, b) => a.publisherCode.length - b.publisherCode.length,
      sortOrder:
        sortedInfo.columnKey === "publisherCode" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.publisherCode?.startsWith(value); // return true or false
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      filters: CategoryPublishers.map((CategoryPublisher) => ({
        text: CategoryPublisher.address,
        value: CategoryPublisher.address,
      })),
      filteredValue: filtersState?.filteredInfo?.address || null,
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        console.log("CategoryPublishers", CategoryPublishers);
        console.log("record.address", record.address);
        return record.address?.startsWith(value); // return true or false
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      filters: CategoryPublishers.map((CategoryPublisher) => ({
        text: CategoryPublisher.note,
        value: CategoryPublisher.note,
      })),
      filteredValue: filtersState?.filteredInfo?.note || null,
      sorter: (a, b) => a.note.length - b.note.length,
      sortOrder: sortedInfo.columnKey === "note" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.note?.startsWith(value); // return true or false
      },
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: CategoryPublishers.map((user) => ({
        text: moment(user.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: user.createdDate,
      })),
      filteredValue: filtersState?.filteredInfo?.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.createdDate?.startsWith(value); // return true or false
      },
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
                navigate(`/admin/nha-xuat-ban/edit/${record.id}`);
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
            <Title level={5}>Quản lý danh mục nhà xuất bản</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button
                onClick={(e) => navigate("/admin/nha-xuat-ban/newPublisher")}
              >
                Thêm mới danh mục nhà xuất bản
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
                onClick={(e) =>
                  categoryPublishers
                    .GetFileExcelCategoryPublish()
                    .then((res) => {
                      openNotificationWithIcon(
                        "success",
                        "Tải biểu mẫu excel thêm danh mục nhà xuất bản thành công",
                        res?.message,
                      );
                      const url = window.URL.createObjectURL(new Blob([res]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        "Mau_ImportNhaXuatBan.xlsx",
                      );
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
              dataSource={CategoryPublishers}
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

export const CategoryPublishersLayout = WithErrorBoundaryCustom(
  _CategoryPublishersLayout,
);
