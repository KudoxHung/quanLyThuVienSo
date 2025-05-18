import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { auditReceipt } from "../../../api/auditReceipt";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import MauInBienBanKiemKeTheoSach from "../../../asset/files/MauInBienBanKiemKeTheoSach.docx";
import { ModalContent } from "../../../components";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import { ListBookLiquidation } from "../components/ListBookLiquidation";
import { ModalPrintListForAuditReceipt } from "../components/ModalPrintListForAuditReceipt";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _AuditBookLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [timeSearch, setTimeSearch] = useState({
    from: moment().startOf("month").format("DD/MM/YYYY"),
    to: moment().endOf("month").format("DD/MM/YYYY"),
  });
  const [refreshData, setRefreshData] = useState(0);
  const [
    isOpenedModalPrintListForAuditReceipt,
    setIsOpenedModalPrintListForAuditReceipt,
  ] = useState(false);
  const [isOpenModalLiquidationListBook, setIsOpenModalLiquidationListBook] =
    useState(false);
  const [idReceiptSelected, setIdReceiptSelected] = useState(null);
  // AuditReceipt
  const [listAuditReceipt, setListAuditReceipt] = useState([]);
  const [AuditReceipt, setAuditReceipt] = useState({});
  const [LoadingAuditReceipt, setLoadingAuditReceipt] = useState(false);
  const [loadingListAuditReceipt, setLoadingListAuditReceipt] = useState(true);
  const [btnLoadingAuditReceipt, setBtnLoadingAuditReceipt] = useState(false);
  const [quantityBook, setQuantityBook] = useState(0);
  useEffect(() => {
    window.document.title = "Kiểm kê sách";
  }, []);
  useEffect(() => {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      if (from && to) {
        setTimeSearch({
          from: from,
          to: to,
        });
      }
    } else {
      navigate(
        `/admin/kiem-ke-sach?from=${timeSearch.from}&to=${timeSearch.to}`,
      );
    }
  }, [location, navigate, timeSearch.from, timeSearch.to]);
  useEffect(() => {
    if (timeSearch.from && timeSearch.to) {
      setLoadingListAuditReceipt(true);
      auditReceipt
        .GetAllAuditReceipt(0, 0, timeSearch.from, timeSearch.to)
        .then((res) => {
          setListAuditReceipt(res);
        })
        .catch((err) => {
          openNotificationWithIcon("error", "Thất bại", "Lấy dữ liệu thất bại");
        })
        .finally(() => setLoadingListAuditReceipt(false));
    }
  }, [timeSearch.to, refreshData, timeSearch.from]);
  useEffect(() => {
    auditReceipt
      .CountAllNumberOfBook()
      .then((res) => {
        setQuantityBook(res?.quantity);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy số lượng sách thất bại",
          err?.reponese?.data?.message,
        );
      });
  }, []);
  const handleLiquidationAuditReceipt = () => {
    auditReceipt
      .LiquidationAuditReceipt(selectedRowKeys)
      .then((res) => {
        if (res?.success) {
          openNotificationWithIcon("success", res?.message);
          handleGetAuditReceiptDetail(selectedRowKeys[0]);
          setSelectedRowKeys([]);
        } else {
          openNotificationWithIcon("warning", res?.message);
        }
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Thất bại", "Thanh lý thất bại");
      });
  };
  const handleDeleteAuditReceipt = () => {
    setBtnLoadingAuditReceipt(true);
    auditReceipt
      .DeleteAuditReceiptByList(selectedRowKeys)
      .then((res) => {
        if (res?.success) {
          openNotificationWithIcon("success", "Thành công", res?.message);
          setRefreshData((prevState) => prevState + 1);
        } else {
          openNotificationWithIcon("warning", "Thất bại", res?.message);
        }
        setSelectedRowKeys([]);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Thất bại", "Xóa thất bại");
      })
      .finally(() => {
        setBtnLoadingAuditReceipt(false);
      });
  };
  const handleGetAuditReceiptDetail = (id) => {
    setLoadingAuditReceipt(true);
    auditReceipt
      .GetAuditReceiptById(id)
      .then((res) => {
        setAuditReceipt(res);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Thất bại", "Lấy dữ liệu thất bại");
      })
      .finally(() => setLoadingAuditReceipt(false));
  };
  const handlePrintAuditReceipt = async (id, numberAudit) => {
    try {
      const [nameSchool, nameDistrict] = await ContactAndIntroduction.read(
          1,
          1,
          2,
        ).then((res) => [res?.at(0)?.col10, res?.at(0)?.col9]),
        result = await auditReceipt.ReportAuditReceipt(id);
      const reportCreateDate = moment.utc(result.reportCreateDate);
      const table = {
        ...result,
        nameSchool: String(nameSchool || "...").toUpperCase(),
        nameDistrict: String(nameDistrict || "...").toUpperCase(),
        numberAudit: numberAudit?.slice(3) || "",
        principal: "",
        secretary: "",
        reportToDate: reportCreateDate.format("DD/MM/YYYY"),
        dayReportToDate: reportCreateDate.format("DD"),
        monthReportToDate: reportCreateDate.format("MM"),
        yearReportToDate: reportCreateDate.format("YYYY"),
        hourReportToDate: "9",
        minuteReportToDate: "15",
        resultReportAuditReceiptDetail:
          result.resultReportAuditReceiptDetail.map((item, index) => {
            return {
              ...item,
              datas: item.datas.map((data, index) => {
                return {
                  ...data,
                  index: index + 1,
                  numIndividual: data.numIndividual.split("/")[0],
                  even: data.wasLost ? "" : "X",
                  wasLost: data.wasLost ? "X" : "",
                  redundant: data.redundant ? "X" : "",
                };
              }),
            };
          }),
        dataAuditor: result.dataAuditor.map((item, index) => ({
          ...item,
          index: index + 1,
          name: item.name || "",
          position: item.position || "",
          role: item.role || "",
          note: item.note || "",
        })),
        QuantityDocument: result.dataQuantityDocument?.datas?.map(
          (item, index) => {
            return {
              ...item,
              index: index + 1,
            };
          },
        ),
        IndexAddOne: result.dataQuantityDocument?.datas?.length + 1,
        IndexAddTwo: result.dataQuantityDocument?.datas?.length + 2,
        IndexAddThree: result.dataQuantityDocument?.datas?.length + 3,
        IndexAddFour: result.dataQuantityDocument?.datas?.length + 4,
      };
      generateDocument(
        MauInBienBanKiemKeTheoSach,
        `Biên bản kiểm kê thư viện ${table.reportToDate}.docx`,
        table,
      );
      openNotificationWithIcon("success", "In biên bản kiểm kê thành công");
    } catch (e) {
      openNotificationWithIcon("error", "Thất bại", "In thất bại");
    }
  };

  // table features
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: "Số phiếu kiểm kê",
      dataIndex: "auditNumber",
      key: "auditNumber",
      fixed: "left",
    },
    {
      title: "Ngày lập",
      dataIndex: "reportCreateDate",
      key: "reportCreateDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Kiểm kê đến ngày",
      dataIndex: "reportToDate",
      key: "reportToDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Phương pháp kiểm kê",
      dataIndex: "idAuditMethod",
      key: "idAuditMethod",
      render: (text) =>
        text === "cf116d8d-4345-455f-b94f-91b0915526f6"
          ? "Kiểm kê định kỳ"
          : "Kiểm kê bất thường",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text>
            {text?.slice(0, 15)}
            {text?.length > 15 ? "..." : ""}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            loading={btnLoadingAuditReceipt}
            onClick={() =>
              handlePrintAuditReceipt(record.id, record.auditNumber)
            }
          >
            In phiếu kiểm kê
          </Button>
          <Button
            type="default"
            size="small"
            loading={btnLoadingAuditReceipt}
            onClick={() => navigate(`/admin/kiem-ke-sach/edit/${record.id}`)}
            disabled={record.status === 1}
          >
            Sửa
          </Button>
          <Button
            type={"primary"}
            size="small"
            onClick={() => {
              setIsOpenModalLiquidationListBook(true);
              setIdReceiptSelected(record.id);
            }}
          >
            Thanh lý sách
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="AuditBookLayout">
      <ModalPrintListForAuditReceipt
        visible={isOpenedModalPrintListForAuditReceipt}
        setVisible={setIsOpenedModalPrintListForAuditReceipt}
      />
      <ModalContent
        visible={isOpenModalLiquidationListBook}
        title={"Danh sách sách thanh lý"}
        width={"90%"}
        setVisible={setIsOpenModalLiquidationListBook}
        maskClosable={false}
      >
        <ListBookLiquidation
          idReceipt={idReceiptSelected}
          setVisible={setIsOpenModalLiquidationListBook}
          setRefreshData={setRefreshData}
        />
      </ModalContent>
      <Row gutter={[24, 24]}>
        <Col sm={24} xs={24} md={24} lg={24} xl={24}>
          <Typography.Title level={2}>Kiểm kê sách </Typography.Title>
          <Divider />
          <Card
            border={false}
            title={
              <Space size="large">
                <DatePicker.RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Từ ngày này", "Đến ngày này"]}
                  value={[
                    timeSearch.from
                      ? moment(timeSearch.from, "DD/MM/YYYY")
                      : null,
                    timeSearch.to ? moment(timeSearch.to, "DD/MM/YYYY") : null,
                  ]}
                  onChange={(value, formatString) => {
                    setTimeSearch({
                      from: formatString[0],
                      to: formatString[1],
                    });
                    location.search = `?from=${formatString[0]}&to=${formatString[1]}`;
                    navigate(location);
                  }}
                />
              </Space>
            }
          >
            <Space
              wrap
              style={{
                marginBottom: 16,
              }}
            >
              <Button
                type="primary"
                size="small"
                onClick={() => navigate("/admin/kiem-ke-sach/new")}
                loading={btnLoadingAuditReceipt}
              >
                Tạo phiếu kiểm kê
              </Button>
              <Popconfirm
                title={"Bạn có chắc chắn ?"}
                disabled={selectedRowKeys.length === 0}
                onConfirm={() => handleDeleteAuditReceipt()}
              >
                <Button
                  type="primary"
                  danger
                  size="small"
                  disabled={selectedRowKeys.length === 0}
                  loading={btnLoadingAuditReceipt}
                >
                  Xóa {selectedRowKeys.length} phiếu
                </Button>
              </Popconfirm>
              <Popconfirm
                title={"Bạn có chắc chắn ?"}
                onConfirm={() => handleLiquidationAuditReceipt()}
                disabled={selectedRowKeys.length === 0}
              >
                <Button
                  type="primary"
                  disabled={selectedRowKeys.length === 0}
                  loading={btnLoadingAuditReceipt}
                  hidden
                >
                  Thanh lý sách {selectedRowKeys.length} phiếu
                </Button>
              </Popconfirm>
              <Button
                type="default"
                size="small"
                loading={btnLoadingAuditReceipt}
                onClick={() => setIsOpenedModalPrintListForAuditReceipt(true)}
              >
                In danh sách
              </Button>
            </Space>
            <Table
              size="small"
              scroll={{ x: "auto" }}
              rowKey={(record) => record.id}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    if (
                      event.target.outerText === "In phiếu kiểm kê" ||
                      event.target.outerText === "Sửa" ||
                      event.target.outerText === "Thanh lý sách"
                    ) {
                      return false;
                    } else {
                      handleGetAuditReceiptDetail(record.id);
                    }
                  },
                };
              }}
              rowSelection={rowSelection}
              dataSource={listAuditReceipt}
              loading={loadingListAuditReceipt}
              pagination={{
                defaultPageSize: 5,
                showTotal: (total) => `Tổng số ${total} phiếu`,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "15", "20", "50", "100"],
              }}
            />
          </Card>
        </Col>
        <Col sm={24} xs={24} md={24} lg={24} xl={24}>
          <Card border={false}>
            <Typography.Title level={5}>
              Tổng số sách: {quantityBook}
            </Typography.Title>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Kết quả kiểm kê" key="1">
                <InventoryResults
                  data={AuditReceipt}
                  loading={LoadingAuditReceipt}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Ban kiểm kê" key="2">
                <InventoryBoard
                  data={AuditReceipt?.dataAuditor}
                  loading={LoadingAuditReceipt}
                />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const AuditBookLayout = WithErrorBoundaryCustom(_AuditBookLayout);

