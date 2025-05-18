import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _SpecialRegistrationBooksLayout() {
  const navigate = useNavigate();
  // const [filteredInfo, setFilteredInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [Books, setBooks] = useState([]);
  const [filters, setFilters] = useState(null);
  const [sorters, setSorters] = useState(null);
  const [filtersState, setFiltersState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    pagination: null,
  });

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
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
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
  const getColumnSearchDateProps = (dataIndex) => ({
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
        <DatePicker
          ref={searchInput}
          placeholder={`Tìm theo ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e ? [e] : [])}
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
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
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
    books
      .GetListDocumentManyParam(
        getRandomuserParams({ ...params, DocumentType: 1 }),
      )
      .then((res) => {
        setBooks([...res]);
        setPagination({
          ...params.pagination,
          total: res[0]?.total,
          showTotal: (total) => `Tổng số: ${total} bản ghi`,
        });
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
  };

  // const handleTableChange = (newPagination, filters, sorter) => {
  //   fetchData({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination: newPagination,
  //     ...filters
  //   });
  // };
  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log("newPagination", newPagination);

    // Gộp bộ lọc cũ và mới, chỉ ghi đè nếu giá trị mới không phải null
    const combinedFilters = { ...newFilters };
    // Cập nhật bộ lọc, sắp xếp và phân trang
    setFilters(combinedFilters);
    setSorters(sorter);

    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...combinedFilters,
    });

    const filtersState = {
      filteredInfo: combinedFilters,
      sortedInfo: sorter,
      pagination: newPagination,
    };
    setFiltersState(filtersState);

    // Lưu trạng thái vào localStorage
    localStorage.setItem(
      "filtersDangKy",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: newPagination,
      }),
    );

    console.log("Updated filters:", combinedFilters);
  };

  useEffect(() => {
    document.title = "Đăng ký cá biệt từng bộ sách";
  }, []);

  // useEffect(() => {
  //   fetchData({
  //     pagination
  //   });
  // }, []);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersDangKy"));
    console.log("savedFilters", savedFilters);

    setFiltersState(savedFilters);

    if (savedFilters?.filteredInfo) {
      console.log("alo", savedFilters?.filteredInfo);
      setFilters(savedFilters.filteredInfo);
    }

    if (savedFilters?.sortedInfo) {
      setSorters(savedFilters.sortedInfo);
    }

    if (savedFilters?.pagination) {
      setPagination(savedFilters.pagination);
    }
    fetchData({
      sortField: savedFilters?.sortedInfo?.field || sorters?.field,
      sortOrder: savedFilters?.sortedInfo?.order || sorters?.order,
      pagination: savedFilters?.pagination ?? pagination,
      ...(savedFilters?.filteredInfo || filters),
    });
  }, []);

  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "docName",
      key: "docName",
      fixed: "left",
      ...getColumnSearchProps("docName"),
      filteredValue: filtersState?.filteredInfo?.docName || null,
      render: (_, record) => (
        <Tooltip title={record.document.docName}>
          <Typography.Text>
            {record.document.docName?.length > 22
              ? `${record.document.docName?.slice(0, 22)}...`
              : record.document.docName}
          </Typography.Text>
        </Tooltip>
      ),
    },

    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      ...getColumnSearchDateProps("createdDate"),
      filteredValue: filtersState?.filteredInfo?.createdDate || null,
      render: (_, record) =>
        moment(record.document?.createdDate).format("DD/MM/YYYY HH:mm:ss"),
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
                navigate(
                  `/admin/dang-ky-ca-biet-tung-bo-sach/children/${record.document.id}`,
                );
              }}
            >
              Quản lý đăng ký cá biệt
            </Button>
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
            <Title level={5}>Quản lý danh mục đăng ký các biệt </Title>
            <Space wrap style={{ margin: "10px 0px 10px 0px" }}>
              <Button
                type="primary"
                onClick={() => navigate("/admin/in-gay-sach-nhieu-loai-sach")}
              >
                In gáy sách nhiều loại sách
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={Books}
              onChange={handleTableChange}
              loading={loading}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const SpecialRegistrationBooksLayout = WithErrorBoundaryCustom(
  _SpecialRegistrationBooksLayout,
);
