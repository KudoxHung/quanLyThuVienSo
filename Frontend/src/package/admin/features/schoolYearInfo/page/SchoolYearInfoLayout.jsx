import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { formatDate, openNotificationWithIcon } from "../../../../client/utils";
import { schoolYear } from "../../../api/schoolYear";
import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Table, Typography } from "antd";

function _SchoolYearInfoLayout() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [SchoolYear, setSchoolYear] = useState([]);
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
    document.title = "Năm học";
  }, []);

  useEffect(() => {
    schoolYear
      .getAll(0, 0)
      .then((res) => {
        setSchoolYear(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy năm học thất bại",
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
      "filtersNamHoc",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: pagination,
      }),
    );
  };
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersNamHoc"));
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

  // const handleDelete = (id) => {
  //   setBtnLoading(true);
  //   schoolYear
  //     .delete(id)
  //     .then((res) => {
  //       openNotificationWithIcon(
  //         "success",
  //         "delete school Year success",
  //         res.message
  //       );
  //       setBtnLoading(false);
  //       setPostLength(postLength + 1);
  //     })
  //     .catch((err) => {
  //       openNotificationWithIcon(
  //         "error",
  //         "delete school Year error",
  //         err?.response?.data?.message || err?.message
  //       );
  //       setBtnLoading(false);
  //       setPostLength(postLength + 1);
  //     });
  // };

  const handleActive = (id) => {
    setBtnLoading(true);
    schoolYear
      .active(id, true)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Kích hoạt năm học thành công",
          res?.message,
        );
        setPostLength(postLength + 1);
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Kích hoạt năm học thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };
  const handleUnactive = (id) => {
    setBtnLoading(true);
    schoolYear
      .active(id, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hủy kích hoạt năm học thành công",
          res?.message,
        );
        setPostLength(postLength + 1);
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Hủy kích hoạt năm học thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: "Từ năm",
      dataIndex: "fromYear",
      key: "fromYear",
      filters: SchoolYear.map((SchoolYear) => ({
        text: SchoolYear.fromYear,
        value: SchoolYear.fromYear,
      })),
      fixed: "left",

      filteredValue: filtersState?.filteredInfo?.fromYear || null,
      sorter: (a, b) => a.fromYear.length - b.fromYear.length,
      sortOrder: sortedInfo.columnKey === "fromYear" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.fromYear.startsWith(value),
      render: (text, record) => formatDate(text, "yyyy"),
    },

    {
      title: "Đến năm",
      dataIndex: "toYear",
      key: "toYear",
      filters: SchoolYear.map((SchoolYear) => ({
        text: SchoolYear.toYear,
        value: SchoolYear.toYear,
      })),
      filteredValue: filtersState?.filteredInfo?.toYear || null,
      sorter: (a, b) => a.toYear.length - b.toYear.length,
      sortOrder: sortedInfo.columnKey === "toYear" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.toYear.startsWith(value),
      render: (text, record) => formatDate(text, "yyyy"),
    },
    {
      title: "Bắt đầu học kì I",
      dataIndex: "startSemesterI",
      key: "startSemesterI",
      filters: SchoolYear.map((SchoolYear) => ({
        text: SchoolYear.startSemesterI,
        value: SchoolYear.startSemesterI,
      })),
      filteredValue: filtersState?.filteredInfo?.startSemesterI || null,
      sorter: (a, b) => a.startSemesterI.length - b.startSemesterI.length,
      sortOrder:
        sortedInfo.columnKey === "startSemesterI" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.startSemesterI.startsWith(value),
      render: (text, record) => formatDate(text, "dd-MM-yyyy"),
    },
    {
      title: "Bắt đầu học kì II",
      dataIndex: "startSemesterII",
      key: "startSemesterII",
      filters: SchoolYear.map((SchoolYear) => ({
        text: SchoolYear.startSemesterII,
        value: SchoolYear.startSemesterII,
      })),
      filteredValue: filtersState?.filteredInfo?.startSemesterII || null,
      sorter: (a, b) => a.startSemesterII.length - b.startSemesterII.length,
      sortOrder:
        sortedInfo.columnKey === "startSemesterII" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.startSemesterII.startsWith(value),
      render: (text, record) => formatDate(text, "dd-MM-yyyy"),
    },
    {
      title: "kết thúc tất cả học kỳ",
      dataIndex: "endAllSemester",
      key: "endAllSemester",
      filters: SchoolYear.map((SchoolYear) => ({
        text: SchoolYear.endAllSemester,
        value: SchoolYear.endAllSemester,
      })),
      filteredValue: filtersState?.filteredInfo?.endAllSemester || null,
      sorter: (a, b) => a.endAllSemester.length - b.endAllSemester.length,
      sortOrder:
        sortedInfo.columnKey === "endAllSemester" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.endAllSemester.startsWith(value),
      render: (text, record) => formatDate(text, "dd-MM-yyyy"),
    },
    {
      title: "Tình trạng",
      dataIndex: "isActived",
      key: "isActived",
      filters: SchoolYear.map((SchoolYear) => ({
        text: SchoolYear.isActived ? "Đang hoạt động" : "Ngừng hoạt động",
        value: SchoolYear.isActived,
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
            loading={btnLoading}
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
            loading={btnLoading}
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
                navigate(`/admin/nam-hoc/edit/${record.id}`);
              }}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            {/* <Popconfirm
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
            </Popconfirm> */}
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
            <Title level={5}>Quản lý năm học</Title>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={SchoolYear}
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
export const SchoolYearInfoLayout = WithErrorBoundaryCustom(
  _SchoolYearInfoLayout,
);
