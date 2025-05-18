import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { formatDate, openNotificationWithIcon } from "../../../../client/utils";
import { getImageFilterForSizeImage } from "../../../../client/utils/filterImage";
import { books } from "../../../api/books";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
//view PDF
import { SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function _MagazineByCategoryLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [Books, setBooks] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);

  //Avatar
  const [isModalAvatarVisible, setIsModalAvatarVisible] = useState(false);
  const [listAvatar, setListAvatar] = useState([]);

  //PDF
  const [isModalPDFVisible, setIsModalPDFVisible] = useState(false);
  const [listPDF, setListPDF] = useState([]);

  useEffect(() => {
    document.title = "Quản lý sách báo tạp chí";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        books
          .getBookByCategory(0, 0, param.id)
          .then((res) => {
            setBooks(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách báo tạp chí thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setLoading(false);
          }),
      ]);
    };
    fetchData();
  }, [postLength, param]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleDelete = (id) => {
    setBtnLoading(true);
    books
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
  // const handleApproved = (id) => {
  //   setBtnLoading(true);
  //   books
  //     .apporeBook(id, true)
  //     .then((res) => {
  //       openNotificationWithIcon(
  //         "success",
  //         "Phê duyệt thành công",
  //         res.message
  //       );
  //       setBtnLoading(false);
  //       setPostLength(postLength + 1);
  //     })
  //     .catch((err) => {
  //       openNotificationWithIcon(
  //         "error",
  //         "Phê duyệt thất bại",
  //         err?.response?.data?.message || err?.message
  //       );
  //       setBtnLoading(false);
  //       setPostLength(postLength + 1);
  //     });
  // };
  // const handleUnApproved = (id) => {
  //   setBtnLoading(true);
  //   books
  //     .apporeBook(id, false)
  //     .then((res) => {
  //       openNotificationWithIcon(
  //         "success",
  //         "Hủy phê duyệt thành công",
  //         res.message
  //       );
  //       setBtnLoading(false);
  //       setPostLength(postLength + 1);
  //     })
  //     .catch((err) => {
  //       openNotificationWithIcon(
  //         "error",
  //         "Hủy phê duyệt thất bại",
  //         err?.response?.data?.message || err?.message
  //       );
  //       setBtnLoading(false);
  //       setPostLength(postLength + 1);
  //     });
  // };

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "docName",
      key: "docName",
      filters: Books.map((Books) => ({
        text: Books.document.docName,
        value: Books.document.docName,
      })),
      fixed: "left",
      filteredValue: filteredInfo.docName || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.document.docName.startsWith(value),

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
      title: "Danh mục sách",
      dataIndex: "nameCategory",
      key: "nameCategory",
      filters: Books.map((Books) => ({
        text: Books.nameCategory,
        value: Books.nameCategory,
      })),
      filteredValue: filteredInfo.nameCategory || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.nameCategory.startsWith(value),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: Books.map((Books) => ({
        text: moment(Books.document.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: Books.document.createdDate,
      })),
      filteredValue: filteredInfo.createdDate || null,
      sorter: (a, b) =>
        a.document.createdDate.length - b.document.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.document.createdDate.startsWith(value),

      render: (_, record) =>
        moment(record.document.createdDate).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language",
      key: "language",
      filters: Books.map((Books) => ({
        text: Books.document.language,
        value: Books.document.language,
      })),
      filteredValue: filteredInfo.language || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.document.language.startsWith(value),

      render: (_, record) => record.document.language,
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher",
      key: "publisher",
      filters: Books.map((Books) => ({
        text: Books.document.publisher,
        value: Books.document.publisher,
      })),
      filteredValue: filteredInfo.publisher || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.document.publisher.startsWith(value),

      render: (_, record) => record.document.publisher,
    },
    {
      title: "Năm phát hành",
      dataIndex: "publishYear",
      key: "publishYear",
      filters: Books.map((Books) => ({
        text: Books.document.publishYear,
        value: Books.document.publishYear,
      })),
      filteredValue: filteredInfo.publishYear || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.document.publishYear.startsWith(value),

      render: (_, record) => record.document.publishYear,
    },
    {
      title: "số lượt xem",
      dataIndex: "numberView",
      key: "numberView",
      filters: Books.map((Books) => ({
        text: Books.document.numberView,
        value: Books.document.numberView,
      })),
      filteredValue: filteredInfo.numberView || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.document.numberView.startsWith(value),

      render: (_, record) => record.document.numberView,
    },
    {
      title: "Lượt thích",
      dataIndex: "numberLike",
      key: "numberLike",
      render: (_, record) => record.document.numberLike,
    },
    {
      title: "Lượt không thích",
      dataIndex: "numberUnlike",
      key: "numberUnlike",

      render: (_, record) => record.document.numberUnlike,
    },
    {
      title: "Ngày sửa đổi",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      filters: Books.map((Books) => ({
        text: Books.document.modifiedDate,
        value: Books.document.modifiedDate,
      })),
      filteredValue: filteredInfo.modifiedDate || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.document.modifiedDate.startsWith(value),

      render: (_, record) =>
        moment(record.document.modifiedDate).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Bản vật lý",
      dataIndex: "isHavePhysicalVersion",
      key: "isHavePhysicalVersion",
      render: (_, record) => {
        return record.document.isHavePhysicalVersion ? (
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
      filters: Books.map((Books) => ({
        text: Books.document.author,
        value: Books.document.author,
      })),
      filteredValue: filteredInfo.author || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.document.author.startsWith(value),

      render: (_, record) => record.document.author,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      filters: Books.map((Books) => ({
        text: Books.document.description,
        value: Books.document.description,
      })),
      filteredValue: filteredInfo.description || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.document.description.startsWith(value),

      render: (_, record) => (
        <Tooltip title={record.document.description}>
          <Typography.Text>
            {record.document.description?.length > 22
              ? `${record.document.description?.slice(0, 22)}...`
              : record.document.description}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      filters: Books.map((Books) => ({
        text: Books.document.price,
        value: Books.document.price,
      })),
      filteredValue: filteredInfo.price || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.document.price.startsWith(value),

      render: (_, record) => record.document.price,
    },
    {
      title: "Avatar",
      dataIndex: "Avatar",
      key: "Avatar",
      render: (_, record) => (
        <Button
          type="default"
          onClick={(e) => {
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
              fileName: record.document.fileName,
              filePath: record.document.filePath,
              docName: record.document.docName,
            });
          }}
        >
          Xem nội dung
        </Button>
      ),
    },
    // {
    //   title: "Kiểm duyệt",
    //   dataIndex: "isApproved",
    //   key: "isApproved",
    //   filters: Books.map((Books) => ({
    //     text: Books.document.isApproved ? "Đã duyệt" : "Chưa duyệt",
    //     value: Books.document.isApproved,
    //   })),
    //   filteredValue: filteredInfo.isApproved || null,
    //   filterMode: "search",
    //   filterSearch: true,
    //   onFilter: (value, record) => record?.document?.isApproved === value,

    //   render: (_, record) => {
    //     return !record.document.isApproved ? (
    //       <Button
    //         type="primary"
    //         onClick={(e) => handleApproved(record.document.id)}
    //         loading={btnLoading}
    //       >
    //         Duyệt
    //       </Button>
    //     ) : (
    //       <Button
    //         type="danger"
    //         onClick={(e) => handleUnApproved(record.document.id)}
    //         loading={btnLoading}
    //       >
    //         Bỏ Duyệt
    //       </Button>
    //     );
    //   },
    // },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/danh-muc-bao/edit/${record.document.id}`);
              }}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDelete(record.document.id)}
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
            <Title level={5}>Quản lý sách báo tạp chí</Title>
            <Button type="Link">{location?.state?.categoryName}</Button>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={Books}
              onChange={handleChange}
              loading={loading}
              pagination={{
                showTotal: (total) => `Tổng có ${total} bản ghi`,
                defaultPageSize: 6,
              }}
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
    >
      <Card bordered={false} className="criclebox h-full">
        <div
          className="viewOnlineProductLayout Container"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "70vh",
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

export const MagazineByCategoryLayout = WithErrorBoundaryCustom(
  _MagazineByCategoryLayout,
);
