import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { books } from "../../../api/books";
import { documentInVoice } from "../../../api/documentInVoice";
import { individualSample } from "../../../api/individualSample";
import { ProForm, ProFormGroup, ProFormText } from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Form,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import moment from "moment/moment";

function _BookLost(props) {
  const { id, setVisiable, postLength1, setPostLength1 } = props;
  const [DocumentInVoice, setDocumentInVoice] = useState({});
  const [loading, setLoading] = useState(true);
  const [Users, setUsers] = useState([]);
  const [Books, setBooks] = useState([]);
  // const [IndividualSample, setIndividualSample] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [SelectedRowKeys, setSelectedRowKeys] = useState([]);
  const [postLength, setPostLength] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        let tmpListIdDocument = "";
        const res = await documentInVoice.getById(id);
        setDocumentInVoice(res);
        console.log("res", res);
        res.documentAndIndividualView.forEach((item) => {
          tmpListIdDocument = tmpListIdDocument + `,${item.idDocument}`;
        });
        books
          .getAll(0, 0, 1, tmpListIdDocument)
          .then((res) => {
            setBooks(res);
            console.log(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy sách thất bại",
              err?.reponese?.data?.message || err?.message,
            );
          })
          .finally(() => {});
      } catch (e) {
        console.log("error => ", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, postLength]);
  useEffect(() => {
    (async () => {
      try {
        const [user, book] = await Promise.all([users.getAllUsers(0, 0)]);
        setUsers(user);
        // setBooks(book);
      } catch (e) {
        console.log("error => ", e);
      }
    })();
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    documentInVoice
      .ChangeStatusDocumentInvoiceVer2({
        status: 3,
        listId: SelectedRowKeys,
      })
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res?.message);
        setPostLength((prevState) => prevState + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
        setVisiable(false);
        setPostLength1(postLength1 + 1);
      });
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={3}>Báo mất sách</Typography.Title>
          <Skeleton loading={loading} active>
            <ProForm
              form={form}
              autoFocusFirstInput
              style={{ padding: 10 }}
              onFinish={onFinish}
              submitter={{
                // Configure the button text
                searchConfig: {
                  resetText: "reset",
                  submitText: "submit",
                },
                // Configure the properties of the button
                resetButtonProps: {
                  style: {
                    // Hide the reset button
                    display: "none",
                  },
                },
                submitButtonProps: {},
                // Fully customize the entire area
                render: (props, doms) => {
                  return [
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Popconfirm
                        title={"Bạn có chắc chắn muốn báo mất sách?"}
                        onConfirm={() => props.form?.submit?.()}
                        okText="Có"
                        cancelText="Không"
                        disabled={SelectedRowKeys.length === 0}
                      >
                        <Button
                          size="large"
                          type="primary"
                          key="submit"
                          loading={btnLoading}
                          disabled={SelectedRowKeys.length === 0}
                          danger
                        >
                          Xác nhận{" "}
                          {SelectedRowKeys.length > 0
                            ? `(${SelectedRowKeys.length})`
                            : ""}
                        </Button>
                      </Popconfirm>
                    </Space>,
                  ];
                },
              }}
            >
              <ProFormGroup
                label={
                  <Typography.Title level={5}>Người mượn</Typography.Title>
                }
              >
                <ProFormText
                  label="Người mượn"
                  showSearch
                  disabled
                  value={
                    Users.find((user) => user.id === DocumentInVoice?.userId)
                      ?.fullname || "Người mượn"
                  }
                />
                <ProFormText
                  label="Số chứng từ"
                  name="invoiceCode"
                  showSearch
                  disabled
                  value={DocumentInVoice?.invoiceCode}
                />
              </ProFormGroup>
              <Card title={<Typography.Title level={5}>Sách</Typography.Title>}>
                <Table
                  dataSource={DocumentInVoice.documentInvoiceDetail}
                  pagination={false}
                  rowKey={(record) => record.id}
                  rowSelection={{
                    selectedRowKeys: SelectedRowKeys,
                    onChange: (selectedRowKeys) => {
                      setSelectedRowKeys(selectedRowKeys);
                    },
                    renderCell: (checked, record, index, originNode) => {
                      const isCompleted = record.isCompleted;
                      return !isCompleted && originNode;
                    },
                    // hideSelectAll: true
                  }}
                >
                  <Table.Column
                    title="STT"
                    render={(text, record, index) => index + 1}
                  />
                  <Table.Column
                    title="Tên sách"
                    dataIndex="idDocument"
                    key="idDocument"
                    render={(text) => (
                      <Link to={`/detail-page/${text}`} target="_blank">
                        {
                          Books.find((book) => book.document.id === text)
                            ?.document?.docName
                        }
                      </Link>
                    )}
                  />
                  <Table.Column
                    title="Mã đăng ký cá biệt sách"
                    dataIndex="idIndividual"
                    key="idIndividual"
                    render={(text) =>
                      DocumentInVoice.documentAndIndividualView
                        .find((indi) => indi.idIndividual === text)
                        ?.numIndividual.split("/")[0]
                    }
                  />
                  <Table.Column
                    title="Thời gian"
                    render={(text, record) => {
                      const dateIn = moment(record.dateIn).format(
                        "DD-MM-YYYY HH:mm",
                      );
                      const dateOut = moment(record.dateOut).format(
                        "DD-MM-YYYY HH:mm",
                      );
                      return (
                        <Space>
                          <Tag color="green-inverse">{dateIn}</Tag>
                          {"=>"}
                          <Tag color="red-inverse">{dateOut}</Tag>
                        </Space>
                      );
                    }}
                  />
                  <Table.Column
                    title="Trạng thái"
                    render={(text, record) => {
                      const status =
                        DocumentInVoice.documentAndIndividualView.find(
                          (indi) => indi.idIndividual === record.idIndividual,
                        )?.status;
                      const isCheck = status === 1;
                      return (
                        <Tag color={isCheck ? "green-inverse" : "red-inverse"}>
                          {isCheck ? "Đã trả" : "Đang mượn"}
                        </Tag>
                      );
                    }}
                  />
                  <Table.Column
                    title="Đã mất"
                    render={(text, record) => {
                      const isLostedPhysicalVersion =
                        DocumentInVoice.documentAndIndividualView.find(
                          (indi) => indi.idIndividual === record.idIndividual,
                        )?.isLostedPhysicalVersion;
                      return (
                        isLostedPhysicalVersion && (
                          <Tag color="red-inverse">Đã mất</Tag>
                        )
                      );
                    }}
                  />
                </Table>
              </Card>
              <Typography.Title level={5} />
            </ProForm>
          </Skeleton>
          <Skeleton loading={loading} active />
          <Skeleton loading={loading} active />
        </Col>
      </Row>
    </div>
  );
}
export const BookLost = WithErrorBoundaryCustom(_BookLost);
