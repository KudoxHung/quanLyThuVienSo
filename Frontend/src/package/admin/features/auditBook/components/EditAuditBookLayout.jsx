import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VariableSizeList } from "react-window";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { auditMethod } from "../../../api/auditMethod";
import { auditReceipt } from "../../../api/auditReceipt";
import { statusBook } from "../../../api/statusBook.";
import ModalProgress from "../../../components/ModalProgress/ModalProgress";
import { AddRedundantBooks } from "./AddRedundantBooks";
import { ConfirmationOfLostBook } from "./ConfirmationOfLostBook";
import { ModalAddLineAuditReceipt } from "./ModalAddLineAuditReceipt";
import { extracted } from "./NewAuditBookLayout";
import {
  CheckOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";

function _EditAuditBookLayout() {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const [isOpenAddRedundantBooks, setIsOpenAddRedundantBooks] = useState(false);
  const [isOpenConfirmationOfLostBook, setIsOpenConfirmationOfLostBook] =
    useState(false);
  const [listIdIndividualSelect, setListIdIndividualSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullInventory, setIsFullInventory] = useState(false);
  const [isOpenAddLine, setIsOpenAddLine] = useState(false);
  const [listIdIndividualSelected, setListIdIndividualSelected] = useState("");
  const [startProgress, setStartProgress] = useState(false);
  //user
  const [Users, setUsers] = useState([]);
  //status book
  const [StatusBook, setStatusBook] = useState([]);
  const [StatusBookSuperfluous, setStatusBookSuperfluous] = useState([]);
  //auditMethod
  const [AuditMethod, setAuditMethod] = useState([]);
  //auditReceipt
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    window.document.title = "Chỉnh sửa biên bản kiểm kê";
    const fetchData = async () => {
      await Promise.all([
        users
          .getAllUsersNotBlock(0, 0)
          .then((res) => {
            setUsers(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách người dùng thất bại",
              err?.reponese?.data?.message,
            );
          }),
        statusBook
          .getAllNotPagination()
          .then((res) => {
            setStatusBook(res?.listPayload);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách trạng thái sách thất bại",
              err?.reponese?.data?.message,
            );
          }),
        statusBook
          .GetAllStatusBook(0, 0, 2)
          .then((res) => {
            setStatusBookSuperfluous(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách trạng thái sách thừa thất bại",
              err?.reponese?.data?.message,
            );
          }),
        auditMethod
          .GetAllAuditMethod(0, 0)
          .then((res) => {
            setAuditMethod(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách phương pháp kiểm kê thất bại",
              err?.reponese?.data?.message,
            );
          }),
        auditReceipt
          .CountAllNumberOfBook()
          .then((res) => {
            setQuantity(res?.quantity);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy số lượng sách thất bại",
              err?.reponese?.data?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (params.id) {
      setLoading(true);
      auditReceipt
        .GetAuditReceiptById(params.id)
        .then((res) => {
          form.setFieldsValue({
            ...res,
            CreateAndToDate: [
              moment(res.reportCreateDate),
              moment(res.reportToDate),
            ],
            auditBookListPayloads: res.datas.map((x) => {
              return (x = {
                ...x,
                idDocument: x.idBook,
                idIndividualSample: x.idIndividual,
                numIndividual: x.numIndividual?.split("/")[0],
              });
            }),
            auditorModels: res.dataAuditor,
            id: res.idAuditReceipt,
          });
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Lấy thông tin phiếu kiểm kê thất bại",
            err?.reponese?.data?.message,
          );
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);
  const handleSubmit = (values) => {
    setBtnLoading(true);
    values.reportCreateDate = values.CreateAndToDate[0];
    values.reportToDate = values.CreateAndToDate[1];
    auditReceipt
      .UpdateAuditReceipt(values)
      .then((res) => {
        if (res.success) {
          openNotificationWithIcon("success", res.message);
          return navigate("/admin/kiem-ke-sach");
        } else {
          openNotificationWithIcon("warn", res.message);
          return false;
        }
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Chỉnh sửa phiếu kiểm kê thất bại",
          err?.reponese?.data?.message,
        );
      })
      .finally(() => setBtnLoading(false));
  };
  const handleSearchBarCode = extracted(form, StatusBook);
  useEffect(() => {
    if (AuditMethod) {
      form.setFieldsValue({
        idAuditMethod: AuditMethod?.find(
          (x) => x.nameMethod === "Kiểm kê định kỳ",
        )?.id,
      });
    }
  }, [AuditMethod]);
  return (
    <Spin spinning={loading}>
      <div className="EditAuditBookLayout">
        <ModalProgress
          start={startProgress}
          title={"Tiến trình đang thực hiện"}
        />
        <AddRedundantBooks
          visible={isOpenAddRedundantBooks}
          setVisible={setIsOpenAddRedundantBooks}
          form={form}
          StatusBook={StatusBook}
        />
        <ConfirmationOfLostBook
          visible={isOpenConfirmationOfLostBook}
          setVisible={setIsOpenConfirmationOfLostBook}
          listIdIndividualSelect={listIdIndividualSelect}
          setStartProgress={setStartProgress}
          form={form}
        />
        <ModalAddLineAuditReceipt
          visible={isOpenAddLine}
          setVisible={setIsOpenAddLine}
          form={form}
          StatusBook={StatusBook}
          listIdIndividualSelected={listIdIndividualSelected}
          setStartProgress={setStartProgress}
        />
        <Row gutter={[24, 24]}>
          <Col sm={24} xs={24} md={24} lg={24} xl={24}>
            <Typography.Title level={3}>
              Chỉnh sửa biên bản kiểm kê
            </Typography.Title>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Card bordered={false} className={"criclebox"}>
                <Form.Item name={"id"} hidden></Form.Item>
                <Form.Item
                  label={
                    <Typography.Text strong>
                      Thời gian lập biên bản kiểm kê
                    </Typography.Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập thời gian lập biên bản kiểm kê",
                    },
                  ]}
                  required
                  name={"CreateAndToDate"}
                >
                  <DatePicker.RangePicker
                    style={{ width: "80%" }}
                    format={"DD/MM/YYYY"}
                    placeholder={["Ngày lập biên bản", "Ngày kiểm kê đến"]}
                  />
                </Form.Item>
                <Form.Item
                  name={"note"}
                  label={<Typography.Text strong>Ghi chú</Typography.Text>}
                >
                  <Input.TextArea
                    placeholder="Ghi chú"
                    rows={3}
                  ></Input.TextArea>
                </Form.Item>
                <Spin spinning={AuditMethod.length === 0}>
                  <Form.Item
                    label={
                      <Typography.Text strong>
                        Phương pháp kiểm kê
                      </Typography.Text>
                    }
                    name={"idAuditMethod"}
                    required
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phương pháp kiểm kê",
                      },
                    ]}
                  >
                    <Radio.Group
                      buttonStyle="solid"
                      onChange={(e) => {
                        if (e.target.label === "Kiểm kê bất thường") {
                          setIsFullInventory(true);
                          form.setFieldsValue({
                            barcodeValue: "",
                          });
                        } else {
                          setIsFullInventory(false);
                          form.setFieldsValue({
                            barcodeValue: "",
                          });
                        }
                      }}
                    >
                      {AuditMethod?.map((item) => (
                        <Radio.Button
                          key={item.id}
                          value={item.id}
                          label={item.nameMethod}
                        >
                          {item.nameMethod}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Spin>
                <Form.Item
                  label={<Typography.Text strong>Tác vụ</Typography.Text>}
                >
                  <Space wrap>
                    <Button
                      type="primary"
                      onClick={() => {
                        const listIdIndividualSelected = form
                          .getFieldValue("auditBookListPayloads")
                          ?.map((item) => item.idIndividual);
                        setListIdIndividualSelected(listIdIndividualSelected);
                        setIsOpenAddLine(true);
                      }}
                    >
                      Thêm sách kiểm kê
                    </Button>
                    <Button
                      type="dashed"
                      onClick={() =>
                        form.setFieldsValue({
                          auditBookListPayloads: [],
                        })
                      }
                    >
                      Bỏ chọn tất cả sách
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setIsOpenAddRedundantBooks(true)}
                    >
                      Thêm sách thừa
                    </Button>
                    <Button
                      type="default"
                      onClick={() => {
                        setIsOpenConfirmationOfLostBook(true);
                        setListIdIndividualSelect(
                          form
                            .getFieldValue("auditBookListPayloads")
                            ?.map((item) => item.idIndividual),
                        );
                      }}
                    >
                      Xác nhận sách mất
                    </Button>
                  </Space>
                </Form.Item>
              </Card>

              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Kiểm kê kết quả" key="1">
                  <Space direction={"horizontal"} size={"large"} wrap={true}>
                    {!isFullInventory && (
                      <Typography.Title level={5}>
                        Tổng số sách: {quantity}
                      </Typography.Title>
                    )}
                  </Space>
                  <Form.Item name={"barcodeValue"}>
                    <Input.TextArea
                      placeholder="Vị trí quét mã vạch"
                      onChange={handleSearchBarCode}
                    ></Input.TextArea>
                  </Form.Item>
                  <Card bordered={false} className={"criclebox"}>
                    <Form.List name="auditBookListPayloads">
                      {(fields, { add, remove }) => (
                        <div>
                          <VariableSizeList
                            height={400}
                            itemCount={fields.length}
                            itemSize={() => 50}
                            width="100%"
                          >
                            {({ index, style }) => {
                              const { key, name, ...restField } = fields[index];
                              const bookName = form.getFieldValue([
                                "auditBookListPayloads",
                                name,
                                "bookName",
                              ]);

                              return (
                                <div key={key} style={style}>
                                  <Form.Item name={[name, "barcode"]} hidden />
                                  <Form.Item
                                    name={[name, "idDocument"]}
                                    hidden
                                  />
                                  <Form.Item
                                    name={[name, "idIndividualSample"]}
                                    hidden
                                  />
                                  <Form.Item
                                    name={[name, "idTypeBook"]}
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
                                        style={{ width: 140 }}
                                        name={[name, "bookName"]}
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
                                      style={{ width: 80 }}
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
                                      style={{ width: 130 }}
                                      name={[name, "typeBook"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Loại sách
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Input placeholder="Loại sách" readOnly />
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      style={{ width: 80 }}
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
                                      name={[name, "wasLost"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Trạng thái
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Select
                                        placeholder="Mất?"
                                        style={{ width: 122 }}
                                      >
                                        <Select.Option value={true}>
                                          <Tag color={"error"}>Mất</Tag>
                                        </Select.Option>
                                        <Select.Option value={false}>
                                          <Tag color={"processing"}>Còn</Tag>
                                        </Select.Option>
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "redundant"]}
                                      hidden
                                    >
                                      <Select
                                        disabled
                                        placeholder="Thừa"
                                        style={{ width: 85 }}
                                      >
                                        <Select.Option value={true}>
                                          Thừa
                                        </Select.Option>
                                        <Select.Option value={false}>
                                          Không
                                        </Select.Option>
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "isLiquidation"]}
                                      label={
                                        name === 0 ? (
                                          <Typography.Text strong>
                                            Tình trạng
                                          </Typography.Text>
                                        ) : (
                                          " "
                                        )
                                      }
                                    >
                                      <Select
                                        placeholder="Tình trạng"
                                        style={{ width: 122 }}
                                      >
                                        <Select.Option value={null}>
                                          --Chọn--
                                        </Select.Option>
                                        <Select.Option value={false}>
                                          <Tag color={"warning"}>
                                            Chờ thanh lý
                                          </Tag>
                                        </Select.Option>
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "idStatusBook"]}
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
                                      <Select
                                        showSearch
                                        placeholder={"Tình trạng sách"}
                                        loading={StatusBook.length === 0}
                                      >
                                        {/*{form.getFieldValue("auditBookListPayloads")[name]?.redundant*/}
                                        {/*  ? StatusBookSuperfluous?.map((item) => (*/}
                                        {/*      <Select.Option value={item.id}>{item.nameStatusBook}</Select.Option>*/}
                                        {/*    ))*/}
                                        {/*  : StatusBook?.map((item) => (*/}
                                        {/*      <Select.Option value={item.id}>{item.nameStatusBook}</Select.Option>*/}
                                        {/*    ))}*/}

                                        {StatusBook?.map((item) => (
                                          <Select.Option value={item.id}>
                                            {item.nameStatusBook}
                                          </Select.Option>
                                        ))}
                                      </Select>
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
                <Tabs.TabPane
                  tab="Ban kiểm kê"
                  key="2"
                  style={{ height: 400, overflow: "auto" }}
                >
                  <Form.List name="auditorModels">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={name}
                            style={{
                              display: "flex",
                              marginBottom: 10,
                            }}
                            align="baseline"
                            wrap
                          >
                            {name + 1}
                            <Form.Item
                              {...restField}
                              name={[name, "idUser"]}
                              hidden
                              initialValue={null}
                            />
                            <Form.Item {...restField} name={[name, "name"]}>
                              <Input placeholder="Họ tên" />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "position"]}>
                              <Input placeholder="Vị trí" />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "role"]}>
                              <Input placeholder="Chức vụ" />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, "note"]}>
                              <Input placeholder="Ghi chú" />
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
                            Thêm sách kiểm kê
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Tabs.TabPane>
              </Tabs>
              <Form.Item style={{ marginTop: 10 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ float: "right" }}
                  icon={<CheckOutlined />}
                  loading={btnLoading}
                >
                  Xác nhận
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export const EditAuditBookLayout =
  WithErrorBoundaryCustom(_EditAuditBookLayout);
