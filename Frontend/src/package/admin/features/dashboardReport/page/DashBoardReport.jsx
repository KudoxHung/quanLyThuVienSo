import React, { useEffect, useMemo, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { CalculateFolderApis } from "../../../api/calculateFolderApis";
import { dashboard } from "../../../api/dashboard";
import { reportBook } from "../../../api/reportBook";
import CompanyIntroduction from "../../../components/companyIntroduction/CompanyIntroduction";
import { BarCharts } from "../components/BarCharts";
import { ColumnChart, ColumnChartGroup } from "../components/ColumnChart";
import { PieCharts } from "../components/PieCharts";
import { ProgressChart } from "../components/ProgressChart";
import { RingProgressChart } from "../components/RingProgressChart";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Table,
  Typography,
} from "antd";

import "./BookStatusGrid.css";
export function _DashBoardReport() {
  const { Title } = Typography;
  const [NumberDocumentByType, setNumberDocumentByType] = useState([]);
  // const [Books, setBooks] = useState([]);
  const [NumberUserByType, setNumberUserByType] = useState([]);

  const [SchoolYear, setSchoolYear] = useState([]);
  const [DataColunmPaperBookDigitalBook, setDataColunmPaperBookDigitalBook] =
    useState([]);
  const [DataColunmAllDocumentType, setDataColunmAllDocumentType] = useState(
    [],
  );
  const [selectedItemSchoolYear, setselectedItemSchoolYear] = useState(
    "00000000-0000-0000-0000-000000000000",
  );
  const [AnalystUserAndBook, setAnalystUserAndBook] = useState({
    userAnalyst: {
      numberUserCurrentMonth: 11,
      numberUserLastMonth: 1,
      currentMonth: 7,
      lastMonth: 6,
      percentDifference: 10.99,
    },
    totalser: {
      totalUser: 12,
    },
    bookBorrowAnalyst: {
      totalBorrowBookCurrentMonth: 1,
      totalBorrowBookLastMonth: 1,
      currentMonth: 7,
      lastMonth: 6,
      percentDifference: 0.99,
    },
    bookBackAnalyst: {
      totalBookBackCurrentMonth: 0,
      totalBookBackLastMonth: 1,
      currentMonth: 7,
      lastMonth: 6,
      percentDifference: -0.01,
    },
  });

  const [LoadingAnalystUserAndBook, setLoadingAnalystUserAndBook] =
    useState(true);
  // const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingNumberUserByType, setLoadingNumberUserByType] = useState(true);
  const [loadingNumberDocumentByType, setLoadingNumberDocumentByType] =
    useState(true);

  const [CalculateFolder, setCalculateFolder] = useState({});
  const [loadingCalculateFolder, setLoadingCalculateFolder] = useState(true);
  const [StatisticPaperBookDigitalBook, setStatisticPaperBookDigitalBook] =
    useState([]);

  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingChart2, setLoadingChart2] = useState(true);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    document.title = "Trang quản trị";
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        CalculateFolderApis.CalculateFolder()
          .then((res) => {
            setCalculateFolder(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh thông tin lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setLoadingCalculateFolder(false);
          }),
        analyst
          .getDocumentByType()
          .then((res) => {
            setNumberDocumentByType(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setLoadingNumberDocumentByType(false);
          }),
        analyst
          .getNumberUserByType()
          .then((res) => {
            setNumberUserByType(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setLoadingNumberUserByType(false);
          }),
        analyst
          .analystUserAndBook()
          .then((res) => {
            setAnalystUserAndBook(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => {
            setLoadingAnalystUserAndBook(false);
          }),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    reportBook
      .GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool(
        selectedItemSchoolYear,
      )
      .then((res) => {
        const DataColunmPaperBookDigitalBookTmp = [];
        res.map((item) => {
          DataColunmPaperBookDigitalBookTmp.push({
            school: item.schoolName,
            type: "Sách giấy",
            value: item.paperBooksCount,
          });
          // DataColunmPaperBookDigitalBookTmp.push({
          //   school: item.schoolName,
          //   type: "Sách số",
          //   value: item.digitalBooksCount
          // });
        });
        setDataColunmPaperBookDigitalBook(DataColunmPaperBookDigitalBookTmp);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Dữ liệu đang được lấy ra vui lòng chờ trong giây lát",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoadingChart2(false);
      });
    reportBook
      .GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear(
        selectedItemSchoolYear,
      )
      .then((res) => {
        let totalBooks = 0;
        let tmp = res.map((item, index) => {
          const docTypeName = item.doctypeName.toString().toLowerCase();
          if (
            docTypeName === "sách giáo khoa" ||
            docTypeName === "sách tham khảo" ||
            docTypeName === "sách nghiệp vụ" ||
            docTypeName === "sách thiếu nhi"
          ) {
            return { type: item.doctypeName, value: item.totalBooks };
          } else {
            totalBooks += item.totalBooks;
          }
        });
        tmp.push({ type: "Sách khác", value: totalBooks });
        tmp = tmp.filter((item) => item !== undefined);
        console.log(tmp);
        setDataColunmAllDocumentType(tmp);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoadingChart(false);
      });
    reportBook
      .GetStatisticsOfBookConditionBySchoolYear(selectedItemSchoolYear)
      .then((res) => {
        console.log(res);
        const tmp = {
          startOfYear: 0,
          endOfYear: 0,
          damaged: 0,
          outdated: 0,
          lost: 0,
          removed: 0,
        };
        let totalBooksStartYear = 0;
        let totalBooksEndYear = 0;
        let totalBooksLost = 0;
        res.forEach((item) => {
          // Skip if statusName is null, undefined, or an empty string
          if (
            !item.statusName ||
            item.statusName.toString().trim().toLowerCase() === "null"
          )
            return;

          // Set the default values for tmp object
          tmp.startOfYear = item.totalBooksStartYear;
          tmp.endOfYear = item.totalBooksEndYear;
          tmp.lost = item.totalBooksLost;
          console.log("tmp", tmp);
          // Handle different status names
          const statusName = item.statusName.toString().trim().toLowerCase();
          switch (statusName) {
            case "rách nát":
              tmp.damaged = item.totalBooks;
              break;
            case "lạc hậu":
              tmp.outdated = item.totalBooks;
              break;
            case "xuất sách":
              tmp.removed = item.totalBooks;
              break;
            default:
              // Add more conditions here if needed
              break;
          }
        });

        setStatusData(tmp);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy GetStatisticsOfBookConditionBySchoolYear thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoadingChart(false);
      });
  }, [selectedItemSchoolYear]);

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
        setLoadingChart(false);
      });
  }, []);
  const dollor = [
    <svg
      t="1661912332523"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4263"
      width="22"
      height="22"
    >
      <path
        d="M754.292 632.97c-25.491 15.326-44.94 36.777-57.97 61.242l-149.667-29.385c-0.243-43.86-11.895-88.207-36.183-128.527-26.275-43.55-63.607-76.245-106.183-96.777l67.446-191.154c18.869-0.71 37.818-6.008 55.133-16.45 54.511-32.864 72.056-103.676 39.21-158.174C533.22 19.26 462.395 1.71 407.925 34.595c-29.697 17.847-48.335 47.05-53.904 78.705l-144.151 8.826a88.793 88.793 0 0 0-28.399-34.379C141.544 58.755 85.64 67.615 56.674 107.55c-28.978 39.975-20.126 95.824 19.815 124.837 39.954 28.98 95.79 20.057 124.782-19.876 10.03-13.733 15.395-29.418 16.68-45.212l137.177-8.401c2.65 11.639 7.11 23.053 13.597 33.805 11.327 18.836 27.222 33.082 45.333 42.537l-65.284 185.044c-60.904-13.435-126.877-4.522-184.524 30.202C44.943 522.399 6.543 677.439 78.462 796.733 150.356 916 305.375 954.415 424.683 882.522c58.54-35.291 97.561-90.642 113.645-151.964l139.57 27.423c-2.23 31.521 4.784 64.013 22.315 93.102 45.347 75.231 142.99 99.412 218.166 54.064 75.165-45.306 99.373-142.949 54.067-218.126-45.321-75.191-142.975-99.345-218.154-54.052z"
        p-id="4264"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const profile = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
        fill="#fff"
      ></path>
      <path
        d="M17 6C17 7.65685 15.6569 9 14 9C12.3431 9 11 7.65685 11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6Z"
        fill="#fff"
      ></path>
      <path
        d="M12.9291 17C12.9758 16.6734 13 16.3395 13 16C13 14.3648 12.4393 12.8606 11.4998 11.6691C12.2352 11.2435 13.0892 11 14 11C16.7614 11 19 13.2386 19 16V17H12.9291Z"
        fill="#fff"
      ></path>
      <path
        d="M6 11C8.76142 11 11 13.2386 11 16V17H1V16C1 13.2386 3.23858 11 6 11Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const heart = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const cart = [
    <svg
      t="1661912269803"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4024"
      width="22"
      height="22"
    >
      <path
        d="M315.63 118.583H95.098c-17.6 0-32 14.4-32 32v746.918c0 17.6 14.4 32 32 32H315.63c17.6 0 32-14.4 32-32V150.583c0-17.6-14.4-32-32-32z m-39.133 245.399H134.231c-17.673 0-32-14.327-32-32s14.327-32 32-32h142.266c17.673 0 32 14.327 32 32s-14.327 32-32 32z m0-113.813H134.231c-17.673 0-32-14.327-32-32s14.327-32 32-32h142.266c17.673 0 32 14.327 32 32s-14.327 32-32 32zM571.71 118.583h-149.4c-17.6 0-32 14.4-32 32v746.918c0 17.6 14.4 32 32 32h149.4c17.6 0 32-14.4 32-32V150.583c0-17.6-14.4-32-32-32z m-10.68 245.399H432.99c-17.673 0-32-14.327-32-32s14.327-32 32-32h128.04c17.673 0 32 14.327 32 32s-14.327 32-32 32z m0-113.813H432.99c-17.673 0-32-14.327-32-32s14.327-32 32-32h128.04c17.673 0 32 14.327 32 32s-14.327 32-32 32zM955.119 872.454L819.663 152.356c-3.254-17.297-20.068-28.786-37.364-25.533l-135.388 25.468c-17.297 3.254-28.786 20.067-25.533 37.364l135.456 720.098c3.254 17.297 20.068 28.786 37.364 25.533l135.388-25.468c17.297-3.254 28.787-20.067 25.533-37.364z m-308.92-627.011a32.044 32.044 0 0 1-1.002-7.949c0.005-14.272 9.629-27.279 24.094-30.971l102.455-26.15c17.122-4.372 34.548 5.967 38.92 23.092a32.044 32.044 0 0 1 1.002 7.949c-0.005 14.272-9.629 27.279-24.094 30.971l-102.455 26.15a32.046 32.046 0 0 1-7.938 1.002c-14.276 0-27.288-9.624-30.982-24.094z m169.523 107.219l-102.455 26.151a32.046 32.046 0 0 1-7.938 1.002c-14.276 0-27.289-9.625-30.982-24.094a32.044 32.044 0 0 1-1.002-7.949c0.005-14.272 9.629-27.279 24.094-30.971l102.455-26.151c17.122-4.372 34.548 5.967 38.92 23.092a32.044 32.044 0 0 1 1.002 7.949c-0.005 14.272-9.629 27.279-24.094 30.971z"
        p-id="4025"
        fill="#fff"
      ></path>
    </svg>,
  ];

  const count = [
    {
      today: `Lượt mượn sách tháng ${AnalystUserAndBook.bookBorrowAnalyst.currentMonth}`,
      title: AnalystUserAndBook.bookBorrowAnalyst.totalBorrowBookCurrentMonth,
      persent:
        AnalystUserAndBook.bookBorrowAnalyst.percentDifference > 0 ? (
          <Statistic
            style={{ display: "inline-block" }}
            value={AnalystUserAndBook.bookBorrowAnalyst.percentDifference}
            precision={2}
            valueStyle={{
              color: "#52c41a",
            }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        ) : (
          <Statistic
            style={{ display: "inline-block" }}
            value={AnalystUserAndBook.bookBorrowAnalyst.percentDifference}
            precision={2}
            valueStyle={{
              color: "#cf1322",
            }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        ),
      icon: dollor,
      bnb:
        AnalystUserAndBook.bookBorrowAnalyst.percentDifference > 0
          ? "bnb2"
          : "redtext",
    },
    {
      today: `Lượt trả sách tháng ${AnalystUserAndBook.bookBackAnalyst.currentMonth}`,
      title: AnalystUserAndBook.bookBackAnalyst.totalBookBackCurrentMonth,
      persent:
        AnalystUserAndBook.bookBackAnalyst.percentDifference > 0 ? (
          <Statistic
            style={{ display: "inline-block" }}
            value={AnalystUserAndBook.bookBackAnalyst.percentDifference}
            precision={2}
            valueStyle={{
              color: "#52c41a",
            }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        ) : (
          <Statistic
            style={{ display: "inline-block" }}
            value={AnalystUserAndBook.bookBackAnalyst.percentDifference}
            precision={2}
            valueStyle={{
              color: "#cf1322",
            }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        ),
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "Tổng số người dùng",
      title: AnalystUserAndBook.totalser.totalUser,
      // persent: `${AnalystUserAndBook.totalser.percentDifference}% so với tháng trước`,
      icon: profile,
    },
    {
      today: `Người dùng mới tháng ${AnalystUserAndBook.userAnalyst.currentMonth}`,
      title: AnalystUserAndBook.userAnalyst.numberUserCurrentMonth,
      persent:
        AnalystUserAndBook.userAnalyst.percentDifference > 0 ? (
          <Statistic
            style={{ display: "inline-block" }}
            value={AnalystUserAndBook.userAnalyst.percentDifference}
            precision={2}
            valueStyle={{
              color: "#52c41a",
            }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        ) : (
          <Statistic
            style={{ display: "inline-block" }}
            value={AnalystUserAndBook.userAnalyst.percentDifference}
            precision={2}
            valueStyle={{
              color: "#cf1322",
            }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        ),
      icon: heart,
      bnb:
        AnalystUserAndBook.userAnalyst.percentDifference > 0
          ? "bnb2"
          : "redtext",
    },
  ];
  const dataCharts = NumberDocumentByType.map((item, index) => ({
    type: `${item.documentType.docTypeName}/${item.documentType.id}`,
    value: item.count,
  }));

  const dataBarCharts = NumberUserByType.map((item) => ({
    type: item.userType.typeName,
    value: item.numberUser,
  }));

  const dataProgressCharts = useMemo(() => {
    if (!CalculateFolder) return 0;
    if (CalculateFolder.database) {
      let a = 0;
      CalculateFolder.database.forEach((x) => (a += x.sizeDatabaseMB));
      return (
        Math.round(((CalculateFolder.rootFolderMB + a) / 1024) * 100) / 100
      );
    }
  }, [CalculateFolder]);

  const BookStatusGrid = ({ statusData }) => {
    return (
      <Row gutter={[24, 24]}>
        {/* Đầu năm */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            className="status-card start-year-card"
            style={{ height: 200 }}
          >
            <Title level={5} style={{ color: "#fff" }}>
              Đầu năm
            </Title>
            <p className="status-value">{statusData.startOfYear}</p>
          </Card>
        </Col>
        {/* Cuối năm */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            className="status-card end-year-card"
            style={{ height: 200 }}
          >
            <Title level={5} style={{ color: "#fff" }}>
              Cuối năm
            </Title>
            <p className="status-value">{statusData.endOfYear}</p>
          </Card>
        </Col>
        {/* Rách nát */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            className="status-card damaged-card"
            style={{ height: 200 }}
          >
            <Title level={5} style={{ color: "#fff" }}>
              Rách nát
            </Title>
            <p className="status-value">{statusData.damaged}</p>
          </Card>
        </Col>
        {/* Lạc hậu */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            className="status-card outdated-card"
            style={{ height: 200 }}
          >
            <Title level={5} style={{ color: "#fff" }}>
              Lạc hậu
            </Title>
            <p className="status-value">{statusData.outdated}</p>
          </Card>
        </Col>
        {/* Mất */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            className="status-card lost-card"
            style={{ height: 200 }}
          >
            <Title level={5} style={{ color: "#fff" }}>
              Mất
            </Title>
            <p className="status-value">{statusData.lost}</p>
          </Card>
        </Col>
        {/* Xuất sách */}
        <Col xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            className="status-card removed-card"
            style={{ height: 200 }}
          >
            <Title level={5} style={{ color: "#fff" }}>
              Xuất sách
            </Title>
            <p className="status-value">{statusData.removed}</p>
          </Card>
        </Col>
      </Row>
    );
  };
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
  // Dữ liệu demo

  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-12">
            <Card bordered={false} className="criclebox h-full">
              <Button
                type="primary"
                onClick={handleRunProcedure}
                style={{ marginBottom: "16px" }}
                loading={loadingChart2}
              >
                Cập nhật
              </Button>
              <Space style={{ justifyContent: "space-between", width: "100%" }}>
                <Typography.Title level={5}>Chọn năm học</Typography.Title>
              </Space>
              <Select
                showSearch
                placeholder="Năm học"
                value={selectedItemSchoolYear}
                onChange={(e) => {
                  setselectedItemSchoolYear(e);
                  setLoadingStatisticsOfPaperBooksAndDigitalBooksOfEachSchool(
                    true,
                  );
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

              {/*<Button*/}
              {/*  type="primary"*/}
              {/*  style={{*/}
              {/*    width: "7%"*/}
              {/*  }}*/}
              {/*  onClick={() => {*/}
              {/*    SeachReportBookTotal();*/}
              {/*  }}*/}
              {/*>*/}
              {/*  Tìm kiếm*/}
              {/*</Button>*/}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={12} className="mb-24">
            <Spin size="large" spinning={loadingChart2}>
              <Card bordered={false} className="criclebox h-full">
                <Title level={5}>
                  Thống kê sách giấy của{" "}
                  <span style={{ color: "red", fontWeight: 700 }}>
                    từng trường
                  </span>
                </Title>
                <ColumnChartGroup data={DataColunmPaperBookDigitalBook} />
              </Card>
            </Spin>
          </Col>
          <Col xs={24} sm={24} md={10} lg={10} xl={12} className="mb-24">
            <Spin size="large" spinning={loadingChart}>
              <Card bordered={false} className="criclebox h-full">
                <Title level={5}>
                  Thống kê loại sách của{" "}
                  <span style={{ color: "red", fontWeight: 700 }}>
                    {" "}
                    tất cả trường
                  </span>
                </Title>
                <ColumnChart data={DataColunmAllDocumentType} />
              </Card>
            </Spin>
          </Col>
          <Col xs={24} className="mb-24">
            <Spin size="large" spinning={loadingChart}>
              <Card bordered={false} className="criclebox h-full">
                <Title level={5}>Tình trạng sách</Title>
                <BookStatusGrid statusData={statusData} />
              </Card>
            </Spin>
          </Col>
        </Row>
        <CompanyIntroduction />
      </div>
    </>
  );
}

export const DashBoardReport = WithErrorBoundaryCustom(_DashBoardReport);
