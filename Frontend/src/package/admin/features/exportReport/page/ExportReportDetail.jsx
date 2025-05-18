import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { schoolYear } from "../../../api/schoolYear";
import { users } from "../../../api/users";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import ThongKeMuonChiTiet from "./../../../asset/files/ThongKeMuonChiTiet.doc";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import moment from "moment";
function _ExportReportDetail() {
  const param = useParams();
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [listData, setListData] = useState([]);
  const [UserType, setUserType] = useState([]);
  const [ContractAndIntroduction, setContractAndIntroduction] = useState([]);
  const [SchoollYear, setSchoollYear] = useState([]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  useEffect(() => {
    const fecthData = async () => {
      await Promise.all([
        users
          .getAllUserType()
          .then((res) => {
            setUserType(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lỗi", err?.message);
          }),
        ContactAndIntroduction.read(0, 0, 2)
          .then((res) => {
            setContractAndIntroduction(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lỗi", err?.message);
          }),
        schoolYear
          .getAll(0, 0)
          .then((res) => {
            setSchoollYear(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lỗi", err?.message);
          }),
      ]);
    };
    fecthData();
  }, []);
  useEffect(() => {
    setLoading(true);
    const _fromDate = moment(param.fromDate).format("YYYY-MM-DD");
    const _toDate = moment(param.toDate).format("YYYY-MM-DD");
    analyst
      .AnalystListBorrowByUserTypeDetail(
        param.IdUnit,
        param.IdUser,
        _fromDate,
        _toDate,
      )
      .then((res) => {
        setData(res);
        setListData([...res.listBorrowByUserIds]);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thông báo",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param]);

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "nameDocument",
      key: "nameDocument",
      filters: listData.map((item) => ({
        text: item.nameDocument,
        value: item.nameDocument,
      })),
      fixed: "left",
      filterSearch: true,
      filteredValue: filteredInfo.nameDocument || null,
      sorter: (a, b) => a.nameDocument.length - b.nameDocument.length,
      sortOrder:
        sortedInfo.columnKey === "nameDocument" ? sortedInfo.order : null,

      onFilter: (value, record) => record.nameDocument.startsWith(value),
    },
    {
      title: "Mã cá biệt",
      dataIndex: "numIndividual",
      key: "numIndividual",
      filters: listData.map((item) => ({
        text: item.numIndividual.split("/")[0],
        value: item.numIndividual,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.numIndividual || null,
      sorter: (a, b) => a.numIndividual.length - b.numIndividual.length,
      sortOrder:
        sortedInfo.columnKey === "numIndividual" ? sortedInfo.order : null,

      onFilter: (value, record) => record.numIndividual.startsWith(value),
      render: (text, record) => record.numIndividual.split("/")[0],
    },
    {
      title: "Từ ngày",
      dataIndex: "fromDate",
      key: "fromDate",
      filters: listData.map((item) => ({
        text: moment(item.fromDate).format("DD/MM/YYYY"),
        value: item.fromDate,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.fromDate || null,
      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
      sortOrder: sortedInfo.columnKey === "fromDate" ? sortedInfo.order : null,

      onFilter: (value, record) => record.fromDate.startsWith(value),
      render: (text, record) => moment(record.fromDate).format("DD/MM/YYYY"),
    },
    {
      title: "Đến ngày",
      dataIndex: "toDate",
      key: "toDate",
      filters: listData.map((item) => ({
        text: moment(item.toDate).format("DD/MM/YYYY"),
        value: item.toDate,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.toDate || null,
      sorter: (a, b) => a.toDate.length - b.toDate.length,
      sortOrder: sortedInfo.columnKey === "toDate" ? sortedInfo.order : null,

      onFilter: (value, record) => record.toDate.startsWith(value),
      render: (text, record) => moment(record.toDate).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày thực tế",
      dataIndex: "dateReality",
      key: "dateReality",
      filters: listData.map((item) => ({
        text:
          item.dateReality !== null
            ? moment(item.dateReality).format("DD/MM/YYYY")
            : "",
        value: item.dateReality,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.dateReality || null,
      sorter: (a, b) => a.dateReality.length - b.dateReality.length,
      sortOrder:
        sortedInfo.columnKey === "dateReality" ? sortedInfo.order : null,

      onFilter: (value, record) => record.dateReality.startsWith(value),
      render: (text, record) =>
        record.dateReality !== null
          ? moment(record.dateReality).format("DD/MM/YYYY")
          : "",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      filters: listData.map((item) => ({
        text: item.note,
        value: item.note,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.note || null,
      sorter: (a, b) => a.note.length - b.note.length,
      sortOrder: sortedInfo.columnKey === "note" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.note.startsWith(value),
    },
  ];

  const handleExportExcel = (IdUnit, IdUser, fromDate, toDate) => {
    setBtnLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    analyst
      .GetFileExcelAnalystListBorrowByUserTypeDetail(
        IdUnit,
        IdUser,
        _fromDate,
        _toDate,
      )
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "success",
          "Xuất báo cáo chi tiết theo loại người dùng thành công",
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          "Báo cáo chi tiết theo loại người dùng.xlsx",
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thông báo",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };

  const handleExportWord = (data) => {
    setBtnLoading(true);

    data.listBorrowByUserIds.sort(
      (a, b) => a.nameDocument.length - b.nameDocument.length,
    );
    data.userType = UserType.find((el) => el.id === data.idUserType)?.typeName;
    data.schoolYear = `${moment(SchoollYear[0]?.startSemesterI).format("YYYY")} - ${moment(
      SchoollYear[0]?.startSemesterII,
    ).format("YYYY")}`;
    data.Contact = ContractAndIntroduction[0]?.col10;
    data.userType = data.userType === "HocSinh" ? "HỌC SINH" : "GIÁO VIÊN";
    data.table = [
      ...data.listBorrowByUserIds.map((item, index) => ({
        index: index + 1,
        numIndividual: item.numIndividual.split("/")[0],
        fromDate: moment(item.fromDate).format("DD/MM/YYYY"),
        toDate: moment(item.toDate).format("DD/MM/YYYY"),
        note: item.note !== null ? item.note : "",
        nameDocument: item.nameDocument,
      })),
    ];
    generateDocument(ThongKeMuonChiTiet, `SoMuonSachNguoiDung`, data);
    openNotificationWithIcon("success", "Thông báo", "Xuất file thành công!");
    setBtnLoading(false);
  };

  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Spin spinning={loading}>
          <Card bordered={false} className="criclebox h-full">
            <Descriptions
              title="Thông tin"
              layout="horizontal"
              extra={
                <Space>
                  <Button
                    type="default"
                    icon={[
                      <svg
                        t="1664156148462"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1709"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z"
                          p-id="1710"
                        ></path>
                      </svg>,
                    ]}
                    onClick={() => navigate("/admin/xuat-bao-cao")}
                  >
                    Quay lại
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
                      handleExportExcel(
                        param.IdUnit,
                        param.IdUser,
                        param.fromDate,
                        param.toDate,
                      );
                    }}
                    style={{ background: "#327936" }}
                    loading={btnLoading}
                  >
                    Xuất báo cáo chi tiết
                  </Button>
                  {/*<Button*/}
                  {/*  type="primary"*/}
                  {/*  icon={[*/}
                  {/*    <svg*/}
                  {/*      t="1661913584779"*/}
                  {/*      className="icon"*/}
                  {/*      viewBox="0 0 1024 1024"*/}
                  {/*      version="1.1"*/}
                  {/*      xmlns="http://www.w3.org/2000/svg"*/}
                  {/*      p-id="1731"*/}
                  {/*      width="20"*/}
                  {/*      height="20"*/}
                  {/*    >*/}
                  {/*      <path*/}
                  {/*        d="M535.119473 0h69.599248v95.247413C729.226717 96.331138 853.614299 93.92286 977.881468 96.331138a40.459078 40.459078 0 0 1 44.914393 45.516463c2.047037 234.566322 0 469.614299 1.204139 703.819379-1.204139 24.082785 2.287865 50.694262-11.318909 72.248354-16.978363 12.041392-38.893697 10.837253-58.761994 12.041392h-349.200376V1023.518344h-72.248354C354.980245 990.886171 177.490122 960.541863 0 928.752587V95.488241C178.33302 63.578551 356.786453 32.511759 535.119473 0z"*/}
                  {/*        fill="#2A5699"*/}
                  {/*        p-id="1732"*/}
                  {/*      ></path>*/}
                  {/*      <path*/}
                  {/*        d="M604.718721 131.010348H988.598307v761.979304H604.718721v-95.247413h302.479774v-48.165569H604.718721v-59.002822h302.479774v-48.16557H604.718721v-59.002822h302.479774v-48.165569H604.718721v-60.206961h302.479774V428.673565H604.718721v-60.206961h302.479774v-46.96143H604.718721v-59.604892h302.479774V214.336783H604.718721zM240.827846 341.373471c22.156162-1.324553 44.19191-2.287865 66.348071-3.492003 15.533396 80.4365 31.30762 160.632173 48.165569 240.827845 13.125118-82.724365 27.695202-165.087488 41.783632-247.571025 23.239887-0.842897 46.479774-2.167451 69.719661-3.612418-26.370649 115.356538-49.369708 231.796802-78.148636 346.430856-19.386642 10.355597-48.165569 0-71.52587 1.204139C301.034807 596.169332 283.093133 517.779868 269.245532 438.667921c-13.606773 76.944497-31.30762 153.16651-46.841016 229.508937-22.39699-1.204139-44.793979-2.528692-67.311383-4.094073-19.266228-104.760113-42.024459-208.918156-60.206962-313.919097 19.868297-0.963311 39.857008-1.806209 60.206962-2.528693 12.041392 75.860771 25.648166 151.360301 36.124177 227.341487 16.135466-77.907808 32.873001-155.695202 49.610536-233.603011z"*/}
                  {/*        fill="#FFFFFF"*/}
                  {/*        p-id="1733"*/}
                  {/*      ></path>*/}
                  {/*    </svg>,*/}
                  {/*  ]}*/}
                  {/*  onClick={(e) => {*/}
                  {/*    handleExportWord(data);*/}
                  {/*  }}*/}
                  {/*  style={{ background: "#2A5699" }}*/}
                  {/*  loading={btnLoading}*/}
                  {/*>*/}
                  {/*  Xuất báo cáo*/}
                  {/*</Button>*/}
                </Space>
              }
            >
              <Descriptions.Item label="Người dùng">
                {data?.nameUser}
              </Descriptions.Item>
              <Descriptions.Item label="Mã người dùng">
                {data?.userCode}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
              <Descriptions.Item label="Đơn vị">
                {data?.nameUnit}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {data?.address}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Spin>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Spin spinning={loading}>
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={5}>Chi tiết báo cáo</Typography.Title>

            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={listData}
              onChange={handleChange}
              loading={loading}
              pagination={{
                showTotal: (total, range) => `Tổng số: ${total} phiếu`,
                defaultPageSize: 6,
              }}
            />
          </Card>
        </Spin>
      </Col>
    </Row>
  );
}

export const ExportReportDetail = WithErrorBoundaryCustom(_ExportReportDetail);
