import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { books } from "../../../api/books";
import { documentStock } from "../../../api/documentStock";
import { individualSample } from "../../../api/individualSample";
import { AlertOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _BookAttemptLayout() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);
  const [Books, setBooks] = useState([]);
  const [BookAttempt, setBookAttempt] = useState([]);
  const [DocumentStock, setDocumentStock] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);

  useEffect(() => {
    document.title = "Hồi cố sách";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        individualSample
          .GetIndividualSampleIsLost(0, 0)
          .then((res) => {
            setBookAttempt(res);
            console.log("res", res);
            let ListIdDocument = "";
            res.forEach((item) => {
              ListIdDocument += `,${item.idDocument}`;
            });
            books
              .getAll(0, 0, 1, ListIdDocument)
              .then((res) => {
                setBooks(res);
              })
              .catch((err) => {
                openNotificationWithIcon(
                  "error",
                  "Lấy danh sách sách thất bại",
                  err?.response?.data?.massege || err?.message,
                );
              })
              .finally(() => {
                setLoadingBooks(false);
              });
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy mã cá biệt đã mất thất bại",
              err?.response?.data?.massege || err?.massege,
            );
          })
          .finally(() => {
            setLoading(false);
          }),

        documentStock
          .getAll(0, 0)
          .then((res) => {
            setDocumentStock(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lỗi",
              err?.response?.data?.massege || err?.massege,
            );
          })
          .finally(() => {
            setLoadingStock(false);
          }),
      ]);
    };
    fetchData();
  }, [postLength]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleChangeStatus = (IdDocument, IdIndividual) => {
    setBtnLoading(true);
    individualSample
      .changeLostPhysicalVersion(IdDocument, IdIndividual, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hồi cố sách thành công",
          res?.massege,
        );

        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Hồi cố sách thất bại",
          err?.response?.data?.massege || err?.massege,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "idDocument",
      key: "idDocument",
      filters: BookAttempt.map((BookAttempt) => ({
        text: Books.find((item) => item.document.id === BookAttempt.idDocument)
          ?.document?.docName,
        value: BookAttempt.idDocument,
      })),
      fixed: "left",

      filteredValue: filteredInfo.idDocument || null,
      sorter: (a, b) => a.idDocument.length - b.idDocument.length,
      sortOrder:
        sortedInfo.columnKey === "idDocument" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.idDocument?.startsWith(value),

      render: (text, record) => (
        <Tooltip
          title={
            Books.find((item) => item.document.id === text)?.document?.docName
          }
        >
          <Typography.Text>
            {Books.find((item) => item.document.id === text)?.document?.docName
              ?.length > 22
              ? `${Books.find((item) => item.document.id === text)?.document?.docName?.slice(0, 22)}...`
              : Books.find((item) => item.document.id === text)?.document
                  ?.docName}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Mã cá biệt",
      dataIndex: "numIndividual",
      key: "numIndividual",
      filters: BookAttempt.map((BookAttempt) => ({
        text: BookAttempt.numIndividual.split("/")[0],
        value: BookAttempt.numIndividual,
      })),

      filteredValue: filteredInfo.numIndividual || null,
      sorter: (a, b) => a.numIndividual.length - b.numIndividual.length,
      sortOrder:
        sortedInfo.columnKey === "numIndividual" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.numIndividual?.startsWith(value),
      render: (text, record) => text.split("/")[0],
    },
    {
      title: "Mã vạch",
      dataIndex: "barcode",
      key: "barcode",
      filters: BookAttempt.map((BookAttempt) => ({
        text: BookAttempt.barcode,
        value: BookAttempt.barcode,
      })),

      filteredValue: filteredInfo.barcode || null,
      sorter: (a, b) => a.barcode.length - b.barcode.length,
      sortOrder: sortedInfo.columnKey === "barcode" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.barcode?.startsWith(value),
    },
    {
      title: "Kho lưu trữ",
      dataIndex: "stockId",
      key: "stockId",
      filters: BookAttempt.map((BookAttempt) => ({
        text: DocumentStock.find((item) => item.id === BookAttempt.stockId)
          ?.stockName,
        value: BookAttempt.stockId,
      })),

      filteredValue: filteredInfo.stockId || null,
      sorter: (a, b) => a.stockId.length - b.stockId.length,
      sortOrder: sortedInfo.columnKey === "stockId" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.stockId?.startsWith(value),

      render: (text, record) =>
        DocumentStock.find((item) => item.id === text)?.stockName,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: BookAttempt.map((BookAttempt) => ({
        text: moment(BookAttempt.createdDate).format("DD/MM/YYYY HH:mm:ss"),
        value: BookAttempt.createdDate,
      })),
      filteredValue: filteredInfo.createdDate || null,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
      sortOrder:
        sortedInfo.columnKey === "createdDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createdDate?.startsWith(value),

      render: (text, record) => moment(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Tình trạng",
      dataIndex: "barcode",
      key: "barcode",
      render: (text, record) => <Tag color="red">Đã mất</Tag>,
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleChangeStatus(record.idDocument, record.id)}
            >
              <Button
                type="dashed"
                loading={btnLoading}
                icon={<AlertOutlined />}
              >
                Hồi cố sách
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
            <Title level={5}>Quản lý sách đã mất</Title>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={BookAttempt}
              onChange={handleChange}
              loading={loading || loadingBooks || loadingStock}
              pagination={{
                showTotal: (total, range) => `Tổng cộng ${total} bản ghi`,
                defaultPageSize: 6,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const BookAttemptLayout = WithErrorBoundaryCustom(_BookAttemptLayout);
