import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { dataLanguageWord } from "../../../../../client/utils/dataLanguageWord";
import { getBase64 } from "../../../../../client/utils/getBase64";
import { books } from "../../../../api/books";
import { categoryColor } from "../../../../api/categoryColor";
import { categoryPublishers } from "../../../../api/categoryPublishers";
import { categorySign } from "../../../../api/categorySign";
import { categorySignParents } from "../../../../api/categorySignParents";
import { categorySignV1 } from "../../../../api/categorySignV1";
import { documentStock } from "../../../../api/documentStock";
import { documentType } from "../../../../api/documentType";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Skeleton,
  Switch,
  TreeSelect,
  Typography,
  Upload,
} from "antd";

function _NewBooksManege() {
  const navigate = useNavigate();
  const [formRef] = Form.useForm();
  const [DocumentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [CategoryPublish, setCategoryPublish] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [CategorySign_v1, setCategorySign_v1] = useState([]);
  const [EncryptDocumentName, setEncryptDocumentName] = useState("");
  const [loadingCategorySignV1, setLoadingCategorySignV1] = useState(false);
  //
  const [CategorySign, setCategorySign] = useState([]);
  const [CategoryColor, setCategoryColor] = useState([]);
  const [loadingCategorySign, setLoadingCategorySign] = useState(true);
  const [loadingCategorySignParent, setLoadingCategorySignParent] =
    useState(true);
  const [visibleRegisterCategorySign, setVisibleRegisterCategorySign] =
    useState(false);
  const [CategorySignParent, setCategorySignParent] = useState([]);
  //avtar
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  //PDF
  const props = {
    name: "file",
    maxCount: 1,
    accept: "application/pdf",

    onChange(info) {
      const status = info.fileList[0]?.originFileObj;
      if (status) {
        // message.success(`Tải tài liệu thành công.`);
      } else if (!status) {
        message.error(`Tải tài liệu thất bại`);
      }
    },
    beforeUpload: (file) => {
      return false;
    },
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    );
  };
  const handleCancel = () => setPreviewVisible(false);
  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      newFileList[0].response = "ok";
    }
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        // categorySignV1
        //   .readAll()
        //   .then((res) => {
        //     setCategorySign_v1(res);
        //   })
        //   .catch((err) => {
        //     openNotificationWithIcon(
        //       "error",
        //       "Lấy danh sách kí hiệu phân loại thất bại",
        //       err?.response?.data?.message || err?.message
        //     );
        //   }),
        documentType
          .getAllNotPage()
          .then((res) => {
            setDocumentType(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách loại tài liệu thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categoryPublishers
          .getAll()
          .then((res) => {
            setCategoryPublish(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "errror",
              "Lấy danh mục nhà xuất bản thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categoryColor
          .getAllNotPagination()
          .then((res) => {
            setCategoryColor(res.listPayload);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "errror",
              "Lấy danh mục trình độ đọc thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categorySignParents
          .readAll()
          .then((res) => {
            setCategorySignParent(res);
            setLoadingCategorySign(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kí hiệu phân loại thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fecthData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        documentStock
          .getAll()
          .then((res) => {
            setLoadingTreeData(false);

            setTreeData(
              res.map((item) =>
                genTreeNode(item?.id, item?.stockName, item?.stockParentId),
              ),
            );
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kho lưu trữ thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categorySign
          .getAll()
          .then((res) => {
            setCategorySign(res);
            setLoadingCategorySignParent(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách mã cá biệt thất bại",
              err?.response?.data?.message || err?.message,
            );
          })
          .finally(() => setLoading(false)),
      ]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    document.title = "Thêm sách mới";
  }, []);
  const [treeData, setTreeData] = useState([]);
  const [loadingTreeData, setLoadingTreeData] = useState(true);
  const genTreeNode = (id, title, parentId) => {
    return {
      id: id,
      pId: parentId,
      value: `${title}/${id}`,
      title: title,
    };
  };
  const onFinish = (values) => {
    setBtnLoading(true);
    console.log(values.IdCategoryParent);
    const formData = new FormData();
    formData.append(
      "EncryptDocumentName",
      values.EncryptDocumentName || EncryptDocumentName || null,
    );
    const regex = /^[0-9]*$/;
    if (visibleRegisterCategorySign === false) {
      formData.append("quantity", values?.quantity || null);
      formData.append("idstock", values?.stockId?.split("/")[1] || null);
      formData.append("SignIndividual", values?.SignIndividual || null);
      formData.append("IdCategory", values?.IdCategory || null);
    } else {
      if (!regex.test(values.quantity) && values.quantity !== undefined) {
        openNotificationWithIcon(
          "warning",
          "Số lượng phải là số",
          "Số lượng sách phải là số",
        );
        setBtnLoading(false);
        return;
      }
      values.IdCategory = values.sign;
      values.SignIndividual = CategorySign.find(
        (item) => item.id === values.sign,
      )?.signCode;
      formData.append("quantity", values?.quantity || 1);
      formData.append("idstock", values?.stockId?.split("/")[1]);
      formData.append("SignIndividual", values?.SignIndividual);
      formData.append("IdCategory", values?.IdCategory);
      formData.append("entryDate", values?.entryDate || null);
      formData.append("generalEntryNumber", values?.generalEntryNumber || null);
    }

    formData.append("DocName", values.DocName || null);
    formData.append("IdCategorySign_V1", values.IdCategorySign_V1 || null);
    formData.append(
      "IdCategoryColor",
      values.IdCategoryColor || "00000000-0000-0000-0000-000000000000",
    );
    formData.append("author", values.author || null);
    formData.append("description", values.description || null);
    formData.append("DocumentTypeId", values.DocumentTypeId || null);
    formData.append("language", values.language || null);
    formData.append("price", values.price || 0);
    formData.append("publishYear", values.publishYear || " ");
    formData.append("publishPlace", values.publishPlace || " ");
    formData.append("publisher", values.publisher || null);
    formData.append("isHavePhysicalVersion", true);
    formData.append("isApproved", false);
    formData.append(
      "Image",
      values.avatar?.fileList.length > 0
        ? values.avatar.fileList[0].originFileObj
        : null,
    );
    formData.append(
      "File",
      values.PDF?.fileList.length > 0
        ? values.PDF.fileList[0].originFileObj
        : null,
    );
    formData.append("supply", values.supply || null);
    formData.append("IdCategoryParent", values.IdCategoryParent || null);
    books
      .InsertDocumentAndIndividualSample(formData)
      .then(() => {
        openNotificationWithIcon("success", "Thêm sách thành công", "Success");
        setBtnLoading(false);
        navigate("/admin/khai-bao-sach");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm sách thất bại",
          err?.response?.data?.message || err?.message,
        );
        console.log(err.message);
        setBtnLoading(false);
      });
  };

  const handleEncryptDocumentName = (e) => {
    const value = e.target.value;
    if (value.length > 0)
      books
        .GetEncryptDocumentName(value)
        .then((res) => {
          formRef.setFieldsValue({
            EncryptDocumentName: res,
          });
          setEncryptDocumentName(res);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleCategoryParentChange = (value) => {
    categorySignV1
      .readByIdParent(value)
      .then((res) => {
        console.log([res]);
        setCategorySign_v1(res);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách kí hiệu phân loại thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  return (
    <div className="layout-content">
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Typography.Title level={3}>Thêm sách mới</Typography.Title>
            <Skeleton active loading={loading}>
              <ProForm
                autoFocusFirstInput
                style={{ padding: 10 }}
                onFinish={onFinish}
                form={formRef}
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
                      <Button
                        size="large"
                        type="primary"
                        key="submit"
                        onClick={() => props.form?.submit?.()}
                        loading={btnLoading}
                      >
                        Xác nhận
                      </Button>,
                      <Button
                        size="large"
                        key="rest"
                        onClick={() => props.form?.resetFields()}
                        loading={btnLoading}
                      >
                        Cài lại
                      </Button>,
                    ];
                  },
                }}
              >
                <ProFormGroup>
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>Sách mới</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="DocName"
                      required
                      onBlur={handleEncryptDocumentName}
                      label="Tên sách"
                      tooltip="Tên sách"
                      placeholder={"Tên sách"}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng nhập tên sách!",
                        },
                      ]}
                    />

                    <ProFormSelect
                      required
                      name="DocumentTypeId"
                      label="Loại sách"
                      placeholder={"Loại sách"}
                      showSearch
                      options={DocumentType.map((item) => ({
                        value: item.id,
                        label: item.docTypeName,
                      }))}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng chọn loại sách!",
                        },
                      ]}
                      width={200}
                    />
                    <ProFormSelect
                      width="xl"
                      required
                      showSearch
                      name="language"
                      label="Ngôn ngữ"
                      placeholder={"Ngôn ngữ"}
                      options={[
                        ...dataLanguageWord.map((item) => ({
                          value: item.name,
                          label: item.name,
                        })),
                      ]}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng chọn ngôn ngữ!",
                        },
                      ]}
                    />
                  </ProFormGroup>

                  <ProForm.Group
                    style={{ marginLeft: 100 }}
                    label={
                      <Typography.Title level={5}>Tình trạng</Typography.Title>
                    }
                  >
                    <ProFormSwitch
                      width="lg"
                      name="isHavePhysicalVersion"
                      label="Bản vật lý"
                      size="large"
                      value={true}
                      disabled
                    />
                    <ProFormSwitch
                      width="lg"
                      name="isApproved"
                      label="Kiểm duyệt"
                      size="large"
                      value={false}
                      disabled
                    />
                  </ProForm.Group>
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormText
                    width="xl"
                    name="EncryptDocumentName"
                    label="Ký hiệu nhan đề"
                    placeholder={"Ký hiệu nhan đề"}
                  />
                  <ProFormSelect
                    name="IdCategoryColor"
                    label="Trình độ đọc"
                    placeholder={"Trình độ đọc"}
                    tooltip={
                      "Trình độ đọc áp dụng cho một số loại sách, trường này có thể để trống nếu không dùng đến"
                    }
                    showSearch
                    defaultValue={null}
                    options={CategoryColor.map((item) => ({
                      value: item.id,
                      label: (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              backgroundColor: `${item.colorCode}`,
                              width: "20px",
                              height: "20px",
                              marginRight: "8px",
                            }}
                          ></div>
                          {`${item.colorName} - ${item.readingLevel}`}
                        </div>
                      ),
                    }))}
                    width={200}
                  />
                  <ProFormText
                    width="xl"
                    name="supply"
                    label="Nguồn cung cấp"
                    placeholder={"Nguồn cung cấp"}
                    defaultValue={null}
                  />
                </ProFormGroup>
                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormSelect
                    width={330}
                    name={"publisher"}
                    label="Nhà xuất bản"
                    placeholder={"Nhà xuất bản"}
                    showSearch
                    required
                    options={[
                      ...CategoryPublish.map((item) => ({
                        value: item.publisherName,
                        label: `${item.publisherCode} - ${item.publisherName}`,
                      })),
                    ]}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng chọn nhà xuất bản!",
                      },
                    ]}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormSelect
                    loading={loadingCategorySignParent}
                    width={300}
                    name="IdCategoryParent"
                    placeholder="Tên mã kí hiệu phân loại cha"
                    label="Tên mã kí hiệu phân loại cha"
                    showSearch
                    options={CategorySignParent.map((item) => ({
                      value: item.id,
                      label: `${item.parentCode} - ${item.parentName}`,
                    }))}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng nhập tên mã kí hiệu phân loại cha",
                      },
                    ]}
                    onChange={handleCategoryParentChange}
                  />
                  <ProFormSelect
                    loading={loadingCategorySignV1}
                    required
                    width={330}
                    name="IdCategorySign_V1"
                    label="Kí hiệu phân loại"
                    placeholder={"Kí hiệu phân loại"}
                    showSearch
                    options={CategorySign_v1.map((item) => ({
                      value: item.id,
                      label: `${item.signCode} - ${item.signName}`,
                    }))}
                    rules={[
                      {
                        required: true,
                        message: "vui lòng chọn kí hiệu phân loại!",
                      },
                    ]}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <Form.Item label="Nơi xuất bản" name={"publishPlace"}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Năm xuất bản"
                    name={"publishYear"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn năm xuất bản",
                      },
                    ]}
                  >
                    <DatePicker picker="year" placeholder="Năm xuất bản" />
                  </Form.Item>

                  <ProFormText
                    width="md"
                    name={"author"}
                    label="Tên tác giả"
                    placeholder="Tên tác giả"
                  />
                  <ProFormMoney
                    label="Giá"
                    name="price"
                    locale="vi-VN"
                    initialValue={0}
                    min={0}
                    width="lg"
                    placeholder={"Giá"}
                  />
                </ProForm.Group>
                <ProFormTextArea
                  name={"description"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                />
                <ProForm.Group
                  label={<Typography.Title level={5}>Files</Typography.Title>}
                >
                  <Form.Item
                    name={"avatar"}
                    label="Hình ảnh"
                    help="Kích thước khuyến nghị 480px x 600px. Định dạng ảnh: jpg, png"
                  >
                    <Upload
                      accept="image/jpg, image/png"
                      name="avatar"
                      listType="picture-card"
                      fileList={fileList}
                      beforeUpload={(file) => {
                        const isJpgOrPng =
                          file.type === "image/jpg" ||
                          file.type === "image/png";
                        if (!isJpgOrPng) {
                          message(
                            "warning",
                            "Bạn chỉ có thể tải lên JPG/PNG file!",
                          );
                        }

                        return isJpgOrPng;
                      }}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      maxCount={1}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                  <Form.Item name={"PDF"} label="PDF">
                    <Upload.Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Nhấp hoặc kéo tệp vào khu vực này để tải lên
                      </p>
                      <p className="ant-upload-hint">
                        Vui lòng chọn tệp PDF có giới hạn 150MB
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </ProForm.Group>
                <Switch
                  size="default"
                  checkedChildren="Thêm đăng ký cá biệt"
                  unCheckedChildren="Không thêm đăng ký cá biệt"
                  defaultChecked={visibleRegisterCategorySign}
                  onChange={(checked) =>
                    setVisibleRegisterCategorySign(checked)
                  }
                />
                {visibleRegisterCategorySign ? (
                  <Fragment>
                    <ProForm.Group>
                      <ProFormDatePicker
                        width="md"
                        name={"entryDate"}
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
                        name="generalEntryNumber"
                        required
                        label="Số vào sổ tổng quát"
                        tooltip="Số vào sổ tổng quát"
                        placeholder={"Số vào sổ tổng quát"}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập Số vào sổ tổng quát",
                          },
                        ]}
                      />
                    </ProForm.Group>

                    <ProForm.Group>
                      <Form.Item
                        label="Kho lưu trữ"
                        name={"stockId"}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn mã cá biệt",
                          },
                        ]}
                      >
                        <TreeSelect
                          showSearch
                          loading={loadingTreeData}
                          treeDataSimpleMode
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          style={{
                            width: 250,
                          }}
                          placeholder="Kho lưu trữ"
                          treeData={treeData}
                        />
                      </Form.Item>

                      <ProFormDigit
                        label="Số lượng"
                        tooltip="Số lượng mã cá biệt muốn tạo, giới hạn tối đa là 100/lần"
                        name="quantity"
                        width="sm"
                        placeholder={"Số lượng"}
                        min={1}
                        defaultValue={1}
                        max={100}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số lượng",
                          },
                        ]}
                      />
                    </ProForm.Group>
                    <ProForm.Group>
                      <ProFormSelect
                        loading={loadingCategorySign}
                        width={300}
                        name="sign"
                        placeholder="Loại mã cá biệt"
                        label="Loại mã cá biệt"
                        showSearch
                        options={CategorySign.map((item) => ({
                          value: item.id,
                          label: `${item.signCode} - ${item.signName}`,
                        }))}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn mã cá biệt",
                          },
                        ]}
                      />
                    </ProForm.Group>
                  </Fragment>
                ) : (
                  <div className="" style={{ marginBottom: 20 }}></div>
                )}
              </ProForm>
            </Skeleton>
            <Skeleton loading={loading} active></Skeleton>
            <Skeleton loading={loading} active></Skeleton>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const NewBooksManege = WithErrorBoundaryCustom(_NewBooksManege);
