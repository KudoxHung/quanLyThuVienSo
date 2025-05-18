import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { auditReceipt } from "../../../api/auditReceipt";
import { documentType } from "../../../api/documentType";
import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

function _ModalAddLineAuditReceipt(props) {
  const {
    visible,
    setVisible,
    form,
    StatusBook,
    listIdIndividualSelected,
    setStartProgress,
  } = props;
  const [ListIdIndividualSelected, setListIdIndividualSelected] = useState(
    listIdIndividualSelected,
  );
  const [rowSelected, setRowSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  //document type
  const [DocumentType, setDocumentType] = useState([]);
  const [loadingDocumentType, setLoadingDocumentType] = useState(false);
  const onSearch = (values) => {
    if (values.IdDocumentType) {
      auditReceipt
        .GetListBookToAuditReceipt(
          values.filter || "",
          values.IdDocumentType,
          0,
          0,
        )
        .then((res) => {
          console.log(res);
          setData(res);
        })
        .catch((err) => {
          openNotificationWithIcon("warning", "Lỗi", err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const columns = [
    {
      title: "STT",
      render: (item, record, index) => index + 1,
      rowScope: "row",
    },
    {
      title: "Số ĐKCB",
      dataIndex: "numIndividual",
      key: "numIndividual",
      render: (text) => text.split("/")[0],
    },
    {
      title: "Nhan đề",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Loại sách",
      dataIndex: "typeBook",
      key: "typeBook",
    },
    {
      title: "Giá bìa",
      dataIndex: "price",
      key: "price",
      render: (text) =>
        text?.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
    {
      title: "Tình trạng",
      dataIndex: "wasLost",
      key: "wasLost",
      render: (text) =>
        text ? (
          <Tag color={"error"}>Mất</Tag>
        ) : (
          <Tag color={"processing"}>Còn</Tag>
        ),
    },
  ];
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelected(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  const HandleAddListBook = () => {
    if (rowSelected.length > 0) {
      setStartProgress(true);
      setTimeout(() => {
        const auditBookListPayloads =
          form.getFieldValue("auditBookListPayloads") || [];
        const updatedPayloads = rowSelected.map((record) => ({
          ...record,
          numIndividual: record.numIndividual?.split("/")[0],
          idIndividualSample: record.idIndividual,
          idDocument: record.idBook,
          wasLost: !(record.wasLost === null || record.wasLost === false),
          redundant: false,
          isLiquidation: null,
          idStatusBook: StatusBook?.find(
            (x) => x.nameStatusBook === "Còn nguyên vẹn",
          )?.id,
          note: "",
        }));
        form.setFieldsValue({
          auditBookListPayloads: [...auditBookListPayloads, ...updatedPayloads],
        });
        const listIdIndividual = [
          ...auditBookListPayloads,
          ...updatedPayloads,
        ].map((item) => item.idIndividual);
        setListIdIndividualSelected(listIdIndividual);
        setData(
          data.filter((item) => {
            const idSet = new Set(listIdIndividual);
            return !idSet.has(item.idIndividual);
          }),
        );
        setRowSelected([]);
        setStartProgress(false);
      }, 1000);
      // setVisible(false);
    }
  };
  const HandleAddAllListBook = () => {
    if (data.length > 0) {
      setStartProgress(true);
      setTimeout(() => {
        const auditBookListPayloads =
          form.getFieldValue("auditBookListPayloads") || [];
        const listIdBook = data.filter((item) => {
          const idSet = new Set(ListIdIndividualSelected);
          return !idSet.has(item.idIndividual);
        });
        const updatedPayloads = listIdBook.map((record) => ({
          ...record,
          numIndividual: record.numIndividual?.split("/")[0],
          idIndividualSample: record.idIndividual,
          idDocument: record.idBook,
          wasLost: !(record.wasLost === null || record.wasLost === false),
          redundant: false,
          isLiquidation: null,
          idStatusBook: StatusBook?.find(
            (x) => x.nameStatusBook === "Còn nguyên vẹn",
          )?.id,
          note: "",
        }));
        form.setFieldsValue({
          auditBookListPayloads: [...auditBookListPayloads, ...updatedPayloads],
        });
        const listIdIndividual = [
          ...auditBookListPayloads,
          ...updatedPayloads,
        ].map((item) => item.idIndividual);
        setListIdIndividualSelected(listIdIndividual);
        setData(
          data.filter((item) => {
            const idSet = new Set(listIdIndividual);
            return !idSet.has(item.idIndividual);
          }),
        );
        setRowSelected([]);
        setStartProgress(false);
      }, 1000);
      // setVisible(false);
    }
  };
  useEffect(() => {
    setLoadingDocumentType(true);
    documentType
      .getAllNotPage(1)
      .then((res) => {
        setDocumentType(res);
      })
      .catch((err) => {
        openNotificationWithIcon("warning", "lấy danh sách loại sách thất bại");
      })
      .finally(() => setLoadingDocumentType(false));
  }, []);
  useEffect(() => {
    setListIdIndividualSelected(listIdIndividualSelected);
  }, [listIdIndividualSelected]);
  return (
    <div className="ModalAddLineAuditReceipt">
      <Modal
        width={"85%"}
        visible={visible}
        title={<Typography.Text strong>Tìm kiếm sách</Typography.Text>}
        onCancel={() => setVisible(false)}
        afterClose={() => {
          setSelectedRowKeys([]);
          setRowSelected([]);
        }}
        footer={null}
      >
        <Form layout="inline" onFinish={onSearch}>
          <Form.Item
            style={{
              width: "40%",
            }}
            name={"filter"}
          >
            <Input placeholder="Tìm theo nhan đề, tác giả,..." />
          </Form.Item>
          <Form.Item
            label="Loại sách"
            name={"IdDocumentType"}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại sách",
              },
            ]}
          >
            <Select
              showSearch
              loading={loadingDocumentType}
              placeholder="Chọn loại sách"
              optionFilterProp="label"
            >
              {DocumentType.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id}
                  label={item.docTypeName}
                >
                  {item.docTypeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space wrap>
            <Button
              size="small"
              htmlType="submit"
              type="default"
              icon={<SearchOutlined />}
            >
              Tìm kiếm
            </Button>
            <Button
              type="primary"
              icon={<PlusSquareOutlined />}
              onClick={() => HandleAddListBook()}
            >
              Chọn {rowSelected.length} sách
            </Button>
            <Button
              type="primary"
              icon={<PlusSquareOutlined />}
              onClick={() => {
                HandleAddAllListBook();
              }}
            >
              Chọn tất cả sách
            </Button>
          </Space>
        </Form>
        <Row>
          <Col span={24}>
            <Table
              style={{ marginTop: 10 }}
              size="small"
              scroll={{
                y: 400,
              }}
              bordered
              rowKey={(record) => record.idIndividual}
              rowSelection={rowSelection}
              dataSource={data.filter((item) => {
                const idSet = new Set(ListIdIndividualSelected);
                return !idSet.has(item.idIndividual);
              })}
              loading={loading}
              columns={columns.map((col) => ({
                ...col,
                ellipsis: true,
                width: 100,
              }))}
              pagination={{
                position: ["bottomCenter"],
                defaultPageSize: 20,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
              }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export const ModalAddLineAuditReceipt = WithErrorBoundaryCustom(
  _ModalAddLineAuditReceipt,
);
