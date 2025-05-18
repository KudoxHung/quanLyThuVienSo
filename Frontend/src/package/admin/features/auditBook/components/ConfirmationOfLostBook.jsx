import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { auditReceipt } from "../../../api/auditReceipt";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Table, Tooltip, Typography } from "antd";

function _ConfirmationOfLostBook(props) {
  const { visible, setVisible } = props;
  return (
    <div className="ConfirmationOfLostBook">
      <Modal
        title={"Xác nhận mất sách"}
        visible={visible}
        width={"70%"}
        onCancel={() => setVisible(false)}
        footer={null}
        style={{
          top: 20,
        }}
      >
        <LostBook {...props} />
      </Modal>
    </div>
  );
}

export const ConfirmationOfLostBook = WithErrorBoundaryCustom(
  _ConfirmationOfLostBook,
);

function LostBook(props) {
  const {
    listIdIndividualSelect,
    form,
    StatusBook,
    setVisible,
    setStartProgress,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listIdIndividualSelect) {
      setLoading(true);
      auditReceipt
        .ConfirmLostBook(0, 0, listIdIndividualSelect)
        .then((res) => {
          setListData(res);
          setSelectedRows(res);
          setSelectedRowKeys(res.map((item) => item.idIndividual));
        })
        .catch((err) => {
          openNotificationWithIcon("warning", err?.response?.data?.message);
        })
        .finally(() => setLoading(false));
    }
  }, [listIdIndividualSelect]);
  // table features
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, rowSelection) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(rowSelection);
    },
  };
  const columns = [
    {
      title: "Sách",
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
    },
    {
      title: "Loại sách",
      dataIndex: "typeBook",
      key: "typeBook",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) =>
        text?.toLocaleString("it-IT", { style: "currency", currency: "VND" }),
    },
  ];
  const handleConfirmLostBook = () => {
    if (selectedRows.length > 0) {
      setStartProgress(true);
      setTimeout(() => {
        const auditBookListPayloads =
          form?.getFieldValue("auditBookListPayloads") || [];
        const arrayFormat = [];
        const statusBookId = StatusBook?.find(
          (x) => x.nameStatusBook === "Còn nguyên vẹn",
        )?.id;
        for (const record of selectedRows) {
          const numIndividual = record.numIndividual?.split("/")[0];

          arrayFormat.push({
            ...record,
            numIndividual,
            idIndividualSample: record.idIndividual,
            idDocument: record.idBook,
            wasLost: true,
            redundant: false,
            isLiquidation: null,
            idStatusBook: statusBookId,
            note: "",
          });
        }
        form.setFieldsValue({
          auditBookListPayloads: [...auditBookListPayloads, ...arrayFormat],
        });
        setStartProgress(false);
      }, 1000);
      setVisible(false);
      setSelectedRows([]);
      setSelectedRowKeys([]);
    }
  };

  return (
    <div className="LostBook">
      <Table
        bordered
        scroll={{
          y: "calc(100vh - 250px)",
        }}
        rowKey={(record) => record.idIndividual}
        columns={columns.map((col) =>
          col.title !== "Thao tác"
            ? { ...col, ellipsis: true, width: 160 }
            : col,
        )}
        rowSelection={rowSelection}
        dataSource={listData}
        loading={loading}
        size="small"
        pagination={{
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} của ${total} bản sách`;
          },
        }}
      />
      <Space
        style={{
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button
          type="primary"
          onClick={() => handleConfirmLostBook()}
          icon={<CheckOutlined />}
        >
          Xác nhận {selectedRows.length} sách
        </Button>
      </Space>
    </div>
  );
}
