import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { dataLanguageWord } from "../../../../../client/utils/dataLanguageWord";
import { getBase64 } from "../../../../../client/utils/getBase64";
import { books } from "../../../../api/books";
import { categoryColor } from "../../../../api/categoryColor";
import { categoryPublishers } from "../../../../api/categoryPublishers";
import { categorySignParents } from "../../../../api/categorySignParents";
import { categorySignV1 } from "../../../../api/categorySignV1";
import { documentType } from "../../../../api/documentType";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  ProForm,
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
  Tooltip,
  Typography,
  Upload,
} from "antd";
import moment from "moment";

function _EditBooksManage() {
  const navigate = useNavigate();
  const param = useParams();
  const [formRef] = Form.useForm();

  const [DocumentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});

  const [CategoryPublish, setCategoryPublish] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [CategorySign_v1, setCategorySign_v1] = useState([]);
  const [EncryptDocumentName, setEncryptDocumentName] = useState();
  const [CategoryColor, setCategoryColor] = useState([]);
  const [CategorySignParent, setCategorySignParent] = useState([]);
  const [IdCategory, setIdCategory] = useState();
  const [ParentName, setParentName] = useState();
  const [loadingCategorySign, setLoadingCategorySign] = useState(true);
  //avtar
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [nameV1, setNameV1] = useState("idCategorySign_V1");
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
      if (newFileList.length > 0) {
        newFileList[0].response = "ok";
      }
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
      Promise.all([
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
        categorySignV1
          .readAll()
          .then((res) => {
            setCategorySign_v1(res);
            //setIdCategory(res.idCategoryParent);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách kí hiệu phân loại thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
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
      ]);
    };

    fetchData();
  }, []);
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  useEffect(() => {
    books
      .getById(param.id)
      .then((res) => {
        setBook(res);
        setIdCategory(res.document.idCategoryParent);
        console.log(res.document.idCategorySign_V1);
        //setNameV1(res.document.idCategorySign_V1);
        // console.log("publishYear:" + book.publishYear)
        //   if(book.publishYear === undefined) {
        //       book.publishYear = moment();
        //   }
        setEncryptDocumentName(res?.document?.encryptDocumentName);
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: `${apiUrl}/api/Book/GetFileImage?fileNameId=${res.listAvatar[0]?.id}.${res.listAvatar[0]?.fileNameExtention}`,
          },
        ]);
        setLoading(false);
        formRef.setFieldsValue({
          ...res?.document,
          publishYear: res?.document?.publishYear
            ? moment(res.document.publishYear)
            : null,
        });
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thông tin sách thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  }, [param.id]);
  useEffect(() => {
    if (IdCategory) {
      categorySignParents
        .readById(IdCategory)
        .then((res) => {
          setParentName(res.parentName);
          console.log(res);
          //setLoadingCategorySign(false);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Lấy danh sách kí hiệu phân loại thất bại",
            err?.response?.data?.message || err?.message,
          );
        });
    }
  }, [IdCategory]);
  useEffect(() => {
    document.title = "Chỉnh sửa sách";
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "File" || key === "IdDocumentAvartar" || key === "Image")
        return;
      const processedValue = value || "";
      if (key === "isHavePhysicalVersion") {
        console.log("isHavePhysicalVersion: " + value);

        formData.append("isHavePhysicalVersion", value);
        return;
      }
      formData.append(key, processedValue);
    });
    // console.log(formData.publishYear);
    //   formData.publishYear = formData.publishYear === undefined ? null : formData.publishYear;
    // if (formData.publishYear === undefined) {
    //   console.log(formData.publishYear);
    //   openNotificationWithIcon(
    //     "warning",
    //     "Kiểm tra năm xuất bản, vui lòng nhập hoặc để trống....",
    //     "Bỏ qua thông báo này nếu đã thực hiện"
    //   );
    // }

    formData.append(
      "IdDocumentAvartar",
      book.listAvatar[0]?.id || "00000000-0000-0000-0000-000000000000",
    );
    formData.append(
      "Image",
      values?.avatar?.fileList.length > 0
        ? values?.avatar?.fileList[0]?.originFileObj
        : null,
    );
    formData.append(
      "File",
      values?.PDF?.fileList.length > 0
        ? values?.PDF?.fileList[0]?.originFileObj
        : null,
    );
    formData.append("encryptDocumentName", EncryptDocumentName);

    books
      .update(formData)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật sách thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/khai-bao-sach");
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

  const handleEncryptDocumentName = (e) => {
    const value = e.target.value;
    if (value.length > 0)
      books
        .GetEncryptDocumentName(value)
        .then((res) => {
          setEncryptDocumentName(res);
          console.log(EncryptDocumentName);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const handleCategoryParentChange = (value) => {
    formRef.setFieldsValue({
      idCategorySign_V1: "", // hoặc null, tùy thuộc vào cách bạn muốn hiển thị giá trị trống
    });
    categorySignV1
      .readByIdParent(value)
      .then((res) => {
        //console.log([res]);
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
            <Typography.Title level={3}>Chỉnh sửa sách</Typography.Title>
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
                      <Button
                        size="large"
                        key="back"
                        onClick={() => navigate(-1)}
                      >
                        Quay lại
                      </Button>,
                    ];
                  },
                }}
              >
                <Form.Item name={"id"} hidden />
                <ProFormGroup>
                  <ProFormGroup
                    label={
                      <Typography.Title level={5}>Sách mới</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="docName"
                      required
                      label="Tên sách"
                      tooltip="Tên sách"
                      onBlur={handleEncryptDocumentName}
                    />
                    <ProFormSelect
                      required
                      name="documentTypeId"
                      label="Loại sách"
                      placeholder={"loại sách"}
                      showSearch
                      onBlur={handleEncryptDocumentName}
                      options={DocumentType.map((item) => ({
                        value: item.id,
                        label: item.docTypeName,
                      }))}
                      width="xl"
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
                      width="xl"
                    />
                  </ProFormGroup>
                  <ProForm.Group
                    style={{ marginLeft: 100 }}
                    label={
                      <Typography.Title level={5}>Tình trạng</Typography.Title>
                    }
                  >
                    <ProFormSelect
                      width="lg"
                      label="Bản vật lý"
                      size="large"
                      name="isHavePhysicalVersion"
                      options={[
                        {
                          value: true,
                          label: "Còn",
                        },
                        {
                          value: false,
                          label: "Đã mất",
                        },
                      ]}
                    />
                    <ProFormSwitch
                      width="lg"
                      label="Kiểm duyệt"
                      size="large"
                      name="isApproved"
                      value={book?.document?.isApproved}
                    />
                  </ProForm.Group>
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormText
                    width="xl"
                    name="EncryptDocumentName"
                    label="Ký hiệu nhan đề"
                    placeholder={"Ký hiệu nhan đề"}
                    tooltip={
                      "Tính năng tự động tạo kí hiệu nhan đề sẽ tắt khi người dùng can thiệp thủ công, bấm f5 hoặc tải lại trang để kích hoạt lại tính năng này"
                    }
                    value={EncryptDocumentName}
                    tooltipRender={(title) => (
                      <div style={{ color: "red" }}>{title}</div>
                    )}
                  />
                  <ProFormSelect
                    name="idCategoryColor"
                    label="Trình độ đọc"
                    placeholder={"Trình độ đọc"}
                    tooltip={
                      "Trình độ đọc áp dụng cho một số loại sách, trường này có thể để trống nếu không dùng đến"
                    }
                    showSearch
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
                    width="xl"
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
                    required
                    showSearch
                    options={[
                      ...CategoryPublish.map((item) => ({
                        value: item.publisherName,
                        label: `${item.publisherCode} - ${item.publisherName}`,
                      })),
                    ]}
                    value={book?.document?.publisher}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormSelect
                    loading={loadingCategorySign}
                    width={300}
                    name="IdCategoryParent"
                    placeholder="Tên mã kí hiệu phân loại cha"
                    label="Tên mã kí hiệu phân loại cha"
                    showSearch
                    options={CategorySignParent.map((item) => ({
                      value: item.id,
                      label: `${item.parentCode} - ${item.parentName}`,
                    }))}
                    value={ParentName}
                    onChange={handleCategoryParentChange}
                  />
                  <ProFormSelect
                    width={330}
                    required
                    name={"idCategorySign_V1"}
                    label="Kí hiệu phân loại"
                    placeholder={"Kí hiệu phân loại"}
                    showSearch
                    options={CategorySign_v1.map((item) => ({
                      value: item.id,
                      label: `${item.signCode} - ${item.signName}`,
                    }))}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <Form.Item label="Nơi xuất bản" name={"publishPlace"}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Năm xuất bản
                        <Tooltip
                          title={
                            "Nếu cơ sở dữ liệu để trống không có dữ liệu, thì người dùng nhập vào năm xuất bản"
                          }
                        >
                          <QuestionCircleOutlined
                            style={{ marginLeft: 4, color: "#1890ff" }}
                          />
                        </Tooltip>
                      </span>
                    }
                    name="publishYear"
                  >
                    <DatePicker picker="year" style={{ width: "100%" }} />
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
                            // message(
                            //   "warning",
                            //   "Hình ảnh phải là 400px * 600px!"
                            // );
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
            <Skeleton loading={loading} active />
            <Skeleton loading={loading} active />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const EditBooksManage = WithErrorBoundaryCustom(_EditBooksManage);
