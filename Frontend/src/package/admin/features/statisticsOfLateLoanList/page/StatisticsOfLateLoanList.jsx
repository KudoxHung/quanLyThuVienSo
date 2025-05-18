import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { analyst } from "../../../api/analyst";
import { WordViewer } from "../../WordViewer/WordViewer";
import ThongKeMuonQuaHanTheoLoaiNguoiDung from "./../../../asset/files/ThongKeMuonQuaHanTheoLoaiNguoiDung.docx";
import {
  DownloadOutlined,
  FolderOpenOutlined,
  NodeExpandOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Typography,
} from "antd";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import moment from "moment";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
function _StatisticsOfLateLoanList() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [toDate, setToDate] = useState(null);
  const [userTypeId, setUserTypeId] = useState(null);
  const [UserTypes, setUserTypes] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [Data, setData] = useState([]);
  const { Option } = Select;
  const [fileUrl, setFileUrl] = useState("");
  const [isModalPDFVisible, setIsModalPDFVisible] = useState(false);
  const [isModalVisiblex, setIsModalVisiblex] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const handleCancelFrom1 = () => {
    setIsModalPDFVisible(false);
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
        onClick: () => handleExportExcel2(userTypeId, toDate),
      },
    ],
  };
  const handleCancelxx = () => {
    setIsModalVisiblex(false);
  };
  useEffect(() => {
    document.title = "Thống kê mượn quá hạn theo loại người dùng";
  }, []);

  const handleExportExcel = (userTypeId, toDate) => {
    setBtnLoading(true);
    setLoadingButton(true);
    const _toDate = moment(toDate).format("YYYY-MM-DD");

    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .GetFileExcelAnalystListBorrowLateByUserType2(userTypeId, _toDate)
      .then((res) => {
        if (res.success === true) {
          console.log("url", res.url);
          setFileUrl(res.url);
          setIsModalPDFVisible(true);
        }
        setLoadingButton(false);
        setBtnLoading(false);
      })
      .catch((err) => {
        setBtnLoading(false);
        setLoadingButton(false);
        openNotificationWithIcon(
          "error",
          "Thông báo",
          err?.response?.data?.message || err?.message,
        );
      });
  };
  const handleExportExcel2 = (userTypeId, toDate) => {
    setBtnLoading(true);
    setLoadingButton(true);
    const _toDate = moment(toDate).format("YYYY-MM-DD");

    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .GetFileExcelAnalystListBorrowLateByUserType(userTypeId, _toDate)
      .then((res) => {
        setBtnLoading(false);
        setLoadingButton(false);
        openNotificationWithIcon(
          "success",
          "Xuất báo cáo mượn quá hạn theo loại người dùng thành công",
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          "Báo cáo mượn quá hạn theo loại người dùng.xlsx",
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setBtnLoading(false);
        setLoadingButton(false);
        openNotificationWithIcon(
          "error",
          "Thông báo",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  const handleExportWord = (Data) => {
    setBtnLoading(true);
    const newData = {};
    newData.UserTypes =
      UserTypes.find((el) => el.id === userTypeId)?.typeName === "HocSinh"
        ? "HỌC SINH"
        : "GIÁO VIÊN";

    newData.toDate = toDate === null ? "" : moment(toDate).format("DD/MM/YYYY");
    Data.sort((a, b) => a.nameDocument.length - b.nameDocument.length);
    newData.table = [
      ...Data.map((item, index) => ({
        index: index + 1,
        nameUser: item.nameUser,
        nameUnit: item.nameUnit,
        numIndividual: item.numIndividual.split("/")[0],
        nameDocument: item.nameDocument,
        author: item.author,
        invoiceCode: item.invoiceCode,
        fromDate: moment(item.fromDate).format("DD/MM/YYYY"),
        toDate: moment(item.toDate).format("DD/MM/YYYY"),
        numberDayLate: item.numberDayLate,
      })),
    ];
    generateDocument(newData);
    openNotificationWithIcon(
      "success",
      "Xuất báo cáo mượn quá hạn theo loại người dùng thành công",
    );
    setBtnLoading(false);
  };
  const handleExportWord2 = (Data) => {
    setBtnLoading(true);
    const newData = {};
    newData.UserTypes =
      UserTypes.find((el) => el.id === userTypeId)?.typeName === "HocSinh"
        ? "HỌC SINH"
        : "GIÁO VIÊN";

    newData.toDate = toDate === null ? "" : moment(toDate).format("DD/MM/YYYY");
    Data.sort((a, b) => a.nameDocument.length - b.nameDocument.length);
    newData.table = [
      ...Data.map((item, index) => ({
        index: index + 1,
        nameUser: item.nameUser,
        nameUnit: item.nameUnit,
        numIndividual: item.numIndividual.split("/")[0],
        nameDocument: item.nameDocument,
        author: item.author,
        invoiceCode: item.invoiceCode,
        fromDate: moment(item.fromDate).format("DD/MM/YYYY"),
        toDate: moment(item.toDate).format("DD/MM/YYYY"),
        numberDayLate: item.numberDayLate,
      })),
    ];
    generateDocument(newData);
    openNotificationWithIcon(
      "success",
      "Xuất báo cáo mượn quá hạn theo loại người dùng thành công",
    );
    setBtnLoading(false);
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  useEffect(() => {
    const fechingData = async () => {
      Promise.all([
        users
          .getAllUserType()
          .then((res) => {
            setLoading(false);
            setUserTypes(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy loại tài khoản thất bại",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
      ]);
    };
    fechingData();
  }, []);

  const handleSearch = (userTypeId, toDate) => {
    setBtnLoading(true);
    setLoading(true);
    const _toDate = moment(toDate).format("YYYY-MM-DD");

    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .GetListBorrowLateByUserType(userTypeId, _toDate)
      .then((res) => {
        setData(res);
        setLoading(false);
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thống kê thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "nameUser",
      key: "nameUser",
      filters: Data.map((item) => ({
        text: item.nameUser,
        value: item.nameUser,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.nameUser || null,
      sorter: (a, b) => a.nameUser.length - b.nameUser.length,
      sortOrder: sortedInfo.columnKey === "nameUser" ? sortedInfo.order : null,

      onFilter: (value, record) => record.nameUser?.startsWith(value),
    },
    {
      title: "Đơn vị",
      dataIndex: "nameUnit",
      key: "nameUnit",
      filters: Data.map((item) => ({
        text: item.nameUnit,
        value: item.nameUnit,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.nameUnit || null,
      sorter: (a, b) => a.nameUnit.length - b.nameUnit.length,
      sortOrder: sortedInfo.columnKey === "nameUnit" ? sortedInfo.order : null,

      onFilter: (value, record) => record.nameUnit?.startsWith(value),
    },
    {
      title: "Số ĐKCB",
      dataIndex: "numIndividual",
      key: "numIndividual",
      filters: Data.map((item) => ({
        text: item.numIndividual.split("/")[0],
        value: item.numIndividual,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.numIndividual || null,
      sorter: (a, b) => a.numIndividual.length - b.numIndividual.length,
      sortOrder:
        sortedInfo.columnKey === "numIndividual" ? sortedInfo.order : null,
      onFilter: (value, record) => record.numIndividual?.startsWith(value),
      render: (text, record) => record.numIndividual.split("/")[0],
    },
    {
      title: "Nhan đề",
      dataIndex: "nameDocument",
      key: "nameDocument",
      filters: Data.map((item) => ({
        text: item.nameDocument,
        value: item.nameDocument,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.nameDocument || null,
      sorter: (a, b) => a.nameDocument.length - b.nameDocument.length,
      sortOrder:
        sortedInfo.columnKey === "nameDocument" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.nameDocument?.startsWith(value),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      filters: Data.map((item) => ({
        text: item.author,
        value: item.author,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.author || null,
      sorter: (a, b) => a.author.length - b.author.length,
      sortOrder: sortedInfo.columnKey === "author" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.author?.startsWith(value),
    },
    {
      title: "Phiếu mượn",
      dataIndex: "invoiceCode",
      key: "invoiceCode",
      filters: Data.map((item) => ({
        text: item.invoiceCode,
        value: item.invoiceCode,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.invoiceCode || null,
      sorter: (a, b) => a.invoiceCode.length - b.invoiceCode.length,
      sortOrder:
        sortedInfo.columnKey === "invoiceCode" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.invoiceCode?.startsWith(value),
    },
    {
      title: "Ngày mượn",
      dataIndex: "fromDate",
      key: "fromDate",
      filters: Data.map((item) => ({
        text: moment(item.fromDate).format("DD/MM/YYYY"),
        value: item.fromDate,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.fromDate || null,
      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
      sortOrder: sortedInfo.columnKey === "fromDate" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.fromDate?.startsWith(value),
      render: (text, record) => moment(record.fromDate).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày hẹn trả",
      dataIndex: "toDate",
      key: "toDate",
      filters: Data.map((item) => ({
        text: moment(item.toDate).format("DD/MM/YYYY"),
        value: item.toDate,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.toDate || null,
      sorter: (a, b) => a.toDate.length - b.toDate.length,
      sortOrder: sortedInfo.columnKey === "toDate" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.toDate?.startsWith(value),
      render: (text, record) => moment(record.toDate).format("DD/MM/YYYY"),
    },
    {
      title: "Số ngày quá hạn",
      dataIndex: "numberDayLate",
      key: "numberDayLate",
      filters: Data.map((item) => ({
        text: item.numberDayLate,
        value: item.numberDayLate,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.numberDayLate || null,
      sorter: (a, b) => a.numberDayLate.length - b.numberDayLate.length,
      sortOrder:
        sortedInfo.columnKey === "numberDayLate" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.numberDayLate === value,
    },
  ];
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
    <Row gutter={[24, 0]}>
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
              <div>
                {renderButtons("excel", () =>
                  handleExportExcel(userTypeId, toDate),
                )}
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        visible={isModalPDFVisible}
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
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Spin spinning={loading}>
          <Card bordered={false} className="criclebox h-full">
            <Space direction="horizontal" size={24} style={{ width: "100%" }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={(e) => {
                  setToDate(null);
                  setUserTypeId(null);

                  handleSearch("00000000-0000-0000-0000-000000000000", null);
                }}
              >
                Cài lại
              </Button>
              <DatePicker
                placeholder={"Đến ngày"}
                format={"DD/MM/YYYY"}
                allowClear={false}
                onChange={(value) => {
                  setToDate(value);
                }}
                value={toDate}
              />

              <Select
                showSearch
                style={{
                  width: 200,
                }}
                onChange={(value) => {
                  setUserTypeId(value);
                }}
                value={userTypeId}
                placeholder="Loại người dùng"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {UserTypes.map((item) => (
                  <Option key={item?.id} value={item?.id}>
                    {item?.typeName}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<NodeExpandOutlined />}
                onClick={(e) => {
                  handleSearch(userTypeId, toDate);
                }}
                loading={btnLoading}
              >
                Lọc
              </Button>
              <Button
                type="primary"
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
                      fill="#fff"
                    ></path>
                  </svg>,
                ]}
                onClick={(e) => {
                  // handleExportExcel(userTypeId, toDate);
                  setIsModalVisiblex(true);
                  console.log("aloo");
                }}
                style={{ background: "#327936" }}
                loading={btnLoading}
              >
                Xuất báo cáo
              </Button>
              <Button
                type="primary"
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
                      d="M535.119473 0h69.599248v95.247413C729.226717 96.331138 853.614299 93.92286 977.881468 96.331138a40.459078 40.459078 0 0 1 44.914393 45.516463c2.047037 234.566322 0 469.614299 1.204139 703.819379-1.204139 24.082785 2.287865 50.694262-11.318909 72.248354-16.978363 12.041392-38.893697 10.837253-58.761994 12.041392h-349.200376V1023.518344h-72.248354C354.980245 990.886171 177.490122 960.541863 0 928.752587V95.488241C178.33302 63.578551 356.786453 32.511759 535.119473 0z"
                      fill="#2A5699"
                    ></path>
                    <path
                      d="M604.718721 131.010348H988.598307v761.979304H604.718721v-95.247413h302.479774v-48.165569H604.718721v-59.002822h302.479774v-48.16557H604.718721v-59.002822h302.479774v-48.165569H604.718721v-60.206961h302.479774V428.673565H604.718721v-60.206961h302.479774v-46.96143H604.718721v-59.604892h302.479774V214.336783H604.718721zM240.827846 341.373471c22.156162-1.324553 44.19191-2.287865 66.348071-3.492003 15.533396 80.4365 31.30762 160.632173 48.165569 240.827845 13.125118-82.724365 27.695202-165.087488 41.783632-247.571025 23.239887-0.842897 46.479774-2.167451 69.719661-3.612418-26.370649 115.356538-49.369708 231.796802-78.148636 346.430856-19.386642 10.355597-48.165569 0-71.52587 1.204139C301.034807 596.169332 283.093133 517.779868 269.245532 438.667921c-13.606773 76.944497-31.30762 153.16651-46.841016 229.508937-22.39699-1.204139-44.793979-2.528692-67.311383-4.094073-19.266228-104.760113-42.024459-208.918156-60.206962-313.919097 19.868297-0.963311 39.857008-1.806209 60.206962-2.528693 12.041392 75.860771 25.648166 151.360301 36.124177 227.341487 16.135466-77.907808 32.873001-155.695202 49.610536-233.603011z"
                      fill="#FFFFFF"
                    ></path>
                  </svg>,
                ]}
                onClick={(e) => {
                  handleExportWord(Data);
                }}
                style={{ background: "#2A5699" }}
                loading={btnLoading}
              >
                Xuất báo cáo
              </Button>
            </Space>
          </Card>
        </Spin>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Typography.Title level={5}>
            Báo cáo mượn quá hạn theo loại người dùng
          </Typography.Title>

          <Table
            scroll={{
              x: window.screen.width,
            }}
            columns={columns.map((col) =>
              col.title !== "Thao tác"
                ? { ...col, ellipsis: true, width: 160 }
                : col,
            )}
            dataSource={Data}
            onChange={handleChange}
            loading={loading}
            pagination={{
              showTotal: (total, range) => `Tổng số: ${total} phiếu`,
              defaultPageSize: 6,
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
export const generateDocument = (data) => {
  loadFile(ThongKeMuonQuaHanTheoLoaiNguoiDung, function (error, content) {
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    var doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.setData(data);
    try {
      doc.render();
    } catch (error) {
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function (
            error,
            key,
          ) {
            error[key] = value[key];
            return error;
          }, {});
        }
        return value;
      }
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function (error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    var out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }); //Output the document using Data-URI
    saveAs(
      out,
      `Thống kê mượn quá hạn theo loại người dùng - ${data.toDate}.docx`,
    );
  });
};

export const StatisticsOfLateLoanList = WithErrorBoundaryCustom(
  _StatisticsOfLateLoanList,
);
