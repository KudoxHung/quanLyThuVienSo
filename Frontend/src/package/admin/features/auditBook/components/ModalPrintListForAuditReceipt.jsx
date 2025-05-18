import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { auditReceipt } from "../../../api/auditReceipt";
import { documentType } from "../../../api/documentType";
import MauInBienBanKiemKeTheoDanhSach from "../../../asset/files/MauInBienBanKiemKeTheoDanhSach.docx";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import { Button, DatePicker, Form, Modal, Select, Typography } from "antd";
import moment from "moment";
function _ModalPrintListForAuditReceipt(props) {
  const { visible, setVisible } = props;
  const [loading, setLoading] = useState(false);
  //document type
  const [DocumentType, setDocumentType] = useState([]);
  const [loadingDocumentType, setLoadingDocumentType] = useState(false);
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
  const onSubmit = (values) => {
    setLoading(true);
    auditReceipt
      .PrintListDataDocument(values.IdDocumentType, values.sortByCondition)
      .then((res) => {
        const arr = res.dataBookByDocumentTypes?.map((item) => {
          return {
            ...item,
            dataOfBook: item?.dataOfBook?.map((x, index) => {
              return {
                ...x,
                publishYear: x.publishYear
                  ? moment(x.publishYear).format("YYYY")
                  : "",
                numIndividual:
                  x?.numIndividual !== null
                    ? x?.numIndividual?.split("/")[0]
                    : "",
                index: index + 1,
                even: x.wasLost !== null ? (x.wasLost ? "" : "X") : "",
                wasLost: x.wasLost !== null ? (x.wasLost ? "X" : "") : "",
                redundant: x.redundant !== null ? (x.redundant ? "X" : "") : "",
                nameStatusBook:
                  x.nameStatusBook !== null ? x.nameStatusBook : "",
                author: x.author !== null ? x.author : "",
              };
            }),
          };
        });
        const table = {
          day: moment(values.date).format("DD"),
          month: moment(values.date).format("MM"),
          year: moment(values.date).format("YYYY"),
          dataBookByDocumentTypes: arr,
        };
        generateDocument(
          MauInBienBanKiemKeTheoDanhSach,
          "Mẫu in biên bản kiểm kê theo danh sách.docx",
          table,
        );
        openNotificationWithIcon("success", "in danh sách kiểm kê thành công");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "warning",
          "in danh sách kiểm kê thất bại",
          err.response?.data?.message,
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="ModalPrintListForAuditReceipt">
      <Modal
        title={<Typography.Text strong>In danh sách kiểm kê</Typography.Text>}
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label={<Typography.Text strong>Loại sách</Typography.Text>}
            rules={[{ required: true, message: "Vui lòng chọn loại sách" }]}
            required
            name={"IdDocumentType"}
          >
            <Select
              showSearch
              loading={loadingDocumentType}
              placeholder="Chọn loại sách"
              optionFilterProp="label"
            >
              <Select.Option
                key={"00000000-0000-0000-0000-000000000000"}
                value={"00000000-0000-0000-0000-000000000000"}
                label={"Tất cả"}
              >
                Tất cả
              </Select.Option>
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
          <Form.Item
            label={<Typography.Text strong>Sắp xếp</Typography.Text>}
            rules={[{ required: true, message: "Vui lòng chọn loại sắp xếp" }]}
            required
            name={"sortByCondition"}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={[
                {
                  label: "Số ĐKCB",
                  value: 0,
                },
                {
                  label: "Ký hiệu phân loại",
                  value: 1,
                },
                {
                  label: "Ký hiệu tên sách",
                  value: 2,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={<Typography.Text strong>Đến ngày</Typography.Text>}
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            required
            name={"date"}
          >
            <DatePicker format={"DD/MM/YYYY"} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export const ModalPrintListForAuditReceipt = WithErrorBoundaryCustom(
  _ModalPrintListForAuditReceipt,
);
