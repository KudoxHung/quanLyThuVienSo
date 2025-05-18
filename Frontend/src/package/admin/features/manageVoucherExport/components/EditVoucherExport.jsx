import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VariableSizeList } from "react-window";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { auditReceipt } from "../../../api/auditReceipt";
import { categoryPublishers } from "../../../api/categoryPublishers";
import { receipt } from "../../../api/receipt";
import ModalProgress from "../../../components/ModalProgress/ModalProgress";
import { ModalAddLineExportBooks } from "../../ExportBooks";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

function _EditVoucherExport() {
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [UserAdmin, setUserAdmin] = useState([]);
  const [optionsNameParticipant, setOptionsNameParticipant] = useState([]);
  const [optionsNameParticipantSearch, setOptionsNameParticipantSearch] =
    useState([]);
  const [optionsMissionParticipant, setOptionsMissionParticipant] = useState(
    [],
  );
  const [optionsMissionParticipantSearch, setOptionsMissionParticipantSearch] =
    useState([]);
  const [optionsPositionParticipant, setOptionsPositionParticipant] = useState(
    [],
  );
  const [
    optionsPositionParticipantSearch,
    setOptionsPositionParticipantSearch,
  ] = useState([]);
  const [StatusBook, setStatusBook] = useState([]);
  const [isOpenAddLine, setIsOpenAddLine] = useState(false);
  const [listIdIndividualSelected, setListIdIndividualSelected] = useState("");
  const [startProgress, setStartProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Xuất sách";
  }, []);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      receipt
        .GetReceiptExportBooksById(params.id)
        .then((res) => {
          form.setFieldsValue({
            ...res,
            documentListId: res.documentListId.map((x) => {
              return (x = {
                ...x,
                idDocument: x.idDocument,
                idIndividualSample: x.idIndividual,
                numIndividual: x.numIndividual?.split("/")[0],
              });
            }),
            participants: res.participants.map((x) => {
              return (x = {
                ...x,
                name: x.name,
                position: x.position,
                mission: x.mission,
                note: x.note,
              });
            }),
            createdDate: moment(res.receipt.createdDate),
            exportDate: moment(res.receipt.exportDate),
            recordBookDate: moment(res.receipt.recordBookDate),
            reason: res.receipt.reason,
            receiverName: res.receipt.receiverName,
            receiverPosition: res.receipt.receiverPosition,
            receiverUnitRepresent: res.receipt.receiverUnitRepresent,
            deliverName: res.receipt.deliverName,
            deliverPosition: res.receipt.deliverPosition,
            deliverUnitRepresent: res.receipt.deliverUnitRepresent,
            receiptNumber: res.receipt.receiptNumber,
            idReceipt: res.receipt.idReceipt,
            note: res.receipt.note,
          });
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Lấy thông tin phiếu xuất thất bại",
            err?.reponese?.data?.message,
          );
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const handleSearchNameParticipant = (value) => {
    setOptionsNameParticipantSearch(
      !value
        ? []
        : optionsNameParticipant.filter((item) => item.value.includes(value)),
    );
  };
  const handleSearchPositionParticipant = (value) => {
    setOptionsPositionParticipantSearch(
      !value
        ? []
        : optionsPositionParticipant.filter((item) =>
            item.value.includes(value),
          ),
    );
  };
  const handleSearchMissionParticipant = (value) => {
    setOptionsMissionParticipantSearch(
      !value
        ? []
        : optionsMissionParticipant.filter((item) =>
            item.value.includes(value),
          ),
    );
  };

  const handleSubmit = (values) => {
    setLoading(true);

    if (values.documentListId.length === 0) {
      setLoading(false);
      return openNotificationWithIcon(
        "warning",
        "Vui lòng chọn sách",
        "Vui lòng chọn sách",
      );
    }

    values.receiverIdUser = "00000000-0000-0000-0000-000000000000";
    values.createdDate = values.createdDate || moment().format("YYYY-MM-DD");
    values.recordBookDate =
      values.recordBookDate || moment().format("YYYY-MM-DD");
    values.exportDate = values.exportDate || moment().format("YYYY-MM-DD");
    receipt
      .UpdateReceiptExportBooks(values)
      .then((res) => {
        if (res.success) {
          openNotificationWithIcon(
            "success",
            "Thông báo thành công !",
            res?.message,
          );
          setLoading(false);
          return navigate("/admin/phieu-xuat");
        } else {
          setLoading(false);
          openNotificationWithIcon(
            "warning",
            "Có lỗi khi chỉnh sửa phiếu xuất !",
            res?.message,
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        openNotificationWithIcon(
          "error",
          "Có lỗi khi chỉnh sửa phiếu xuất !",
          "",
        );
        console.log("err :>> ", err);
      });
  };

  return (
    <Spin spinning={loading}>
      <div className="layout-content">
        <ModalProgress
          start={startProgress}
          title={"Tiến trình đang thực hiện"}
        />
        <ModalAddLineExportBooks
          visible={isOpenAddLine}
          setVisible={setIsOpenAddLine}
          form={form}
          StatusBook={StatusBook}
          listIdIndividualSelected={listIdIndividualSelected}
          setStartProgress={setStartProgress}
        />

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Card bordered={false} className="criclebox h-full">
            <Form.Item name={"idReceipt"} hidden></Form.Item>
            <Row gutter={[24, 0]}>
              {/* Form thông tin cơ bản của xuất sách*/}
              <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormText
                    width="md"
                    name="receiptType"
                    initialValue={1}
                    hidden
                  />
                  <ProFormDatePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày tạo phiếu"
                    required
                    placeholder="Ngày xuất"
                    value={moment()}
                    format="DD/MM/YYYY"
                    disabled={true}
                    tooltip="Ngày tạo phiếu trên hệ thống"
                  />
                  <ProFormDatePicker
                    width="md"
                    name={"exportDate"}
                    label="Ngày xuất"
                    required
                    placeholder="Ngày xuất"
                    value={moment()}
                    format="DD/MM/YYYY"
                  />
                  <ProFormDatePicker
                    width="md"
                    name={"recordBookDate"}
                    label="Ngày vào sổ"
                    required
                    placeholder="Ngày vào sổ"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn Ngày vào sổ",
                      },
                    ]}
                  />
                  <ProFormText
                    width="xl"
                    name="receiptNumber"
                    required
                    label="Số chứng từ"
                    tooltip="Số chứng từ"
                    placeholder={"Số chứng từ"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số chứng từ",
                      },
                    ]}
                  />
                </ProForm.Group>

                <ProForm.Group>
                  <ProFormTextArea
                    name={"reason"}
                    label="Lý do xuất"
                    placeholder="Lý do xuất"
                    width="xl"
                  />
                </ProForm.Group>

                <ProFormGroup>
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>Người xuất</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="receiverName"
                      required
                      label="Tên người xuất"
                      tooltip="Tên người xuất"
                    />
                    <ProFormText
                      width="xl"
                      name="receiverPosition"
                      label="Chức vụ người xuất"
                      placeholder={"Chức vụ người xuất"}
                    />
                    <ProFormText
                      width="xl"
                      name="receiverUnitRepresent"
                      label="Đại diện bên xuất"
                      placeholder={"Đại diện bên xuất"}
                    />
                  </ProFormGroup>
                </ProFormGroup>

                <ProFormGroup>
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>Người nhận</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="deliverName"
                      required
                      label="Tên người nhận"
                      tooltip="Tên người nhận"
                      placeholder={"Tên người nhận"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên người nhận",
                        },
                      ]}
                    />
                    <ProFormText
                      width="xl"
                      name="deliverPosition"
                      label="Chức vụ bên nhận"
                      placeholder={"Chức vụ bên nhận"}
                    />
                    <ProFormText
                      width="xl"
                      name="deliverUnitRepresent"
                      label="Đại diện bên nhận"
                      placeholder={"Đại diện bên nhận"}
                    />
                  </ProFormGroup>
                </ProFormGroup>

                <ProFormGroup
                  label={
                    <Typography.Title level={5}>
                      Thành phần tham dự
                    </Typography.Title>
                  }
                >
                  <Form.List name="participants">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            style={{
                              display: "flex",
                              marginBottom: 8,
                            }}
                            align="baseline"
                          >
                            <Form.Item {...restField} name={[name, "name"]}>
                              <AutoComplete
                                options={optionsNameParticipantSearch}
                                onSearch={handleSearchNameParticipant}
                              >
                                <Input placeholder="Họ và tên" />
                              </AutoComplete>
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "position"]}>
                              <AutoComplete
                                options={optionsPositionParticipantSearch}
                                onSearch={handleSearchPositionParticipant}
                              >
                                <Input placeholder="Chức vụ" />
                              </AutoComplete>
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "mission"]}>
                              <AutoComplete
                                options={optionsMissionParticipantSearch}
                                onSearch={handleSearchMissionParticipant}
                              >
                                <Input placeholder="Nhiệm vụ" />
                              </AutoComplete>
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "note"]}>
                              <TextArea placeholder="Ghi chú" rows={1} />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Thêm thành phần
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </ProFormGroup>
              </Col>

              {/*Button chọn sách*/}
              <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                <Button
                  type="dashed"
                  onClick={() => {
                    const listIdIndividualSelected = form
                      .getFieldValue("documentListId")
                      ?.map((item) => item.idIndividual);
                    setListIdIndividualSelected(listIdIndividualSelected);
                    setIsOpenAddLine(true);
                  }}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 20 }}
                >
                  Chọn sách
                </Button>
              </Col>

              {/*Danh sách sách đã chọn*/}
              <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Danh sách Sách đã chọn" key="1">
                    <Card bordered={false} className={"criclebox"}>
                      <Form.List name="documentListId">
                        {(fields, { add, remove }) => (
                          <div>
                            <VariableSizeList
                              height={400}
                              itemCount={fields.length}
                              itemSize={() => 50}
                              width="100%"
                            >
                              {({ index, style }) => {
                                const { key, name, ...restField } =
                                  fields[index];
                                const bookName = form.getFieldValue([
                                  "documentListId",
                                  name,
                                  "bookName",
                                ]);
                                return (
                                  <div key={key} style={style}>
                                    <Form.Item
                                      name={[name, "idDocument"]}
                                      hidden
                                    />
                                    <Form.Item
                                      name={[name, "idIndividualSample"]}
                                      hidden
                                    />
                                    <Space
                                      key={name}
                                      style={{
                                        marginBottom: -8,
                                      }}
                                      wrap
                                    >
                                      <Form.Item
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              STT
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <Typography.Text
                                          style={{
                                            width: 50,
                                            display: "inline-block",
                                          }}
                                          strong
                                        >
                                          {name + 1}
                                        </Typography.Text>
                                      </Form.Item>

                                      <Tooltip title={bookName}>
                                        <Form.Item
                                          {...restField}
                                          style={{ width: 250 }}
                                          name={[name, "documentName"]}
                                          label={
                                            name === 0 ? (
                                              <Typography.Text strong>
                                                Tên sách
                                              </Typography.Text>
                                            ) : (
                                              " "
                                            )
                                          }
                                        >
                                          <Input placeholder="Sách" readOnly />
                                        </Form.Item>
                                      </Tooltip>
                                      <Form.Item
                                        {...restField}
                                        style={{ width: 100 }}
                                        name={[name, "numIndividual"]}
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              Số ĐKCB
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <Input
                                          placeholder="Số ĐKCB"
                                          readOnly
                                          style={{
                                            fontWeight: "bold",
                                            color: "black",
                                          }}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        {...restField}
                                        style={{ width: 150 }}
                                        name={[name, "publisher"]}
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              Nhà xuất bản
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <Input
                                          placeholder="Loại sách"
                                          readOnly
                                        />
                                      </Form.Item>

                                      <Form.Item
                                        {...restField}
                                        style={{ width: 100 }}
                                        name={[name, "price"]}
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              Giá bìa
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <InputNumber
                                          placeholder="Giá bìa"
                                          readOnly
                                          min={0}
                                          formatter={(value) =>
                                            `${value} đ`.replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ",",
                                            )
                                          }
                                          parser={(value) =>
                                            value.replace(/\$\s?|(,*)/g, "")
                                          }
                                        />
                                      </Form.Item>

                                      <Form.Item
                                        {...restField}
                                        name={[name, "statusIndividual"]}
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              Tình trạng sách
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <Input
                                          placeholder="Tình trạng sách"
                                          readOnly
                                        />
                                      </Form.Item>

                                      <Form.Item
                                        {...restField}
                                        name={[name, "note"]}
                                        label={
                                          name === 0 ? (
                                            <Typography.Text strong>
                                              Ghi chú
                                            </Typography.Text>
                                          ) : (
                                            " "
                                          )
                                        }
                                      >
                                        <Input placeholder="Ghi chú" />
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                      />
                                    </Space>
                                  </div>
                                );
                              }}
                            </VariableSizeList>
                          </div>
                        )}
                      </Form.List>
                    </Card>
                  </Tabs.TabPane>
                </Tabs>
              </Col>

              <Divider />

              {/*Button gửi form*/}
              <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={btnLoading}
                    block
                  >
                    Lưu chỉnh sửa
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </Spin>
  );
}

export const EditVoucherExport = WithErrorBoundaryCustom(_EditVoucherExport);
