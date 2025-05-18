import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { documentType } from "../../../api/documentType";
import { NodeExpandOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import moment from "moment";

function _MagazineRegister() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingDocumentType, setLoadingDocumentType] = useState(true);

  const [btnLoading, setBtnLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [formRef] = Form.useForm();

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const fetchDocumentType = async () => {
    try {
      const response = await documentType.getAllNotPage(2);
      setDocumentTypes(response);
      setLoadingDocumentType(false);
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Lấy loại sách thất bại",
        error?.response?.data?.message || error?.message,
      );
      setLoadingDocumentType(false);
    }
  };

  useEffect(() => {
    document.title = "Sổ đăng ký báo chí";
  }, []);

  useEffect(() => {
    fetchDocumentType();
  }, []);

  const handleStartYearChange = (date) => {
    if (date) {
      const year = date.year();
      formRef.setFieldsValue({
        endYear: moment(year + 1, "YYYY"),
      });
    } else {
      formRef.setFieldsValue({
        startYear: undefined,
        endYear: undefined,
      });
    }
  };

  const handleExportWord = async (values) => {
    setBtnLoading(true);

    try {
      if (values.schoolYearOrFinancialYear === undefined) {
        openNotificationWithIcon(
          "warning",
          "Thông báo",
          "Vui lòng chọn kỳ báo cáo.",
        );
        setBtnLoading(false);
        return;
      } else if (values.monthOrYear === undefined) {
        openNotificationWithIcon(
          "warning",
          "Thông báo",
          "Vui lòng chọn In theo.",
        );
        setBtnLoading(false);
        return;
      } else if (values.listIdDocumentType === undefined) {
        openNotificationWithIcon(
          "warning",
          "Thông báo",
          "Vui lòng chọn Loại báo, tạp chí.",
        );
        setBtnLoading(false);
        return;
      } else if (
        values.startYear === undefined ||
        values.endYear === undefined
      ) {
        openNotificationWithIcon(
          "warning",
          "Thông báo",
          "Vui lòng chọn Năm từ, Năm đến",
        );
        setBtnLoading(false);
        return;
      } else if (
        moment(values?.startYear).format("YYYY") >
        moment(values?.endYear).format("YYYY")
      ) {
        openNotificationWithIcon(
          "warning",
          "Thông báo",
          "Năm từ phải bé hơn hoặc bằng năm đến",
        );
        setBtnLoading(false);
        return;
      }

      let fileNames = "Sổ đăng ký báo tạp chí.docx";

      if (
        values.schoolYearOrFinancialYear === "namhoc" &&
        values.monthOrYear === "ngay"
      ) {
        fileNames = "[NamHoc-Ngay] Sổ đăng ký báo tạp chí theo ngày.docx";
      } else if (
        values.schoolYearOrFinancialYear === "namhoc" &&
        values.monthOrYear === "thang"
      ) {
        fileNames = "[NamHoc-Thang] Sổ đăng ký báo tạp chí theo tháng.docx";
      } else if (
        values.schoolYearOrFinancialYear === "namtaichinh" &&
        values.monthOrYear === "ngay"
      ) {
        fileNames = "[NamTaiChinh-Ngay] Sổ đăng ký báo tạp chí theo ngày.docx";
      } else if (
        values.schoolYearOrFinancialYear === "namtaichinh" &&
        values.monthOrYear === "thang"
      ) {
        fileNames =
          "[NamTaiChinh-Thang] Sổ đăng ký báo tạp chí theo tháng.docx";
      }

      analyst
        .GetExceLAnalystMagazine(values)
        .then((res) => {
          setBtnLoading(false);

          if (res.type === "application/json") {
            openNotificationWithIcon(
              "error",
              "Thông báo",
              "Không có dữ liệu hoặc đã có lỗi xáy ra khi xuất báo cáo. Vui lòng chọn và kiểm tra lại thông tin đã chọn.",
            );
          } else {
            openNotificationWithIcon(
              "success",
              "Thông báo",
              "Xuất báo cáo thống kê thành công",
            );
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileNames);
            document.body.appendChild(link);
            link.click();
          }
        })
        .catch((err) => {
          setBtnLoading(false);
          openNotificationWithIcon(
            "error",
            "Thông báo",
            "Có lỗi xảy ra, vui lòng thử lại!",
          );
        });
    } catch (error) {
      setBtnLoading(false);
    }
  };

  const onFinish = (values) => {
    setBtnLoading(true);

    if (values.schoolYearOrFinancialYear === undefined) {
      openNotificationWithIcon(
        "warning",
        "Thông báo",
        "Vui lòng chọn kỳ báo cáo.",
      );
      setBtnLoading(false);
      return;
    } else if (values.monthOrYear === undefined) {
      openNotificationWithIcon(
        "warning",
        "Thông báo",
        "Vui lòng chọn In theo.",
      );
      setBtnLoading(false);
      return;
    } else if (
      values.listIdDocumentType === undefined ||
      values.listIdDocumentType.length === 0
    ) {
      openNotificationWithIcon(
        "warning",
        "Thông báo",
        "Vui lòng chọn Loại báo, tạp chí.",
      );
      setBtnLoading(false);
      return;
    } else if (values.startYear === undefined || values.endYear === undefined) {
      openNotificationWithIcon(
        "warning",
        "Thông báo",
        "Vui lòng chọn Năm từ, Năm đến",
      );
      setBtnLoading(false);
      return;
    } else if (
      moment(values?.startYear).format("YYYY") >
      moment(values?.endYear).format("YYYY")
    ) {
      openNotificationWithIcon(
        "warning",
        "Thông báo",
        "Năm từ phải bé hơn hoặc bằng năm đến",
      );
      setBtnLoading(false);
      return;
    }

    analyst
      .GetAnalystMagazine(values)
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
      title: "Danh mục báo",
      dataIndex: "docTypeName",
      key: "docTypeName",
      filters: Data.map((item) => ({
        text: item.docTypeName,
        value: item.docTypeName,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.docTypeName || null,
      sorter: (a, b) => a.docTypeName.length - b.docTypeName.length,
      sortOrder:
        sortedInfo.columnKey === "docTypeName" ? sortedInfo.order : null,

      onFilter: (value, record) => record.docTypeName.startsWith(value),
    },
    {
      title: "Số báo",
      dataIndex: "magazineNumber",
      key: "magazineNumber",
      filters: Data.map((item) => ({
        text: item.magazineNumber,
        value: item.magazineNumber,
      })),
      filterSearch: true,
      filteredValue: filteredInfo.magazineNumber || null,
      onFilter: (value, record) => record.magazineNumber.startsWith(value),
      render: (text, record) => record.magazineNumber,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: Data.map((item) => ({
        text: moment(item.createdDate).format("DD/MM/YYYY"),
        value: item.createdDate,
      })),
      filterSearch: true,
      filteredValue: filteredInfo.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      onFilter: (value, record) => record.createdDate.startsWith(value),
      render: (text, record) => moment(record.createdDate).format("DD/MM/YYYY"),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Form layout={"horizontal"} form={formRef} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Space direction="horizontal" size={24} style={{ width: "100%" }}>
                <Form.Item
                  style={{
                    width: 180,
                    marginBottom: 0,
                  }}
                  name={"schoolYearOrFinancialYear"}
                >
                  <Select placeholder={"Chọn kỳ báo cáo"}>
                    <Select.Option value="namhoc">Năm học</Select.Option>
                    <Select.Option value="namtaichinh">
                      Năm tài chính
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  style={{
                    width: 180,
                    marginBottom: 0,
                  }}
                  name={"monthOrYear"}
                >
                  <Select placeholder={"In theo"}>
                    <Select.Option value="ngay">Ngày</Select.Option>
                    <Select.Option value="thang">Tháng</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  style={{
                    width: "100%",
                    marginBottom: 0,
                  }}
                >
                  <Form.Item
                    name="startYear"
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                      marginBottom: 0,
                    }}
                  >
                    <DatePicker
                      picker="year"
                      placeholder="Năm từ"
                      onChange={handleStartYearChange}
                    />
                  </Form.Item>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      textAlign: "center",
                    }}
                  >
                    -
                  </span>
                  <Form.Item
                    name="endYear"
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                      marginBottom: 0,
                    }}
                  >
                    <DatePicker
                      picker="year"
                      placeholder="Năm đến"
                      value={formRef.getFieldValue("endYear")}
                      disabled
                    />
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  style={{
                    width: 400,
                    marginBottom: 0,
                  }}
                  name={"listIdDocumentType"}
                >
                  <Select
                    allowClear
                    showSearch
                    loading={loadingDocumentType}
                    placeholder={"Loại báo, tạp chí"}
                    options={documentTypes.map((item) => ({
                      label: item.docTypeName,
                      value: item.id,
                    }))}
                    mode="multiple"
                  />
                </Form.Item>
              </Space>
              <Divider />
              <Space direction="horizontal" size={24} style={{ width: "100%" }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setData([]);
                    formRef.resetFields();
                  }}
                >
                  Cài lại
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<NodeExpandOutlined />}
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
                        d="M535.119473 0h69.599248v95.247413C729.226717 96.331138 853.614299 93.92286 977.881468 96.331138a40.459078 40.459078 0 0 1 44.914393 45.516463c2.047037 234.566322 0 469.614299 1.204139 703.819379-1.204139 24.082785 2.287865 50.694262-11.318909 72.248354-16.978363 12.041392-38.893697 10.837253-58.761994 12.041392h-349.200376V1023.518344h-72.248354C354.980245 990.886171 177.490122 960.541863 0 928.752587V95.488241C178.33302 63.578551 356.786453 32.511759 535.119473 0z"
                        fill="#2A5699"
                      ></path>
                      <path
                        d="M604.718721 131.010348H988.598307v761.979304H604.718721v-95.247413h302.479774v-48.165569H604.718721v-59.002822h302.479774v-48.16557H604.718721v-59.002822h302.479774v-48.165569H604.718721v-60.206961h302.479774V428.673565H604.718721v-60.206961h302.479774v-46.96143H604.718721v-59.604892h302.479774V214.336783H604.718721zM240.827846 341.373471c22.156162-1.324553 44.19191-2.287865 66.348071-3.492003 15.533396 80.4365 31.30762 160.632173 48.165569 240.827845 13.125118-82.724365 27.695202-165.087488 41.783632-247.571025 23.239887-0.842897 46.479774-2.167451 69.719661-3.612418-26.370649 115.356538-49.369708 231.796802-78.148636 346.430856-19.386642 10.355597-48.165569 0-71.52587 1.204139C301.034807 596.169332 283.093133 517.779868 269.245532 438.667921c-13.606773 76.944497-31.30762 153.16651-46.841016 229.508937-22.39699-1.204139-44.793979-2.528692-67.311383-4.094073-19.266228-104.760113-42.024459-208.918156-60.206962-313.919097 19.868297-0.963311 39.857008-1.806209 60.206962-2.528693 12.041392 75.860771 25.648166 151.360301 36.124177 227.341487 16.135466-77.907808 32.873001-155.695202 49.610536-233.603011z"
                        fill="#FFFFFF"
                      ></path>
                    </svg>,
                  ]}
                  style={{ background: "#2A5699" }}
                  loading={btnLoading}
                  onClick={() => {
                    handleExportWord(formRef.getFieldsValue());
                  }}
                >
                  Xuất sổ đăng ký báo tạp chí
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Typography.Title level={5}>
                Sổ đăng ký báo tạp chí
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
      </Form>
    </Spin>
  );
}

export const MagazineRegister = WithErrorBoundaryCustom(_MagazineRegister);
