import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { dashboard } from "../../../api/dashboard";
import { reportBook } from "../../../api/reportBook";
import { ColumnChart } from "../../statisticsBorrowedUsers/components";
import { ColumnChartGroup4 } from "../components/ColumnChart";
import { ColumnChartGroup } from "../components/ColumnChart";
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
  TableColumnsType,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { upperCase } from "lodash";
import moment from "moment";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function _BookStatusTotal() {
  const { Title } = Typography;
  const [filteredInfo] = useState({});
  const [sortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [Books, setBooks] = useState([]);
  const [SchoolYear, setSchoolYear] = useState([]);
  const [SchoolGrade, setSchoolGrade] = useState([]);
  const [School, setSchool] = useState([]);
  const [totalDocument, setTotalDocument] = useState([]);
  const [remainDocument, setRemainDocument] = useState([]);
  const [borrowedDocument, setBorrowedDocument] = useState([]);
  const [lostDocument, setLostDocument] = useState([]);
  const [DataReport, setDataReport] = useState([]);

  const [btnLoading, setBtnLoading] = useState(false);

  //PDF GetAllSchoolGrade
  const [isModalPDFVisible, setIsModalPDFVisible] = useState(false);
  const [listPDF, setListPDF] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemSchoolYear, setselectedItemSchoolYear] = useState([]);
  const [selectedItemSchoolGrade, setselectedItemSchoolGrade] = useState([]);
  const [selectedItemSchool, setselectedItemSchool] = useState([]);
  const [DataColumnChartSchool, setDataColumnChartSchool] = useState([]);
  const [DataColumnChartSchoolGrade, setDataColumnChartSchoolGrade] = useState(
    [],
  );
  useEffect(() => {
    document.title = "Thống kê tình trạng sách";
  }, []);
  useEffect(() => {
    if (selectedItems.length > 0) {
      analyst.analystBookByDocumentType(selectedItems).then((res) => {
        setBooks(res);
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
    reportBook
      .GetAllSchoolYear()
      .then((res) => {
        setSchoolYear(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách Năm học thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    reportBook
      .GetAllSchoolGrade()
      .then((res) => {
        setSchoolGrade(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách Năm học thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    reportBook
      .GetAllSchoolByGradeId(selectedItemSchoolGrade)
      .then((res) => {
        setSchool(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách trường học thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedItemSchoolGrade]);

  const columns = [
    {
      title: "Tên trường",
      dataIndex: "name",
      key: "name",
      width: "35%",
      render: (text, record) =>
        record.name === "Tiểu Học"
          ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
          : text,
    },
    {
      title: "Đầu năm",
      dataIndex: "dauNam",
      key: "dauNam",
    },
    {
      title: "Rách nát",
      dataIndex: "rachNat",
      key: "rachNat",
    },
    {
      title: "Lạc hậu",
      dataIndex: "lacHau",
      key: "lacHau",
    },
    {
      title: "Mất",
      dataIndex: "mat",
      key: "mat",
    },
    {
      title: "Xuất sách",
      dataIndex: "xuatSach",
      key: "xuatSach",
    },
    {
      title: "Cuối năm ",
      dataIndex: "cuoiNam",
      key: "cuoiNam",
    },
  ];

  const SeachReportBookStatusTotal = () => {
    setLoading(true);

    var fillter = {
      GradeId: selectedItemSchoolGrade,
      SchoolId: selectedItemSchool,
    };
    if (selectedItemSchoolYear.length > 0) {
      fillter.YearId = selectedItemSchoolYear;
    }
    reportBook
      .SeachReportDetailTotal(fillter)
      .then((res) => {
        setDataReport(res);
        console.log("res", res);
        const tmp = [];
        res.forEach((item) => {
          item.children.forEach((itemSchool) => {
            tmp.push({
              school: itemSchool.name,
              status: "Rách nát",
              value: itemSchool.rachNat,
            });
            tmp.push({
              school: itemSchool.name,
              status: "Lạc hậu",
              value: itemSchool.lacHau,
            });
            tmp.push({
              school: itemSchool.name,
              status: "Mất",
              value: itemSchool.mat,
            });
            tmp.push({
              school: itemSchool.name,
              status: "Xuất sách",
              value: itemSchool.xuatSach,
            });
          });
        });
        console.log("tmp", tmp);
        setDataColumnChartSchool(tmp);
        const tmp2 = [];
        res.forEach((item) => {
          tmp2.push({
            school: item.name,
            status: "Rách nát",
            value: item.rachNat,
          });
          tmp2.push({
            school: item.name,
            status: "Lạc hậu",
            value: item.lacHau,
          });
          tmp2.push({ school: item.name, status: "Mất", value: item.mat });
          tmp2.push({
            school: item.name,
            status: "Xuất sách",
            value: item.xuatSach,
          });
        });
        setDataColumnChartSchoolGrade(tmp2);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thống kê sách thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const ExportExcelReport = () => {
    setBtnLoading(true);
    var fillter = {
      GradeId: selectedItemSchoolGrade,
      SchoolId: selectedItemSchool,
    };
    if (selectedItemSchoolYear.length > 0) {
      fillter.YearId = selectedItemSchoolYear;
    }
    reportBook
      .ExportExcelReportDetailTotal(fillter)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xuất báo cáo thống kê số lượng sách thành công",
          res?.message,
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Thống kê số lượng sách.xlsx");
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
      });
  };

  const handleExportExcel = () => {
    setBtnLoading(true);
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
      });
  };
  const data = [
    { school: "Trường A", status: "rách nát", value: 10 },
    { school: "Trường A", status: "lạc hậu", value: 5 },
    { school: "Trường A", status: "mất", value: 2 },
    { school: "Trường A", status: "xuất sách", value: 3 },
    { school: "Trường B", status: "rách nát", value: 8 },
    { school: "Trường B", status: "lạc hậu", value: 4 },
    { school: "Trường B", status: "mất", value: 1 },
    { school: "Trường B", status: "xuất sách", value: 7 },
    // Add more schools with their respective statuses and values
  ];
  const handleRunProcedure = async () => {
    try {
      // Gọi hàm runProcedure để thực thi API
      const response = await dashboard.runProcedure();
      console.log("response", response);
      // openNotificationWithIcon("success", "Thành công", response?.message);
      // Kiểm tra nếu response thành công
      if (response.success) {
        openNotificationWithIcon("success", "Thành công", response?.message);
      }
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có vấn đề
      openNotificationWithIcon(
        "error",
        "Thất bại",
        err?.response?.data?.message || err?.message,
      );
    }
  };
  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Button
              type="primary"
              onClick={handleRunProcedure}
              style={{ marginBottom: "16px" }}
              loading={loading}
            >
              Cập nhật
            </Button>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <Typography.Title level={5}>
                Thống kê tình trạng sách
              </Typography.Title>
            </Space>
            <Select
              showSearch
              placeholder="Năm học"
              value={selectedItemSchoolYear}
              onChange={(e) => {
                setselectedItemSchoolYear(e);
              }}
              style={{
                width: "25%",
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
              {SchoolYear.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.schoolYear}
                </Select.Option>
              ))}
            </Select>
            <Select
              mode={"multiple"}
              showSearch
              placeholder="Cấp học"
              value={selectedItemSchoolGrade}
              onChange={(e) => {
                setselectedItemSchoolGrade(e);
              }}
              style={{
                width: "25%",
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {SchoolGrade.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name.charAt(0).toUpperCase() +
                    item.name.slice(1).toLowerCase()}
                </Select.Option>
              ))}
            </Select>
            <Select
              mode={"multiple"}
              showSearch
              placeholder="Trường học"
              value={selectedItemSchool}
              onChange={(e) => {
                setselectedItemSchool(e);
              }}
              style={{
                width: "35%",
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {School.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              style={{
                width: "7%",
              }}
              onClick={() => {
                SeachReportBookStatusTotal();
              }}
            >
              Tìm kiếm
            </Button>
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
                ExportExcelReport();
              }}
              style={{ width: "8%", background: "#327936" }}
              loading={btnLoading}
            >
              Xuất báo cáo
            </Button>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác" ? { ...col, ellipsis: true } : col,
              )}
              dataSource={DataReport}
              loading={loading}
              pagination={{
                showTotal: (total, range) => `Tổng cộng ${total} trường`,
                defaultPageSize: 10,
              }}
            />
            <FilesPDFModal
              isModalPDFVisible={isModalPDFVisible}
              setIsModalPDFVisible={setIsModalPDFVisible}
              listPDF={listPDF}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={false}>
            <Card bordered={false} className="criclebox h-full">
              <Title level={5}>
                Thống kê tình trạng sách của{" "}
                <span style={{ color: "red", fontWeight: 700 }}>
                  các trường
                </span>
              </Title>
              <ColumnChartGroup4 data={DataColumnChartSchool} />
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin size="large" spinning={false}>
            <Card bordered={false} className="criclebox h-full">
              <Title level={5}>
                Thống kê tình trạng sách của{" "}
                <span style={{ color: "red", fontWeight: 700 }}>cấp học</span>
              </Title>
              <ColumnChartGroup4 data={DataColumnChartSchoolGrade} />
            </Card>
          </Spin>
        </Col>
        {/*<Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">*/}
        {/*  <Spin spinning={loading}>*/}
        {/*    <Card bordered={false} className="criclebox h-full">*/}
        {/*      <Typography.Title level={5}>*/}
        {/*        Biểu đồ thống kê <span style={{ color: "red", fontWeight: 700 }}>Số Bản</span>*/}
        {/*      </Typography.Title>*/}
        {/*      <ColumnChart data={totalDocument} />*/}
        {/*    </Card>*/}
        {/*  </Spin>*/}
        {/*</Col>*/}
        {/*<Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">*/}
        {/*  <Spin spinning={loading}>*/}
        {/*    <Card bordered={false} className="criclebox h-full">*/}
        {/*      <Typography.Title level={5}>*/}
        {/*        Biểu đồ thống kê <span style={{ color: "red", fontWeight: 700 }}>Đang còn</span>*/}
        {/*      </Typography.Title>*/}
        {/*      <ColumnChart data={remainDocument} />*/}
        {/*    </Card>*/}
        {/*  </Spin>*/}
        {/*</Col>*/}
        {/*<Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">*/}
        {/*  <Spin spinning={loading}>*/}
        {/*    <Card bordered={false} className="criclebox h-full">*/}
        {/*      <Typography.Title level={5}>*/}
        {/*        Biểu đồ thống kê <span style={{ color: "red", fontWeight: 700 }}>Chưa trả</span>*/}
        {/*      </Typography.Title>*/}
        {/*      <ColumnChart data={borrowedDocument} />*/}
        {/*    </Card>*/}
        {/*  </Spin>*/}
        {/*</Col>*/}
        {/*<Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">*/}
        {/*  <Spin spinning={loading}>*/}
        {/*    <Card bordered={false} className="criclebox h-full">*/}
        {/*      <Typography.Title level={5}>*/}
        {/*        Biểu đồ thống kê <span style={{ color: "red", fontWeight: 700 }}>Đã mất</span>*/}
        {/*      </Typography.Title>*/}
        {/*      <ColumnChart data={lostDocument} />*/}
        {/*    </Card>*/}
        {/*  </Spin>*/}
        {/*</Col>*/}
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

export const BookStatusTotal = WithErrorBoundaryCustom(_BookStatusTotal);
