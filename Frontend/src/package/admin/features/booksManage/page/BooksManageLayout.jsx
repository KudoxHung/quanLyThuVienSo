import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import {
  formatDate,
  getCookie,
  openNotificationWithIcon,
} from "../../../../client/utils";
import { dataLanguageWord } from "../../../../client/utils/dataLanguageWord";
import { getImageFilterForSizeImage } from "../../../../client/utils/filterImage";
import { books } from "../../../api/books";
import { categoryPublishers } from "../../../api/categoryPublishers";
import { categorySignV1 } from "../../../api/categorySignV1";
import { documentType } from "../../../api/documentType";
import ModalProgress from "../../../components/ModalProgress/ModalProgress";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
//view PDF
import { SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import moment from "moment";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function _BooksManageLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [Books, setBooks] = useState([]);
  const [CategorySignV1, setCategorySignV1] = useState([]);
  const [CategoryPublishers, setCategoryPublishers] = useState([]);
  const [DocumentType, setDocumentType] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [processAddListBook, setProcessAddListBook] = useState(false);
  const [postLength, setPostLength] = useState(0);
  //Avatar
  const [isModalAvatarVisible, setIsModalAvatarVisible] = useState(false);
  const [listAvatar, setListAvatar] = useState([]);
  //PDF
  const [isModalPDFVisible, setIsModalPDFVisible] = useState(false);
  const [listPDF, setListPDF] = useState([]);
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
  // getColumnSearchDateProps
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
        console.log([...res]);
        setBooks([...res]);
        setPagination({
          ...params.pagination,
          total: res[0]?.total,
          showTotal: (total) => `Tổng số: ${total} bản ghi`,
          pageSizeOptions: ["6", "10", "20", "50", "100", res[0]?.total],
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
  //   setFilters(filters);
  //   setSorters(sorter);
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
      "filtersKhaiBaoSach",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: newPagination,
      }),
    );

    console.log("Updated filters:", combinedFilters);
  };

  // useEffect(() => {
  //   fetchData({
  //     pagination
  //   });
  // }, [postLength]);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersKhaiBaoSach"));
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
  }, [postLength]);

  useEffect(() => {
    document.title = "Quản lý sách";
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        documentType
          .getAllNotPage(1)
          .then((res) => {
            setDocumentType(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categorySignV1
          .readAll(0, 0)
          .then((res) => {
            setCategorySignV1(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "getAll categorySignV1 error",
              err?.response?.data?.message || err?.message,
            );
          }),
        categoryPublishers
          .getAll()
          .then((res) => {
            setCategoryPublishers(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách nhà xuất bản thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, []);
  const handleDelete = (id) => {
    setBtnLoading(true);
    books
      .delete(id)
      .then((res) => {
        openNotificationWithIcon("success", "Xóa sách thành công", res.message);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa sách thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
        fetchData({
          sortField: sorters.field,
          sortOrder: sorters.order,
          pagination: pagination,
          ...filters,
        });
      });
  };
  const handleApproved = (id) => {
    setBtnLoading(true);
    books
      .apporeBook(id, true)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Phê duyệt thành công",
          res.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Phê duyệt thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handleUnApproved = (id) => {
    setBtnLoading(true);
    books
      .apporeBook(id, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hủy phê duyệt thành công",
          res.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Hủy phê duyệt thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  // Select multi item in the list
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const handleSelectChange = (key, checked) => {
    const selectedKeys = checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter((k) => k !== key);
    setSelectedRowKeys(selectedKeys);
  };
  const handleDeleteSelected = () => {
    selectedRowKeys.forEach((item) => {
      console.log(item);
    });
    books
      .DeleteBookByListId(selectedRowKeys)
      .then((res) => {
        openNotificationWithIcon("success", "Xóa sách thành công", res.message);
        setPostLength(postLength + 1);
        setSelectedRowKeys([]);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa sách thất bại",
          err?.response?.data?.message || err?.message,
        );
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const handleSelectAll = () => {
    if (selectedRowKeys.length === Books.length) {
      setSelectedRowKeys([]);
    } else {
      const allKeys = Books.map((record) => record.document.id);
      setSelectedRowKeys(allKeys);
    }
  };

  // const columns = [
  //   {
  //     title: <Button onClick={handleSelectAll}> {selectedRowKeys.length === 0 ? "Chọn tất cả" : "Bỏ chọn"}</Button>,
  //     dataIndex: "id",
  //     render: (_, record) => (
  //       <Checkbox
  //         checked={selectedRowKeys.includes(record.document.id)}
  //         onChange={(e) => handleSelectChange(record.document.id, e.target.checked)}
  //       />
  //     )
  //   },
  //   {
  //     title: "Tên sách",
  //     dataIndex: "docName",
  //     key: "docName",
  //     fixed: "left",
  //     ...getColumnSearchProps("docName"),
  //     render: (_, record) => (
  //       <Tooltip title={record.document.docName}>
  //         <Typography.Text>
  //           {record.document.docName?.length > 22
  //             ? `${record.document.docName?.slice(0, 22)}...`
  //             : record.document.docName}
  //         </Typography.Text>
  //       </Tooltip>
  //     )
  //   },
  //   {
  //     title: "Danh mục sách",
  //     dataIndex: "nameCategory",
  //     key: "nameCategory",
  //     filters: DocumentType.map((DocumentType) => ({
  //       text: DocumentType.docTypeName,
  //       value: DocumentType.id
  //     })),
  //     filterSearch: true
  //   },
  //   {
  //     title: "Kí hiệu phân loại",
  //     dataIndex: "idCategorySign_V1",
  //     key: "idCategorySign_V1",
  //     filters: CategorySignV1.map((CategorySignV1) => ({
  //       text: `${CategorySignV1.signCode} - ${CategorySignV1.signName}`,
  //       value: CategorySignV1.id
  //     })),

  //     filterSearch: true,
  //     render: (_, record) =>
  //       `${CategorySignV1.find((item) => item.id === record.document.idCategorySign_V1)?.signCode} - ${
  //         CategorySignV1.find((item) => item.id === record.document.idCategorySign_V1)?.signName
  //       }`
  //   },
  //   {
  //     title: "Ngày Tạo",
  //     dataIndex: "createdDate",
  //     key: "createdDate",
  //     ...getColumnSearchDateProps("createdDate"),
  //     sorter: true,
  //     render: (_, record) => moment(record.document.createdDate).format("DD/MM/YYYY HH:mm:ss")
  //   },
  //   {
  //     title: "Ngôn ngữ",
  //     dataIndex: "language",
  //     key: "language",
  //     filters: dataLanguageWord.map((item) => ({
  //       text: item.name,
  //       value: item.name
  //     })),

  //     filterSearch: true,
  //     render: (_, record) => record.document.language
  //   },
  //   {
  //     title: "Nhà xuất bản",
  //     dataIndex: "publisher",
  //     key: "publisher",
  //     filters: CategoryPublishers.map((item) => ({
  //       value: item.publisherName,
  //       text: `${item.publisherCode} - ${item.publisherName}`
  //     })),

  //     filterSearch: true,

  //     render: (_, record) => record.document.publisher
  //   },
  //   {
  //     title: "Nơi xuất bản",
  //     render: (_, record) => record.document.publishPlace
  //   },
  //   {
  //     title: "Năm xuất bản",
  //     dataIndex: "publishYear",
  //     key: "publishYear",
  //     ...getColumnSearchProps("publishYear"),

  //     render: (_, record) =>
  //       moment(record.document.publishYear).format("YYYY") === "Invalid date"
  //         ? " "
  //         : moment(record.document.publishYear).format("YYYY")
  //   },
  //   {
  //     title: "số lượt xem",
  //     dataIndex: "numberView",
  //     key: "numberView",
  //     ...getColumnSearchProps("numberView"),
  //     sorter: true,

  //     render: (_, record) => record.document.numberView
  //   },
  //   {
  //     title: "Lượt thích",
  //     dataIndex: "numberLike",
  //     key: "numberLike",
  //     ...getColumnSearchProps("numberLike"),
  //     sorter: true,
  //     render: (_, record) => record.document.numberLike
  //   },
  //   {
  //     title: "Lượt không thích",
  //     dataIndex: "numberUnlike",
  //     key: "numberUnlike",
  //     ...getColumnSearchProps("numberUnlike"),
  //     sorter: true,
  //     render: (_, record) => record.document.numberLike
  //   },
  //   {
  //     title: "Ngày sửa đổi",
  //     dataIndex: "modifiedDate",
  //     key: "modifiedDate",
  //     ...getColumnSearchDateProps("modifiedDate"),

  //     render: (_, record) =>
  //       moment(record.document.modifiedDate).format("DD/MM/YYYY HH:mm:ss") === "Invalid date"
  //         ? " "
  //         : moment(record.document.modifiedDate).format("DD/MM/YYYY HH:mm:ss")
  //   },
  //   {
  //     title: "Bản vật lý",
  //     dataIndex: "isHavePhysicalVersion",
  //     key: "isHavePhysicalVersion",
  //     filters: [
  //       {
  //         text: <Tag color={"success"}>Có</Tag>,
  //         value: true
  //       },
  //       {
  //         text: <Tag color={"red"}>Không</Tag>,
  //         value: false
  //       }
  //     ],
  //     filterSearch: true,
  //     render: (_, record) => {
  //       return record.document.isHavePhysicalVersion ? <Tag color={"success"}>Có</Tag> : <Tag color={"red"}>Không</Tag>;
  //     }
  //   },
  //   {
  //     title: "Tác giả",
  //     dataIndex: "author",
  //     key: "author",
  //     ...getColumnSearchProps("author"),

  //     render: (_, record) => record.document.author
  //   },
  //   {
  //     title: "Ghi chú",
  //     dataIndex: "description",
  //     key: "description",
  //     ...getColumnSearchProps("description"),

  //     render: (_, record) => (
  //       <Tooltip title={record.document.description}>
  //         <Typography.Text>
  //           {record.document.description?.length > 22
  //             ? `${record.document.description?.slice(0, 22)}...`
  //             : record.document.description}
  //         </Typography.Text>
  //       </Tooltip>
  //     )
  //   },
  //   {
  //     title: "Giá",
  //     dataIndex: "price",
  //     key: "price",
  //     ...getColumnSearchProps("price"),

  //     // format the price to show the currency vnd
  //     render: (_, record) =>
  //       Intl.NumberFormat("vi-VN", {
  //         style: "currency",
  //         currency: "VND"
  //       }).format(record.document.price)
  //   },

  //   {
  //     title: "Avatar",
  //     dataIndex: "Avatar",
  //     key: "Avatar",
  //     render: (_, record) => (
  //       <Button
  //         type="default"
  //         onClick={(e) => {
  //           setIsModalAvatarVisible(true);
  //           setListAvatar(record.listAvatar);
  //         }}
  //       >
  //         Xem ảnh
  //       </Button>
  //     )
  //   },
  //   {
  //     title: "PDF",
  //     dataIndex: "PDF",
  //     key: "PDF",
  //     render: (_, record) => (
  //       <Button
  //         type="default"
  //         onClick={(e) => {
  //           setIsModalPDFVisible(true);
  //           setListPDF({
  //             fileName: record.document.fileName,
  //             filePath: record.document.filePath,
  //             docName: record.document.docName
  //           });
  //         }}
  //       >
  //         Xem nội dung
  //       </Button>
  //     )
  //   },
  //   {
  //     title: "Kiểm duyệt",
  //     dataIndex: "isApproved",
  //     key: "isApproved",
  //     filters: [
  //       {
  //         text: <Tag color={"success"}>Đã duyệt</Tag>,
  //         value: true
  //       },
  //       {
  //         text: <Tag color={"red"}>Chưa duyệt</Tag>,
  //         value: false
  //       }
  //     ],
  //     filterSearch: true,

  //     render: (_, record) => {
  //       return !record.document.isApproved ? (
  //         <Button type="primary" onClick={(e) => handleApproved(record.document.id)} loading={btnLoading}>
  //           Duyệt
  //         </Button>
  //       ) : (
  //         <Button type="danger" onClick={(e) => handleUnApproved(record.document.id)} loading={btnLoading}>
  //           Bỏ Duyệt
  //         </Button>
  //       );
  //     }
  //   },
  //   {
  //     title: "Thao tác",
  //     render: (_, record) => {
  //       return (
  //         <Space size="small">
  //           <Button
  //             type="primary"
  //             onClick={(e) => {
  //               e.preventDefault();
  //               navigate(`/admin/khai-bao-sach/edit/${record.document.id}`);
  //             }}
  //             icon={<EditOutlined />}
  //           >
  //             Chỉnh sửa
  //           </Button>
  //           <Popconfirm
  //             title="Bạn có chắc chắn không ?"
  //             okText="Có"
  //             cancelText="Không"
  //             onConfirm={() => handleDelete(record.document.id)}
  //           >
  //             <Button type="danger" loading={btnLoading} icon={<DeleteOutlined />}>
  //               Xóa
  //             </Button>
  //           </Popconfirm>
  //         </Space>
  //       );
  //     }
  //   }
  // ];
  const columns = [
    {
      title: (
        <Button onClick={handleSelectAll}>
          {selectedRowKeys.length === 0 ? "Chọn tất cả" : "Bỏ chọn"}
        </Button>
      ),
      dataIndex: "id",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.document?.id)} // Sử dụng ? để tránh lỗi
          onChange={(e) =>
            handleSelectChange(record.document?.id, e.target.checked)
          } // Sử dụng ? để tránh lỗi
        />
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "docName",
      key: "docName",
      fixed: "left",
      ...getColumnSearchProps("docName"),
      filteredValue: filtersState?.filteredInfo?.docName || null,
      render: (_, record) => (
        <Tooltip title={record.document?.docName}>
          <Typography.Text>
            {record.document?.docName?.length > 22
              ? `${record.document?.docName?.slice(0, 22)}...`
              : record.document?.docName}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Danh mục sách",
      dataIndex: "nameCategory",
      key: "nameCategory",
      filters: DocumentType.map((DocumentType) => ({
        text: DocumentType.docTypeName,
        value: DocumentType.id,
      })),
      filterSearch: true,
      filteredValue: filtersState?.filteredInfo?.nameCategory || null,
    },
    {
      title: "Kí hiệu phân loại",
      dataIndex: "idCategorySign_V1",
      key: "idCategorySign_V1",
      filters: CategorySignV1.map((CategorySignV1) => ({
        text: `${CategorySignV1.signCode} - ${CategorySignV1.signName}`,
        value: CategorySignV1.id,
      })),
      filterSearch: true,
      filteredValue: filtersState?.filteredInfo?.idCategorySign_V1 || null,
      render: (_, record) => {
        const category = CategorySignV1.find(
          (item) => item.id === record.document?.idCategorySign_V1,
        );
        return category
          ? `${category.signCode} - ${category.signName}`
          : "Không xác định";
      },
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      ...getColumnSearchDateProps("createdDate"),
      filteredValue: filtersState?.filteredInfo?.createdDate || null,
      sorter: true,
      render: (_, record) =>
        moment(record.document?.createdDate).format("DD/MM/YYYY HH:mm:ss") ||
        "Không xác định",
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      filters: dataLanguageWord.map((item) => ({
        text: item.name,
        value: item.name,
      })),
      filterSearch: true,
      filteredValue: filtersState?.filteredInfo?.language || null,
      render: (_, record) => record.document?.language || "Không xác định",
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher",
      key: "publisher",
      filters: CategoryPublishers.map((item) => ({
        value: item.publisherName,
        text: `${item.publisherCode} - ${item.publisherName}`,
      })),
      filterSearch: true,
      filteredValue: filtersState?.filteredInfo?.publisher || null,
      render: (_, record) => record.document?.publisher || "Không xác định",
    },
    {
      title: "Nơi xuất bản",
      render: (_, record) => record.document?.publishPlace || "Không xác định",
    },
    {
      title: "Năm xuất bản",
      dataIndex: "publishYear",
      key: "publishYear",
      ...getColumnSearchProps("publishYear"),
      filteredValue: filtersState?.filteredInfo?.publishYear || null,
      render: (_, record) => {
        const year = moment(record.document?.publishYear).format("YYYY");
        return year === "Invalid date" ? "Không xác định" : year;
      },
    },
    {
      title: "Số lượt xem",
      dataIndex: "numberView",
      key: "numberView",
      ...getColumnSearchProps("numberView"),
      filteredValue: filtersState?.filteredInfo?.numberView || null,
      sorter: true,
      render: (_, record) => record.document?.numberView || 0,
    },
    {
      title: "Lượt thích",
      dataIndex: "numberLike",
      key: "numberLike",
      ...getColumnSearchProps("numberLike"),
      filteredValue: filtersState?.filteredInfo?.numberLike || null,
      sorter: true,
      render: (_, record) => record.document?.numberLike || 0,
    },
    {
      title: "Lượt không thích",
      dataIndex: "numberUnlike",
      key: "numberUnlike",
      ...getColumnSearchProps("numberUnlike"),
      filteredValue: filtersState?.filteredInfo?.numberUnlike || null,
      sorter: true,
      render: (_, record) => record.document?.numberUnlike || 0,
    },
    {
      title: "Ngày sửa đổi",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      ...getColumnSearchDateProps("modifiedDate"),
      filteredValue: filtersState?.filteredInfo?.modifiedDate || null,
      render: (_, record) => {
        const modifiedDate = moment(record.document?.modifiedDate).format(
          "DD/MM/YYYY HH:mm:ss",
        );
        return modifiedDate === "Invalid date"
          ? "Không xác định"
          : modifiedDate;
      },
    },
    {
      title: "Bản vật lý",
      dataIndex: "isHavePhysicalVersion",
      key: "isHavePhysicalVersion",
      filters: [
        {
          text: <Tag color={"success"}>Có</Tag>,
          value: true,
        },
        {
          text: <Tag color={"red"}>Không</Tag>,
          value: false,
        },
      ],
      filterSearch: true,
      filteredValue: filtersState?.filteredInfo?.isHavePhysicalVersion || null,
      render: (_, record) => {
        return record.document?.isHavePhysicalVersion ? (
          <Tag color={"success"}>Có</Tag>
        ) : (
          <Tag color={"red"}>Không</Tag>
        );
      },
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      ...getColumnSearchProps("author"),
      filteredValue: filtersState?.filteredInfo?.author || null,
      render: (_, record) => record.document?.author || "Không xác định",
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      filteredValue: filtersState?.filteredInfo?.description || null,
      render: (_, record) => (
        <Tooltip title={record.document?.description}>
          <Typography.Text>
            {record.document?.description?.length > 22
              ? `${record.document?.description?.slice(0, 22)}...`
              : record.document?.description || "Không có ghi chú"}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      ...getColumnSearchProps("price"),
      filteredValue: filtersState?.filteredInfo?.price || null,
      render: (_, record) =>
        record.document?.price !== undefined
          ? Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(record.document.price)
          : "Không xác định",
    },
    {
      title: "Avatar",
      dataIndex: "Avatar",
      key: "Avatar",
      render: (_, record) => (
        <Button
          type="default"
          onClick={(e) => {
            if (!record?.listAvatar || record.listAvatar.length === 0) {
              openNotificationWithIcon(
                "warning",
                "Thông báo",
                "Không có avatar nào cho sách này.",
              );
              return;
            }

            let error = 0;

            record?.listAvatar.forEach((item, index) => {
              if (!item) {
                error = 1;
                return;
              }
            });

            if (error > 0) {
              openNotificationWithIcon(
                "warning",
                "Thông báo",
                "Không có avatar nào.",
              );
              return;
            }

            setIsModalAvatarVisible(true);
            setListAvatar(record.listAvatar);
          }}
        >
          Xem ảnh
        </Button>
      ),
    },
    {
      title: "PDF",
      dataIndex: "PDF",
      key: "PDF",
      render: (_, record) => (
        <Button
          type="default"
          onClick={(e) => {
            setIsModalPDFVisible(true);
            setListPDF({
              fileName: record.document?.fileName,
              filePath: record.document?.filePath,
              docName: record.document?.docName,
            });
          }}
        >
          Xem nội dung
        </Button>
      ),
    },
    {
      title: "Kiểm duyệt",
      dataIndex: "isApproved",
      key: "isApproved",
      filters: [
        {
          text: <Tag color={"success"}>Đã duyệt</Tag>,
          value: true,
        },
        {
          text: <Tag color={"red"}>Chưa duyệt</Tag>,
          value: false,
        },
      ],
      filterSearch: true,
      filteredValue: filtersState?.filteredInfo?.isApproved || null,
      render: (_, record) => {
        return !record.document?.isApproved ? (
          <Button
            type="primary"
            onClick={(e) => handleApproved(record.document.id)}
            loading={btnLoading}
          >
            Duyệt
          </Button>
        ) : (
          <Button
            type="danger"
            onClick={(e) => handleUnApproved(record.document.id)}
            loading={btnLoading}
          >
            Bỏ Duyệt
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
                navigate(`/admin/khai-bao-sach/edit/${record.document?.id}`);
              }}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDelete(record.document?.id)}
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

  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  const props = {
    accept: ".xlsx, .xls, .xlsm",
    name: "file",
    action: `${apiUrl}/api/Book/InsertBookByExcel`,
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === "done") {
        console.log("result", info.file.response);
        if (info.file.response.success == false) {
          message.error(`${info.file.name} ${info.file.response.message}`);
        } else {
          message.success(
            `${info.file.name} Lấy biểu mẫu excel thêm mới sách thành công`,
          );
        }

        setPostLength(postLength + 1);
      } else if (info.file.status === "error") {
        message.error(
          `${info.file.name} Lấy biểu mẫu excel thêm mới sách không thành công.`,
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
  const propsInsertBookAndIndividual = {
    accept: ".xlsx, .xls, .xlsm",
    name: "file",
    showUploadList: false,
    customRequest: async (options) => {
      try {
        setProcessAddListBook(true);
        const formData = new FormData();
        formData.append("file", options.file);
        const res = await books.InsertBookAndIndividualByExcel(formData);

        if (res.success) {
          setPostLength(postLength + 1);
        } else {
          openNotificationWithIcon("warning", res.message);
          options.onError(res.message, options.file);
        }
      } catch (error) {
        openNotificationWithIcon(
          "error",
          "Thêm thất bại",
          error?.response?.data?.message || error?.message,
        );
      }
      setProcessAddListBook(false);
    },
  };
  const { Title } = Typography;
  return (
    <div className="layout-content">
      <ModalProgress
        start={processAddListBook}
        title={"Tiến trình thêm sách hàng loạt"}
      />
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>Quản lý sách</Title>
            <Space
              style={{
                marginBottom: 16,
              }}
              wrap
            >
              <Button
                onClick={(e) => navigate("/admin/khai-bao-sach/new")}
                loading={btnLoading}
              >
                Thêm sách mới - khai báo ban đầu
              </Button>
              <Popconfirm
                title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} mục đã chọn không?`}
                onConfirm={handleDeleteSelected}
                onCancel={() => console.log("Hủy xóa")}
                okText="Xác nhận"
                cancelText="Hủy"
                disabled={selectedRowKeys.length === 0}
                icon={<QuestionCircleOutlined />}
              >
                <Tooltip title="Chú ý chức năng này có thể xóa luôn các mã cá biệt của cuốn sách, kiểm tra kĩ trước khi thực hiện">
                  <Button danger disabled={selectedRowKeys.length === 0}>
                    Xóa {selectedRowKeys.length} mục đã chọn
                  </Button>
                </Tooltip>
              </Popconfirm>
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
                  books
                    .GetFileExcelImportBook()
                    .then((res) => {
                      openNotificationWithIcon(
                        "success",
                        "Thành công",
                        res?.message,
                      );
                      const url = window.URL.createObjectURL(new Blob([res]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", "MauThemSach.xlsm");
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
              <Upload {...propsInsertBookAndIndividual}>
                <Button
                  style={{ color: "green", borderColor: "green" }}
                  icon={[
                    <svg
                      className="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                        fill="green"
                      ></path>
                    </svg>,
                  ]}
                  loading={btnLoading}
                >
                  Lấy biểu mẫu thêm sách và đăng ký cá biệt
                </Button>
              </Upload>

              <Button
                loading={btnLoading}
                onClick={(e) =>
                  books
                    .GetFileExcelImportBookAndIndividual()
                    .then((res) => {
                      openNotificationWithIcon(
                        "success",
                        "Thành công",
                        res?.message,
                      );
                      const url = window.URL.createObjectURL(new Blob([res]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        "Mẫu thêm sách và đăng ký cá biệt.xlsm",
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
                    width="20"
                    height="20"
                  >
                    <path
                      d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                      fill="green"
                    ></path>
                  </svg>,
                ]}
              >
                Tải biểu mẫu thêm sách và đăng ký cá biệt
              </Button>
            </Space>
            <Table
              scroll={{ x: 400 }}
              rowKey={(record) => record.document.id}
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
      <FilesAvatarModal
        isModalAvatarVisible={isModalAvatarVisible}
        setIsModalAvatarVisible={setIsModalAvatarVisible}
        listAvatar={listAvatar}
      />
      <FilesPDFModal
        isModalPDFVisible={isModalPDFVisible}
        setIsModalPDFVisible={setIsModalPDFVisible}
        listPDF={listPDF}
        style={{ width: "1000px" }}
      />
    </div>
  );
}

const FilesAvatarModal = (props) => {
  return (
    <Modal
      visible={props.isModalAvatarVisible}
      title={`Avatar`}
      footer={null}
      onCancel={() => props.setIsModalAvatarVisible(false)}
      width={550}
    >
      <Card bordered={false} className="criclebox h-full">
        <Row gutter={[24, 0]}>
          {props.listAvatar.map((item) => (
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Descriptions title="Thông tin file">
                <Descriptions.Item label="Tên file">
                  {item.nameFileAvatar}
                </Descriptions.Item>
                <Descriptions.Item label="Loại file">
                  {item.fileNameExtention}
                </Descriptions.Item>
                <Descriptions.Item label="File path">
                  {item.path}
                </Descriptions.Item>
                <Descriptions.Item label="ngày tạo">
                  {formatDate(item.createDate, "dd-MM-yyyy")}
                </Descriptions.Item>
                <Descriptions.Item label="sizeImage">
                  {item.sizeImage}
                </Descriptions.Item>
              </Descriptions>
              <Image
                src={getImageFilterForSizeImage(props.listAvatar)}
                alt="avatar"
              />
            </Col>
          ))}
        </Row>
      </Card>
    </Modal>
  );
};

const FilesPDFModal = (props) => {
  useEffect(() => {
    if (!props?.listPDF?.fileName && props.isModalPDFVisible) {
      openNotificationWithIcon(
        "info",
        "Thông báo sự thiếu sót",
        "Hiện tại chưa có bản điện tử nào, vui lòng quay lại sau, cảm ơn!",
      );
      props.setIsModalPDFVisible(false);
    }
  }, [props]);

  const transform = (slot) => ({
    ...slot,
    Download: () => <></>,
    Print: () => <></>,
    DownloadMenuItem: () => <></>,
  });
  const pdfjs = require("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

  const renderToolbar = function (Toolbar) {
    return <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
  });
  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance;
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  return (
    <Modal
      visible={props.isModalPDFVisible}
      title={`Nội dung - ${props.listPDF.docName}`}
      footer={null}
      onCancel={() => props.setIsModalPDFVisible(false)}
      width={1000}
    >
      <Card bordered={false} className="criclebox h-full" width="1000px">
        <div
          className="viewOnlineProductLayout Container"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "70vh",
            width: "100%",
          }}
        >
          <Viewer
            fileUrl={
              props?.listPDF?.fileName
                ? `${apiUrl}/api/Book/GetFilePdfSiteAdmin?fileNameId=${props?.listPDF?.fileName}`
                : "file"
            }
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={SpecialZoomLevel.PageWidth}
          />
        </div>
      </Card>
    </Modal>
  );
};

export const BooksManageLayout = WithErrorBoundaryCustom(_BooksManageLayout);
