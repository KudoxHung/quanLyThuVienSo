import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { WordViewer } from "../../WordViewer/WordViewer";
import { ColumnChart, PieChart, RoseChart } from "../components";
import {
  DownloadOutlined,
  FolderOpenOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
function _StatisticsBorrowedUsers() {
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
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
        onClick: () => handleExportExcel2(),
      },
    ],
  };
  const handleCancelxx = () => {
    setIsModalVisiblex(false);
  };
  useEffect(() => {
    document.title = "Thống kê mượn người dùng";
  }, []);

  useEffect(() => {
    setLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    analyst
      .analystBorrowBookByType(_fromDate, _toDate)
      .then((res) => {
        setDatas(
          res.map((item) => ({
            name: item.userType,
            value: item.numberUserType,
          })),
        );
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thống kê mượn người dùng thất bại",
          err?.response?.data?.massege,
        );
        setLoading(false);
      });
  }, [fromDate, toDate]);

  const handleExportExcel = () => {
    setLoadingButton(true);
    setBtnLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    analyst
      .GetExceLAnalystBorowByUserType2(_fromDate, _toDate)
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
        openNotificationWithIcon(
          "error",
          "Lấy thống kê mượn quá hạn theo người dùng thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
        setLoadingButton(false);
      });
  };
  const handleExportExcel2 = () => {
    setLoadingButton(true);
    setBtnLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    analyst
      .GetExceLAnalystBorowByUserType(_fromDate, _toDate)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xuất báo cáo thống kê mượn quá hạn theo người dùng thành công",
          res?.message,
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          "Thống kê mượn quá hạn theo người dùng.xlsx",
        );
        document.body.appendChild(link);
        link.click();
        setBtnLoading(false);
        setLoadingButton(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thống kê mượn quá hạn theo người dùng thất bại",
          err?.response?.data?.message || err?.message,
        );
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
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Space direction="horizontal" size={24} style={{ width: "100%" }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={(e) => {
                    setFromDate(null);
                    setToDate(null);
                  }}
                >
                  Cài lại
                </Button>
                <DatePicker.RangePicker
                  placeholder={["Từ ngày", "Đến ngày"]}
                  format={["DD/MM/YYYY", "DD/MM/YYYY"]}
                  allowClear={false}
                  onChange={(value) => {
                    setFromDate(value[0]);
                    setToDate(value[1]);
                  }}
                  value={[fromDate, toDate]}
                />
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
                    setIsModalVisiblex(true);
                  }}
                  style={{ background: "#327936" }}
                  loading={btnLoading}
                >
                  Xuất báo cáo
                </Button>
              </Space>
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê số lần mượn theo loại người dùng (bánh)
              </Typography.Title>
              <PieChart data={datas} />
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê số lần mượn theo loại người dùng (Hoa)
              </Typography.Title>
              <RoseChart data={datas} />
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Spin spinning={loading}>
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Biểu đồ thống kê số lần mượn theo loại người dùng (Cột)
              </Typography.Title>
              <ColumnChart data={datas} />
            </Card>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export const StatisticsBorrowedUsers = WithErrorBoundaryCustom(
  _StatisticsBorrowedUsers,
);
