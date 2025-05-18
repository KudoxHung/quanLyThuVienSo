import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { formatDate, openNotificationWithIcon } from "../../../../client/utils";
import { holidaySchedule } from "../../../api/holidaySchedule";
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

function _HolidayScheduleLayout() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [RestDay, setRestDay] = useState([]);
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
    document.title = "lịch nghỉ lễ";
  }, []);

  useEffect(() => {
    holidaySchedule
      .getRestDays(0, 0)
      .then((res) => {
        setRestDay(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách lịch nghỉ thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => setLoading(false));
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
      "filtersLichNghiLe",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersLichNghiLe"));
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
    holidaySchedule
      .delete(id)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xóa lịch nghỉ thành công",
          res?.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa lịch nghỉ thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => setBtnLoading(false));
  };

  const handleActive = (id) => {
    setBtnLoading(true);
    holidaySchedule
      .active(id, true)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Kích hoạt lịch nghỉ thành công",
          res?.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Kích hoạt lịch nghỉ thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handleUnactive = (id) => {
    setBtnLoading(true);
    holidaySchedule
      .active(id, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Vô hiệu lịch nghỉ thành công",
          res?.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Vô hiệu lịch nghỉ thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => setBtnLoading(false));
  };

  const columns = [
    {
      title: "Nội dung",
      dataIndex: "nameRestDate",
      key: "nameRestDate",
      filters: RestDay.map((RestDay) => ({
        text: RestDay.nameRestDate,
        value: RestDay.nameRestDate,
      })),
      fixed: "left",

      filteredValue: filtersState?.filteredInfo?.nameRestDate || null,
      sorter: (a, b) => a.nameRestDate.length - b.nameRestDate.length,
      sortOrder:
        sortedInfo.columnKey === "nameRestDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.nameRestDate.startsWith(value),
    },

    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      filters: RestDay.map((RestDay) => ({
        text: RestDay.fromDate,
        value: RestDay.fromDate,
      })),
      filteredValue: filtersState?.filteredInfo?.fromDate || null,
      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
      sortOrder: sortedInfo.columnKey === "fromDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.fromDate.startsWith(value),
      render: (text, record) => formatDate(text, "dd-MM-yyyy"),
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      filters: RestDay.map((RestDay) => ({
        text: RestDay.toDate,
        value: RestDay.toDate,
      })),
      filteredValue: filtersState?.filteredInfo?.toDate || null,
      sorter: (a, b) => a.toDate.length - b.toDate.length,
      sortOrder: sortedInfo.columnKey === "toDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.toDate.startsWith(value),
      render: (text, record) => formatDate(text, "dd-MM-yyyy"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: RestDay.map((RestDay) => ({
        text: moment(RestDay.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: RestDay.createdDate,
      })),
      filteredValue: filtersState?.filteredInfo?.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createdDate.startsWith(value),
      render: (text, record) => formatDate(text, "dd-MM-yyyy"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      filters: RestDay.map((RestDay) => ({
        text: RestDay.note,
        value: RestDay.note,
      })),
      filteredValue: filtersState?.filteredInfo?.note || null,
      sorter: (a, b) => a.note.length - b.note.length,
      sortOrder: sortedInfo.columnKey === "note" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      ellipsis: true,
      onFilter: (value, record) => record.endAllSemester.startsWith(value),
    },
    {
      title: "Tình trạng",
      dataIndex: "isActived",
      key: "isActived",
      filters: RestDay.map((RestDay) => ({
        text: RestDay.isActived ? "Đang hoạt động" : "Ngừng hoạt động",
        value: RestDay.isActived,
      })),
      filteredValue: filtersState?.filteredInfo?.isActived || null,
      sorter: (a, b) => a.isActived.length - b.isActived.length,
      sortOrder: sortedInfo.columnKey === "isActived" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => String(record.isActived) === String(value),

      render: (text, record) => {
        return !record.isActived ? (
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              handleActive(record.id);
            }}
          >
            kích hoạt
          </Button>
        ) : (
          <Button
            type="danger"
            size="small"
            onClick={(e) => {
              handleUnactive(record.id);
            }}
          >
            Bỏ kích hoạt
          </Button>
        );
      },
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
                navigate(`/admin/lich-nghi-le/edit/${record.id}`);
              }}
              icon={<EditOutlined />}
              loading={btnLoading}
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
            <Title level={5}>Quản lý lịch nghỉ lễ</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
            >
              <Button onClick={(e) => navigate("/admin/lich-nghi-le/new")}>
                Thêm mới lịch nghỉ
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={RestDay}
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

export const HolidayScheduleLayout = WithErrorBoundaryCustom(
  _HolidayScheduleLayout,
);
