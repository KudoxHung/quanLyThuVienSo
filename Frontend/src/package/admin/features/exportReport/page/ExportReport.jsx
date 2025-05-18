import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { analyst } from "../../../api/analyst";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { schoolYear } from "../../../api/schoolYear";
import ThongKeMuonChiTietDonVi from "../../../asset/files/ThongKeMuonChiTietDonVi.docx";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import { WordViewer } from "../../WordViewer/WordViewer";
import {
  DownloadOutlined,
  FolderOpenOutlined,
  FundViewOutlined,
  NodeExpandOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Typography,
} from "antd";
import moment from "moment";
function _ExportReport() {
  const { _UnitId, _userTypeId, _fromDate, _toDate } = JSON.parse(
    localStorage.getItem("exportReportBorrowTypeUser"),
  ) || {
    _UnitId: null,
    _userTypeId: null,
    _fromDate: "Invalid date",
    _toDate: "Invalid date",
  };

  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(
    _fromDate === "Invalid date" ? null : moment(_fromDate),
  );
  const [toDate, setToDate] = useState(
    _toDate === "Invalid date" ? null : moment(_toDate),
  );

  const [userTypeId, setUserTypeId] = useState(_userTypeId);
  const [UnitId, setUnitId] = useState(_UnitId);

  const [Units, setUnits] = useState([]);
  const [UserTypes, setUserTypes] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [ContractAndIntroduction, setContractAndIntroduction] = useState([]);
  const [SchoollYear, setSchoollYear] = useState([]);
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
        onClick: () => handleExportExcel2(UnitId, userTypeId, fromDate, toDate),
      },
    ],
  };
  const handleCancelxx = () => {
    setIsModalVisiblex(false);
  };

  useEffect(() => {
    document.title = "Thống kê theo đơn vị";
    handleSearch(UnitId, userTypeId, fromDate, toDate);
  }, []);

  const handleExportExcel = (UnitId, userTypeId, fromDate, toDate) => {
    setBtnLoading(true);
    setLoadingButton(true);
    console.log(UnitId, userTypeId);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    if (UnitId === null) {
      UnitId = "00000000-0000-0000-0000-000000000000";
    }
    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .GetFileExcelAnalystListBorrowByUserType2(
        UnitId,
        userTypeId,
        _fromDate,
        _toDate,
      )
      .then((res) => {
        // setBtnLoading(false);
        // openNotificationWithIcon("success", "Xuất bảo cáo theo loại người dùng thành công");
        // const url = window.URL.createObjectURL(new Blob([res]));
        // const link = document.createElement("a");
        // link.href = url;
        // link.setAttribute("download", "Báo cáo theo loại người dùng.xlsx");
        // document.body.appendChild(link);
        // link.click();
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
        openNotificationWithIcon(
          "error",
          "Thông báo",
          "Có lỗi xảy ra, vui lòng thử lại!",
        );
        setLoadingButton(false);
      });
  };

  // bổ sung

  const handleExportExcel2 = (UnitId, userTypeId, fromDate, toDate) => {
    setBtnLoading(true);
    setLoadingButton(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    if (UnitId === null) {
      UnitId = "00000000-0000-0000-0000-000000000000";
    }
    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .GetFileExcelAnalystListBorrowByUserType(
        UnitId,
        userTypeId,
        _fromDate,
        _toDate,
      )
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "success",
          "Xuất bảo cáo theo loại người dùng thành công",
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Báo cáo theo loại người dùng.xlsx");
        document.body.appendChild(link);
        link.click();
        setLoadingButton(false);
      })
      .catch((err) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "error",
          "Thông báo",
          "Có lỗi xảy ra, vui lòng thử lại!",
        );
        setLoadingButton(false);
      });
  };

  const handleExportWord = (UnitId, userTypeId, fromDate, toDate) => {
    setBtnLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    if (UnitId === null) {
      UnitId = "00000000-0000-0000-0000-000000000000";
    }
    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .AnalystListBorrowByUserTypeAndUnit(
        UnitId,
        userTypeId,
        _fromDate,
        _toDate,
      )
      .then((res) => {
        res.UnitId =
          Units.find((x) => x.id === UnitId)?.unitName || "Tất cả đơn vị";
        res.userTypeId =
          UserTypes.find((x) => x.id === userTypeId)?.typeName === "HocSinh"
            ? "HỌC SINH"
            : "GIÁO VIÊN";
        res.schoolYear = `${moment(SchoollYear[0]?.startSemesterI).format("YYYY")} - ${moment(
          SchoollYear[0]?.startSemesterII,
        ).format("YYYY")}`;
        res.Contact = ContractAndIntroduction[0]?.col10;
        res.table = [
          ...res.map((item, index) => ({
            index: index + 1,
            nameUser: item.nameUser,
            fromDate: moment(item.fromDate).format("DD/MM/YYYY"),
            toDate: moment(item.toDate).format("DD/MM/YYYY"),
            nameDocument: item.nameDocument,
            numIndividual: item.numIndividual.split("/")[0],
            note: item.note ? item.note : "",
          })),
        ];
        generateDocument(ThongKeMuonChiTietDonVi, `Sổ mượn sách đơn vị`, res);
        openNotificationWithIcon(
          "success",
          "Xuất báo cáo sổ mượn sách đơn vị thành công",
        );
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Thông báo", "Xuất file thất bại!");
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const handleExportExcelGetFileExcelAnalystBorrowBookMonthly = async (
    values,
  ) => {
    try {
      const [fromDate, toDate] = values.timeRange;
      values.fromDate = moment(fromDate).format("DD/MM/YYYY");
      values.toDate = moment(toDate).format("DD/MM/YYYY");
      delete values.timeRange;
      const res = await analyst.GetFileExcelAnalystBorrowBookMonthly(values);
      const file = window.URL.createObjectURL(
        new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const a = document.createElement("a");
      a.href = file;
      a.download =
        "Thống kê số lượng và đối tượng mượn theo khoảng thời gian, thống kê cho tất cả loại người dùng giáo viên/học sinh/nhân viên theo phòng ban.xlsx";
      a.click();
      window.URL.revokeObjectURL(file);
    } catch (e) {
      openNotificationWithIcon("error", "Thông báo", "Xuất file thất bại!");
    }
  };
  const handleExportExcelGetFileExcelAnalystBorrowBookByQuarter = async (
    values,
  ) => {
    try {
      values.quarter = moment(values.time).quarter();
      values.year = moment(values.time).year();
      delete values.time;
      const res = await analyst.GetFileExcelAnalystBorrowBookByQuarter(values);
      const file = window.URL.createObjectURL(
        new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const a = document.createElement("a");
      a.href = file;
      a.download =
        "Thống kê số lượng mượn theo từng quý của tất cả phòng ban/lớp học và loại người dùng giáo viên/học sinh/nhân viên.xlsx";
      a.click();
      window.URL.revokeObjectURL(file);
    } catch (e) {
      openNotificationWithIcon("error", "Thông báo", "Xuất file thất bại!");
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  useEffect(() => {
    const fechingData = async () => {
      Promise.all([
        users
          .getAllUnit()
          .then((res) => {
            setUnits(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy đơn vị thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
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
    fechingData();
  }, []);

  const handleSearch = (UnitId, userTypeId, fromDate, toDate) => {
    setBtnLoading(true);
    setLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    if (UnitId === null) {
      UnitId = "00000000-0000-0000-0000-000000000000";
    }
    if (userTypeId === null) {
      userTypeId = "00000000-0000-0000-0000-000000000000";
    }
    analyst
      .AnalystListBorrowByUserType(UnitId, userTypeId, _fromDate, _toDate)
      .then((res) => {
        setData(res);
        localStorage.setItem(
          "exportReportBorrowTypeUser",
          JSON.stringify({
            _UnitId: UnitId,
            _userTypeId: userTypeId,
            _fromDate,
            _toDate,
          }),
        );
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thống kê thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
        setLoading(false);
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
      title: "Mã người dùng",
      dataIndex: "userCode",
      key: "userCode",
      filters: Data.map((item) => ({
        text: item.userCode,
        value: item.userCode,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.userCode || null,
      sorter: (a, b) => a.userCode.length - b.userCode.length,
      sortOrder: sortedInfo.columnKey === "userCode" ? sortedInfo.order : null,

      onFilter: (value, record) => record.userCode?.startsWith(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: Data.map((item) => ({
        text: item.email,
        value: item.email,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.email || null,
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,

      onFilter: (value, record) => record.email?.startsWith(value),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      filters: Data.map((item) => ({
        text: item.address,
        value: item.address,
      })),
      filterSearch: true,
      filteredValue: filteredInfo.address || null,
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      ellipsis: true,
      onFilter: (value, record) => record.address?.startsWith(value),
    },
    {
      title: "Thao tác",
      dataIndex: "idUnit",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              icon={<FundViewOutlined />}
              onClick={() => {
                navigate(
                  `/admin/xuat-bao-cao-chi-tiet/${record.idUnit}&${record.idUser}&${fromDate}&${toDate}`,
                );
              }}
            >
              Chi tiết
            </Button>
          </Space>
        );
      },
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
  console.log("value", UnitId);
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
                  handleExportExcel(UnitId, userTypeId, fromDate, toDate),
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
                  setFromDate(null);
                  setToDate(null);
                  setUserTypeId(null);
                  setUnitId(null);
                  handleSearch(
                    "00000000-0000-0000-0000-000000000000",
                    "00000000-0000-0000-0000-000000000000",
                    null,
                    null,
                  );
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
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                onChange={(value) => {
                  console.log("value", value);
                  setUnitId(value);
                }}
                value={UnitId}
                placeholder="Đơn vị"
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
                {Units.map((item) => (
                  <Option key={item?.id} value={item?.id}>
                    {item?.unitName}
                  </Option>
                ))}
              </Select>
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
                  handleSearch(UnitId, userTypeId, fromDate, toDate);
                }}
                loading={btnLoading}
              >
                Lọc
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
                  // handleExportExcel(UnitId, userTypeId, fromDate, toDate);
                  setIsModalVisiblex(true);
                }}
                style={{ background: "#327936" }}
                loading={btnLoading}
              >
                Xuất báo cáo
              </Button>
              {/*<Button*/}
              {/*  type="primary"*/}
              {/*  icon={[*/}
              {/*    <svg*/}
              {/*      className="icon"*/}
              {/*      viewBox="0 0 1024 1024"*/}
              {/*      version="1.1"*/}
              {/*      xmlns="http://www.w3.org/2000/svg"*/}
              {/*      width="20"*/}
              {/*      height="20"*/}
              {/*    >*/}
              {/*      <path*/}
              {/*        d="M535.119473 0h69.599248v95.247413C729.226717 96.331138 853.614299 93.92286 977.881468 96.331138a40.459078 40.459078 0 0 1 44.914393 45.516463c2.047037 234.566322 0 469.614299 1.204139 703.819379-1.204139 24.082785 2.287865 50.694262-11.318909 72.248354-16.978363 12.041392-38.893697 10.837253-58.761994 12.041392h-349.200376V1023.518344h-72.248354C354.980245 990.886171 177.490122 960.541863 0 928.752587V95.488241C178.33302 63.578551 356.786453 32.511759 535.119473 0z"*/}
              {/*        fill="#2A5699"*/}
              {/*      ></path>*/}
              {/*      <path*/}
              {/*        d="M604.718721 131.010348H988.598307v761.979304H604.718721v-95.247413h302.479774v-48.165569H604.718721v-59.002822h302.479774v-48.16557H604.718721v-59.002822h302.479774v-48.165569H604.718721v-60.206961h302.479774V428.673565H604.718721v-60.206961h302.479774v-46.96143H604.718721v-59.604892h302.479774V214.336783H604.718721zM240.827846 341.373471c22.156162-1.324553 44.19191-2.287865 66.348071-3.492003 15.533396 80.4365 31.30762 160.632173 48.165569 240.827845 13.125118-82.724365 27.695202-165.087488 41.783632-247.571025 23.239887-0.842897 46.479774-2.167451 69.719661-3.612418-26.370649 115.356538-49.369708 231.796802-78.148636 346.430856-19.386642 10.355597-48.165569 0-71.52587 1.204139C301.034807 596.169332 283.093133 517.779868 269.245532 438.667921c-13.606773 76.944497-31.30762 153.16651-46.841016 229.508937-22.39699-1.204139-44.793979-2.528692-67.311383-4.094073-19.266228-104.760113-42.024459-208.918156-60.206962-313.919097 19.868297-0.963311 39.857008-1.806209 60.206962-2.528693 12.041392 75.860771 25.648166 151.360301 36.124177 227.341487 16.135466-77.907808 32.873001-155.695202 49.610536-233.603011z"*/}
              {/*        fill="#FFFFFF"*/}
              {/*      ></path>*/}
              {/*    </svg>*/}
              {/*  ]}*/}
              {/*  onClick={(e) => {*/}
              {/*    handleExportWord(UnitId, userTypeId, fromDate, toDate);*/}
              {/*  }}*/}
              {/*  style={{ background: "#2A5699" }}*/}
              {/*  loading={btnLoading}*/}
              {/*>*/}
              {/*  Xuất báo cáo*/}
              {/*</Button>*/}
            </Space>
          </Card>
        </Spin>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Typography.Title level={5}>
            Danh sách bạn đọc mượn sách
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
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Typography.Title level={5}>
            Thống kê số lượng và đối tượng mượn theo khoảng thời gian
          </Typography.Title>
          <Form
            layout="horizontal"
            onFinish={handleExportExcelGetFileExcelAnalystBorrowBookMonthly}
          >
            <Space wrap>
              <Form.Item
                name={"timeRange"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn khoảng thời gian",
                  },
                ]}
              >
                <DatePicker.RangePicker format={"DD/MM/YYYY"} />
              </Form.Item>
              <Form.Item
                name={"idUnit"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn đơn vị",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Đơn vị"
                  optionFilterProp="label"
                  options={Units.map((item) => ({
                    label: item?.unitName,
                    value: item?.id,
                  }))}
                />
              </Form.Item>
              <Form.Item name={"idUserType"}>
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Loại người dùng"
                  optionFilterProp="label"
                  options={UserTypes.map((item) => ({
                    label: item?.typeName,
                    value: item?.id,
                  }))}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType={"submit"}
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
                  style={{ background: "#327936" }}
                  loading={btnLoading}
                >
                  Xuất báo cáo
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Typography.Title level={5}>
            Thống kê số lượng mượn theo từng quý
          </Typography.Title>
          <Form
            layout="horizontal"
            onFinish={handleExportExcelGetFileExcelAnalystBorrowBookByQuarter}
          >
            <Space wrap>
              <Form.Item
                name={"time"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian",
                  },
                ]}
              >
                <DatePicker.QuarterPicker />
              </Form.Item>
              <Form.Item
                name={"idsUnit"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn đơn vị",
                  },
                ]}
              >
                <Select
                  mode={"multiple"}
                  maxTagCount={"responsive"}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Danh sách đơn vị"
                  optionFilterProp="label"
                  options={Units.map((item) => ({
                    label: item?.unitName,
                    value: item?.id,
                  }))}
                />
              </Form.Item>
              <Form.Item name={"userType"}>
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Loại người dùng"
                  optionFilterProp="label"
                  options={UserTypes.map((item) => ({
                    label: item?.typeName,
                    value: item?.id,
                  }))}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType={"submit"}
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
                  style={{ background: "#327936" }}
                  loading={btnLoading}
                >
                  Xuất báo cáo
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export const ExportReport = WithErrorBoundaryCustom(_ExportReport);