function InventoryBoard(props) {
  const { data, loading } = props;
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text>
            {text?.slice(0, 15)}
            {text?.length > 15 ? "..." : ""}
          </Typography.Text>
        </Tooltip>
      ),
    },
  ];
  return (
    <Table
      scroll={{ x: "auto" }}
      rowKey={(record) => record.idUser}
      columns={columns.map((col) =>
        col.title !== "Thao tác" ? { ...col, ellipsis: true, width: 100 } : col,
      )}
      dataSource={data}
      size="small"
      loading={loading}
      pagination={{
        pageSize: 6,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} kết quả`,
        position: ["bottomCenter"],
      }}
    />
  );
}

function InventoryResults(props) {
  const { data, loading } = props;
  const columns = [
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text>
            {text?.length > 22 ? `${text?.slice(0, 22)}...` : text}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Số ĐKCB",
      dataIndex: "numIndividual",
      key: "numIndividual",
      render: (text) => text?.split("/")[0],
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text>
            {text?.slice(0, 15)}
            {text?.length > 15 ? "..." : ""}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Loại sách",
      dataIndex: "typeBook",
      key: "typeBook",
    },
    {
      title: "Trạng thái",
      dataIndex: "wasLost",
      key: "wasLost",
      render: (text) =>
        text !== null ? (
          text ? (
            <Tag color="error">Mất</Tag>
          ) : (
            <Tag color="processing">Còn</Tag>
          )
        ) : (
          ""
        ),
    },
    {
      title: "Thừa",
      dataIndex: "redundant",
      key: "redundant",
      render: (text) => (text ? "Thừa" : "Không"),
    },
    {
      title: "Thanh lý",
      dataIndex: "isLiquidation",
      key: "isLiquidation",
      render: (text) =>
        text === null ? (
          ""
        ) : text ? (
          <Tag color="success">Thanh lý</Tag>
        ) : (
          <Tag color="warning">Chờ thanh lý</Tag>
        ),
    },
    {
      title: "Tình trạng",
      dataIndex: "nameStatusBook",
      key: "nameStatusBook",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Text>
            {text?.slice(0, 15)}
            {text?.length > 15 ? "..." : ""}
          </Typography.Text>
        </Tooltip>
      ),
    },
  ];
  return (
    <Table
      scroll={{ x: "auto" }}
      rowKey={(record) => record.idUser}
      columns={columns.map((col) =>
        col.title !== "Thao tác" ? { ...col, ellipsis: true, width: 100 } : col,
      )}
      dataSource={data?.datas}
      size="small"
      bordered
      loading={loading}
      pagination={{
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} kết quả`,
        position: ["bottomCenter"],
      }}
    />
  );
}
