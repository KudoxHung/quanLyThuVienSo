import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UNIT_CONNECTED_CODE,
  UNIT_CONNECTED_NAME,
} from "../../../../../../config";
import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { dataLanguageWord } from "../../../../../client/utils/dataLanguageWord";
import { getBase64 } from "../../../../../client/utils/getBase64";
import { books } from "../../../../api/booksConnect";
import { categoryPublishers } from "../../../../api/categoryPublishersConnect";
import { categorySignV1 } from "../../../../api/categorySignV1Connect";
import { documentType } from "../../../../api/documentTypeConnect";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
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
  message,
  Modal,
  Row,
  Skeleton,
  Typography,
  Upload,
} from "antd";
import { dateTimeValue } from "docx";

function _NewDocumentDigitalConnect() {
  const navigate = useNavigate();
  const [DocumentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [CategoryPublish, setCategoryPublish] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [CategorySign_v1, setCategorySign_v1] = useState([]);

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
        categorySignV1
          .readAll()
          .then((res) => {
            setCategorySign_v1(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh tài liệu kí hiệu phân loại thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        documentType
          .getAllNotPage(3)
          .then((res) => {
            setDocumentType(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh tài liệu loại tài liệu thất bại",
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
      ]);
    };
    fecthData();
  }, []);

  useEffect(() => {
    document.title = "Thêm tài liệu mới";
  }, []);
  const aaa = window._env_.UNIT_CONNECTED_CODE;
  const ccc = window._env_.UNIT_CONNECTED_NAME;
  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("DocName", values.DocName || null);
    formData.append("IdCategorySign_V1", values.IdCategorySign_V1 || null);
    formData.append("author", values.author || null);
    formData.append("description", values.description || null);
    formData.append("DocumentTypeId", values.DocumentTypeId || null);
    formData.append("language", values.language || null);
    formData.append("price", values.price || 0);
    formData.append("publishYear", values.publishYear || " ");
    formData.append("publisher", values.publisher || null);
    formData.append("isHavePhysicalVersion", true);
    formData.append("isApproved", false);
    formData.append("Sort", values.Sort || 0);
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
    formData.append("UnitConnectedName", ccc || null);
    formData.append("UnitConnectedCode", aaa || null);

    books
      .create(formData)
      .then(() => {
        openNotificationWithIcon(
          "success",
          "Thêm tài liệu thành công",
          "Success",
        );
        setBtnLoading(false);
        navigate("/admin/khai-bao-tai-lieu-dung-chung");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thêm tài liệu thất bại",
          err?.response?.data?.message || err?.message,
        );
        console.log(err.message);
        setBtnLoading(false);
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
            <Typography.Title level={3}>
              Thêm mới tài liệu số dùng chung
            </Typography.Title>
            <Skeleton active loading={loading}>
              <ProForm
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
                      <Typography.Title level={5}>
                        Tài liệu mới
                      </Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="DocName"
                      required
                      label="Tên tài liệu"
                      tooltip="Tên tài liệu"
                      placeholder={"Tên tài liệu"}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng nhập tên tài liệu!",
                        },
                      ]}
                    />
                    <ProFormSelect
                      required
                      name="DocumentTypeId"
                      label="Loại tài liệu"
                      placeholder={"Loại tài liệu"}
                      showSearch
                      options={DocumentType.map((item) => ({
                        value: item.id,
                        label: item.docTypeName,
                      }))}
                      rules={[
                        {
                          required: true,
                          message: "vui lòng chọn loại tài liệu!",
                        },
                      ]}
                    />

                    <ProFormSelect
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
                <ProForm.Group>
                  <ProFormDigit
                    label="Thứ tự"
                    name="Sort"
                    initialValue={1}
                    min={1}
                    width="lg"
                    placeholder={"STT"}
                  />
                </ProForm.Group>
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
                    width={330}
                    required
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
                  <Form.Item label="Năm xuất bản" name={"publishYear"}>
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

export const NewDocumentDigitalConnect = WithErrorBoundaryCustom(
  _NewDocumentDigitalConnect,
);
