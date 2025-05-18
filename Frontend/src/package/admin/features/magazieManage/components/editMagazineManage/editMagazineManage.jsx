import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { openNotificationWithIcon } from "../../../../../client/utils";
import { dataLanguageWord } from "../../../../../client/utils/dataLanguageWord";
import { getBase64 } from "../../../../../client/utils/getBase64";
import { books } from "../../../../api/books";
import { categoryPublishers } from "../../../../api/categoryPublishers";
import { categorySignV1 } from "../../../../api/categorySignV1";
import { documentType } from "../../../../api/documentType";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormGroup,
  ProFormMoney,
  ProFormSelect,
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
import moment from "moment/moment";

export function EditMagazineManage() {
  const navigate = useNavigate();
  const param = useParams();

  const [DocumentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});
  const [formRef] = Form.useForm();

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
      const status = Boolean(info.fileList[0]?.originFileObj);
      if (status) {
        message.success(`${info.file.name} Tải tài liệu thành công.`);
      } else if (!status) {
        message.error(`${info.file.name} tải lên tệp không thành công.`);
      }
    },

    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
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
    const fetchData = async () => {
      Promise.allSettled([
        categorySignV1
          .readAll()
          .then((res) => {
            setCategorySign_v1(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Thông báo",
              err?.response?.data?.message || err?.message,
            );
          }),
        documentType
          .getAllNotPage(2)
          .then((res) => {
            setDocumentType(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách loại tài liệu thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        books
          .getById(param.id)
          .then((res) => {
            setBook(res);
            formRef.setFieldsValue({
              ...res?.document,
              publishYear: res?.document?.publishYear
                ? moment(res?.document?.publishYear)
                : null,
            });
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy thông tin sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        categoryPublishers
          .getAll()
          .then((res) => {
            setCategoryPublish(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "errror",
              "Lấy danh mục nhà xuất bản thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]).then(() => {
        setLoading(false);
      });
    };

    fetchData();
  }, [param.id]);

  useEffect(() => {
    document.title = "Chỉnh sửa sách";
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("docName", values.docName || "");
    formData.append(
      "documentTypeId",
      values.documentTypeId || book.document.documentTypeId || null,
    );
    formData.append("magazineNumber", values.magazineNumber || "");
    formData.append("id", book.document.id);
    formData.append("status", 2);
    formData.append("createdDate", values?.createdDate || null);

    // formData.append("IdDocumentAvartar", book.listAvatar[0]?.id || "00000000-0000-0000-0000-000000000000");
    // formData.append("author", values.author || "");
    // formData.append("description", values.description || "");
    // formData.append("language", values.language || "");
    // formData.append("price", values.price || 0);
    // formData.append("publishYear", values.publishYear || "");
    // formData.append("idCategorySign_V1", values.idCategorySign_V1 || book.document.idCategorySign_V1 || null);
    // formData.append("publisher", values.publisher || "");
    // formData.append(
    //   "isHavePhysicalVersion",
    //   values.isHavePhysicalVersion === undefined ? book.document.isHavePhysicalVersion : values.isHavePhysicalVersion
    // );
    // formData.append(
    //   "isApproved",
    //   values.isApproved === undefined ? book.document.isApproved : values.isApproved || false
    // );
    // formData.append("Image", values?.avatar?.fileList.length > 0 ? values?.avatar?.fileList[0]?.originFileObj : null);
    // formData.append("File", values?.PDF?.fileList.length > 0 ? values?.PDF?.fileList[0]?.originFileObj : null);

    books
      .update(formData)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật sách thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/danh-muc-bao");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật sách thất bại",
          err?.response?.data?.message || err?.message,
        );
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
              Chỉnh sửa sách báo, tạp chí
            </Typography.Title>
            <Skeleton loading={loading} active>
              <ProForm
                form={formRef}
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
                        Sách báo mới
                      </Typography.Title>
                    }
                  >
                    <ProFormDatePicker
                      name={"createdDate"}
                      label="Ngày đăng ký báo"
                      required
                      placeholder="Ngày đăng ký báo"
                      format="DD/MM/YYYY"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn Ngày đăng ký báo",
                        },
                      ]}
                      width={200}
                    />
                    <ProFormText
                      width="xl"
                      name="docName"
                      required
                      label="Tên sách báo"
                      tooltip="Tên sách báo"
                    />
                    <ProFormText
                      width="xl"
                      name="magazineNumber"
                      required
                      label="Số báo"
                      tooltip="Số báo"
                      placeholder={"Số báo"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập Số báo!",
                        },
                      ]}
                    />
                    <ProFormSelect
                      required
                      name="documentTypeId"
                      label="Loại sách báo"
                      placeholder={"loại sách báo"}
                      showSearch
                      options={DocumentType.map((item) => ({
                        value: item.id,
                        label: item.docTypeName,
                      }))}
                    />

                    {/* <ProFormSelect
                      showSearch
                      name="language"
                      label="Ngôn ngữ"
                      placeholder={"Ngôn ngữ"}
                      value={book?.document?.language ? book?.document?.language : ""}
                      options={[
                        ...dataLanguageWord.map((item) => ({
                          value: item.name,
                          label: item.name
                        }))
                      ]}
                    /> */}
                  </ProFormGroup>

                  {/* <ProForm.Group
                    style={{ marginLeft: 100 }}
                    label={<Typography.Title level={5}>Tình trạng</Typography.Title>}
                  >
                    <ProFormSelect
                      width="lg"
                      label="Bản vật lý"
                      size="large"
                      name="isHavePhysicalVersion"
                      value={book?.document?.isHavePhysicalVersion}
                      options={[
                        {
                          value: true,
                          label: "Còn"
                        },
                        {
                          value: false,
                          label: "Đã mất"
                        }
                      ]}
                    />
                  </ProForm.Group> */}
                </ProFormGroup>
                {/* <ProForm.Group label={<Typography.Title level={5}>Thông tin</Typography.Title>}>
                  <ProFormSelect
                    width={330}
                    name={"publisher"}
                    label="Nhà xuất bản"
                    placeholder={"Nhà xuất bản"}
                    showSearch
                    options={[
                      ...CategoryPublish.map((item) => ({
                        value: item.publisherName,
                        label: `${item.publisherCode} - ${item.publisherName}`
                      }))
                    ]}
                    value={book?.document?.publisher}
                  />
                </ProForm.Group>

                <ProForm.Group>
                  <ProFormSelect
                    width={330}
                    required
                    name="idCategorySign_V1"
                    label="Kí hiệu phân loại"
                    placeholder={"Kí hiệu phân loại"}
                    value={book?.document?.idCategorySign_V1}
                    showSearch
                    options={CategorySign_v1.map((item) => ({
                      value: item.id,
                      label: `${item.signCode} - ${item.signName}`
                    }))}
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
                    value={book?.document?.author}
                  />
                  <ProFormMoney
                    label="Giá"
                    name="price"
                    locale="vi-VN"
                    min={0}
                    width="lg"
                    placeholder={"Giá"}
                    value={book?.document?.price}
                  />
                </ProForm.Group>

                <ProFormTextArea
                  name={"description"}
                  label="Ghi chú"
                  width="lg"
                  placeholder={"..."}
                  value={book?.document?.description}
                />

                <ProForm.Group label={<Typography.Title level={5}>Files</Typography.Title>}>
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
                        const isJpgOrPng = file.type === "image/jpg" || file.type === "image/png";
                        if (!isJpgOrPng) {
                          message("warning", "Bạn chỉ có thể tải lên JPG/PNG file!");
                        }
                        const isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                          message("warning", "Hình ảnh phải nhỏ hơn 2MB!");
                        }
                        //check wigth: 400px; height: 600px;
                        const img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = () => {
                          const width = img.width;
                          const height = img.height;
                          if (width !== 400 || height !== 600) {
                            message("warning", "Hình ảnh phải là 400px * 600px!");
                            return false;
                          }
                        };

                        return isJpgOrPng && isLt2M;
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
                      <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                      <p className="ant-upload-hint">Vui lòng chọn tệp PDF có giới hạn 150MB</p>
                    </Upload.Dragger>
                  </Form.Item>
                </ProForm.Group> */}
              </ProForm>
            </Skeleton>
            <Skeleton loading={loading} active />
            <Skeleton loading={loading} active />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// export const EditMagazineManage = WithErrorBoundaryCustom(_EditMagazineManage);
