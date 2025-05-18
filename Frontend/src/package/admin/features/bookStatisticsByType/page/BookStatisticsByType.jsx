import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { categorySignParents } from "../../../api/categorySignParents";
import { documentType } from "../../../api/documentType";
import { individualSample } from "../../../api/individualSample";
import { ColumnChart } from "../../statisticsBorrowedUsers/components";
import { WordViewer } from "../../WordViewer/WordViewer";
import {
  DownloadOutlined,
  FolderOpenOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
//view PDF
import { SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const { TabPane } = Tabs;
function _BookStatisticsByType() {
  // const [filteredInfo] = useState({});
  // const [sortedInfo] = useState({});

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [Books, setBooks] = useState([]);
  const [DocumentType, setDocumentType] = useState([]);
  const [totalDocument, setTotalDocument] = useState([]);
  const [remainDocument, setRemainDocument] = useState([]);
  const [borrowedDocument, setBorrowedDocument] = useState([]);
  const [lostDocument, setLostDocument] = useState([]);
  const [IndividualSample, setIndividualSample] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  //PDF
  const [isModalPDFVisible, setIsModalPDFVisible] = useState(false);
  const [listPDF, setListPDF] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inDocument, setIdDocument] = useState([]);
  const [price, setPrice] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [isModalVisiblex, setIsModalVisiblex] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isModalPDFVisiblex, setIsModalPDFVisiblex] = useState(false);
  const handleCancelFrom1 = () => {
    setIsModalPDFVisiblex(false);
  };
  const { TabPane } = Tabs;
  const buttonData = {
    word: [
      { id: 1, numberTemplate: 1, label: "Word - Mẫu 1 - Cán Bộ" },
      {
        id: 2,
        numberTemplate: 2,
        label: "Word Mẫu 2 - Word Công Chức - không phải là lãnh đạo",
      },
      {
        id: 3,
        numberTemplate: 3,
        label: "Word Mẫu 3 - Công Chức - Là lãnh đạo",
      },
      {
        id: 4,
        numberTemplate: 4,
        label: "Word Mẫu 4 - Viên Chức - không phải là lãnh đạo",
      },
      {
        id: 5,
        numberTemplate: 5,
        label: "Word Mẫu 5 - Viên Chức - Là lãnh đạo",
      },
    ],
    pdf: [
      { id: 6, numberTemplate: 6, label: "PDF - Bảng điểm cá nhân - Có ký số" },
      // { id: 7, numberTemplate: 1, label: "PDF - Mẫu 1 - Cán Bộ - Có ký số" },
      // { id: 8, numberTemplate: 2, label: "PDF - Mẫu 2 - Word Công Chức - Không phải là lãnh đạo - Có ký số" },
      // { id: 9, numberTemplate: 3, label: "PDF - Mẫu 3 - Công Chức - Là lãnh đạo - Có ký số" },
      // { id: 10, numberTemplate: 4, label: "PDF - Mẫu 4 - Viên Chức - không phải là lãnh đạo - Có ký số" },
      // { id: 11, numberTemplate: 5, label: "PDF - Mẫu 5 - Viên Chức - Là lãnh đạo - Có ký số" }
    ],
    excel: [
      { id: 12, numberTemplate: 1, label: "Xem trước - Excel - Xuất báo cáo" },
      {
        id: 13,
        numberTemplate: 2,
        label: "Tải về - Excel - Xuất báo cáo",
        onClick: () => handleExportExcel2(),
      },
    ],
  };
  const handleCancelxx = () => {
    setIsModalVisiblex(false);
  };
  useEffect(() => {
    document.title = "Thống kê sách theo loại";
  }, []);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setLoading(true);
      analyst.analystBookByDocumentType(selectedItems).then((res) => {
        setBooks(res);
        console.log(res);
        res.map((item) => {
          setIdDocument(item.document.id);
        });
        setTotalDocument(
          res.map((item) => ({
            name: item.document.docName,
            value: item.totalDocument,
          })),
        );
        setRemainDocument(
          res.map((item) => ({
            name: item.document.docName,
            value: item.remainDocument,
          })),
        );
        setBorrowedDocument(
          res.map((item) => ({
            name: item.document.docName,
            value: item.borrowedDocument,
          })),
        );
        setLostDocument(
          res.map((item) => ({
            name: item.document.docName,
            value: item.lostDocument,
          })),
        );
        setLoading(false);
      });
    }
  }, [selectedItems]);
  useEffect(() => {
    documentType
      .getAllNotPage(1)
      .then((res) => {
        setDocumentType(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách loại tài liệu thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // useEffect(() => {
  //   console.log(inDocument);
  //   if (inDocument) {
  //     individualSample
  //       .getByIdDocument(inDocument)
  //       .then((res) => {
  //         setPrice(res);
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         openNotificationWithIcon(
  //           "error",
  //           "Lấy danh sách kí hiệu phân loại thất bại",
  //           err?.response?.data?.message || err?.message
  //         );
  //       });
  //   }
  // }, []);
  //
  const handleChange = (pagination, filters, sorter) => {
    console.log(filters);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
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
      onFilter: (value, record) => record.document.docName?.startsWith(value),

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
        record.document.createdDate?.startsWith(value),

      render: (_, record) =>
        moment(record.document.createdDate).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Số bản",
      dataIndex: "totalDocument",
      key: "totalDocument",
      filters: Books.map((Books) => ({
        text: Books.totalDocument,
        value: Books.totalDocument,
      })),
      filteredValue: filteredInfo.totalDocument || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.totalDocument === value,

      render: (_, record) => record.totalDocument,
    },
    {
      title: "Đang còn",
      dataIndex: "remainDocument",
      key: "remainDocument",
      filters: Books.map((Books) => ({
        text: Books.remainDocument,
        value: Books.remainDocument,
      })),
      filteredValue: filteredInfo.remainDocument || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.remainDocument === value,

      render: (_, record) => record.remainDocument,
    },
    {
      title: "Chưa trả",
      dataIndex: "borrowedDocument",
      key: "borrowedDocument",
      filters: Books.map((Books) => ({
        text: Books.borrowedDocument,
        value: Books.borrowedDocument,
      })),
      filteredValue: filteredInfo.borrowedDocument || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.borrowedDocument === value,

      render: (_, record) => record.borrowedDocument,
    },
    {
      title: "Đã mất",
      dataIndex: "lostDocument",
      key: "lostDocument",
      filters: Books.map((Books) => ({
        text: Books.lostDocument,
        value: Books.lostDocument,
      })),
      filteredValue: filteredInfo.lostDocument || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.lostDocument === value,

      render: (_, record) => record.lostDocument,
    },
    {
      title: "Bản vật lý",
      dataIndex: "isHavePhysicalVersion",
      key: "isHavePhysicalVersion",
      filters: Books.map((Books) => ({
        text: Books.document.modifiedDate,
        value: Books.document.isHavePhysicalVersion,
      })),
      filteredValue: filteredInfo.isHavePhysicalVersion || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.document.isHavePhysicalVersion?.startsWith(value),

      render: (_, record) => {
        return record.document.isHavePhysicalVersion ? (
          <Tag color={"success"}>Có</Tag>
        ) : (
          <Tag color={"red"}>Không</Tag>
        );
      },
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
      onFilter: (value, record) => record.document.language?.startsWith(value),

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
      onFilter: (value, record) => record.document.publisher?.startsWith(value),

      render: (_, record) => record.document.publisher,
    },
    {
      title: "Năm xuất bản",
      dataIndex: "publishYear",
      key: "publishYear",
      filters: Books.map((Books) => ({
        text: Books.document.publishYear
          ? moment(Books.document.publishYear).format("YYYY")
          : "",
        value: Books.document.publishYear,
      })),
      filteredValue: filteredInfo.publishYear || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) =>
        record.document.publishYear?.startsWith(value),

      render: (_, record) =>
        record.document.publishYear
          ? moment(record.document.publishYear).format("YYYY")
          : "",
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
      onFilter: (value, record) => record.document.numberView === value,

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
      render: (_, record) => record.document.author,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
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
      render: (_, record) => record.document.price,
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
  ];

  const handleExportExcel = () => {
    setBtnLoading(true);
    setLoadingButton(true);
    analyst
      .GetExceLAnalystByDocumentType2(selectedItems)
      .then((res) => {
        // openNotificationWithIcon("success", "Xuất báo cáo thống kê sách theo loại thành công", res?.message);
        // const url = window.URL.createObjectURL(new Blob([res]));
        // const link = document.createElement("a");
        // link.href = url;
        // link.setAttribute("download", "Thống kê sách theo loại.xlsx");
        // document.body.appendChild(link);
        // link.click();
        if (res.success === true) {
          console.log("url", res.url);
          setFileUrl(res.url);
          setIsModalPDFVisiblex(true);
        }
        setLoadingButton(false);
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "GetExceLAnalystBorowLateByUserType error",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
        setLoadingButton(false);
      });
  };
  const handleExportExcel2 = () => {
    setBtnLoading(true);
    setLoadingButton(true);
    analyst
      .GetExceLAnalystByDocumentType(selectedItems)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xuất báo cáo thống kê sách theo loại thành công",
          res?.message,
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Thống kê sách theo loại.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "GetExceLAnalystBorowLateByUserType error",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
        setLoadingButton(false);
      });
  };
  const renderButtons = (type, downloadFunction) => {
    return buttonData[type].map((button) => (
      <Button
        key={button.id}
        type="link"
        icon={
          button.label.includes("Tải về") ? (
            <DownloadOutlined />
          ) : (
            <FolderOpenOutlined />
          )
        }
        style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        onClick={
          button.label.includes("Tải về") === false
            ? () => downloadFunction(button.numberTemplate)
            : button.onClick
        }
      >
        {button.label}
      </Button>
    ));
  };
  return (
    <div className="layout-content">
      <Modal
        title="Xem trước và Tải về"
        visible={isModalVisiblex}
        onCancel={handleCancelxx}
        cancelText={"Hủy"}
        footer={null}
      >
        {/* <p>Xem trước khi xuất</p> */}
        <Tabs defaultActiveKey="1">
          {/* Tab Word */}
          {/* <TabPane tab="Word" key="1">
                  {loadingButton ? (
                    <div style={{ textAlign: "center" }}>
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div>{renderButtons("word", downloadWordFile)}</div>
                  )}
                </TabPane> */}

          {/* Tab PDF */}
          {/* <TabPane tab="PDF" key="2">
                  {loadingButton ? (
                    <div style={{ textAlign: "center" }}>
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div>{renderButtons("pdf", downloadPDFFile)}</div>
                  )}
                </TabPane> */}

          {/* Tab Excel */}
          <TabPane tab="Excel" key="3">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("excel", handleExportExcel)}</div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        visible={isModalPDFVisiblex}
        //visible={props.isModalPDFVisible}
        title={`Nội dung`}
        //footer={null}
        //onCancel={() => props.setIsModalPDFVisible(false)}
        onCancel={handleCancelFrom1}
        onOk={handleCancelFrom1}
        width={1000}
      >
        <Card bordered={false} className="criclebox h-full">
          <div className="viewOnlineProductLayout Container">
            <WordViewer fileUrl={fileUrl} />
          </div>
        </Card>
      </Modal>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <Typography.Title level={5}>
                Biểu đồ thống kê số theo loại
              </Typography.Title>
              <Button
                type="primary"
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
                      fill="#fff"
                      p-id="8532"
                    ></path>
                  </svg>,
                ]}
                onClick={(e) => {
                  // handleExportExcel();
                  setIsModalVisiblex(true);
                }}
                style={{ background: "#327936" }}
                loading={btnLoading}
              >
                Xuất báo cáo
              </Button>
            </Space>
            <Select
              loading={loading}
              showSearch
              placeholder="Loại sách"
              value={selectedItems}
              onChange={(e) => {
                setSelectedItems(e);
              }}
              style={{
                width: "30%",
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Select.Option
                key={"00000000-0000-0000-0000-000000000000"}
                value={"00000000-0000-0000-0000-000000000000"}
                label={"Tất cả"}
              >
                Tất cả
              </Select.Option>
              {DocumentType.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.docTypeName}
                </Select.Option>
              ))}
            </Select>

            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={Books}
              loading={loading}
              onChange={handleChange}
              pagination={{
                showTotal: (total, range) => `Tổng cộng ${total} bản ghi`,
                defaultPageSize: 6,
              }}
            />
            <FilesPDFModal
              isModalPDFVisible={isModalPDFVisible}
              setIsModalPDFVisible={setIsModalPDFVisible}
              listPDF={listPDF}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê{" "}
                <span style={{ color: "red", fontWeight: 700 }}>Số Bản</span>
              </Typography.Title>
              <ColumnChart data={totalDocument} />
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê{" "}
                <span style={{ color: "red", fontWeight: 700 }}>Đang còn</span>
              </Typography.Title>
              <ColumnChart data={remainDocument} />
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê{" "}
                <span style={{ color: "red", fontWeight: 700 }}>Chưa trả</span>
              </Typography.Title>
              <ColumnChart data={borrowedDocument} />
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê{" "}
                <span style={{ color: "red", fontWeight: 700 }}>Đã mất</span>
              </Typography.Title>
              <ColumnChart data={lostDocument} />
            </Card>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

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

export const BookStatisticsByType = WithErrorBoundaryCustom(
  _BookStatisticsByType,
);
