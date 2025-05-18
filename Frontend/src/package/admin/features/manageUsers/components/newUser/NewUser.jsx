import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../../client/utils";
import { getBase64 } from "../../../../../client/utils/getBase64";
import { users } from "../../../../api";
import { PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormField,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Modal,
  Row,
  Skeleton,
  Typography,
  Upload,
} from "antd";
import moment from "moment";

function _NewUser() {
  const navigate = useNavigate();
  const [userUnits, setUserUnits] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  //avtar
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
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
      await Promise.all([
        users
          .getAllUnit()
          .then((res) => {
            setUserUnits(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "getAllUnit error",
              err?.response?.data?.message || err?.message,
            );
          }),
        users
          .getAllUserType()
          .then((res) => {
            setUserTypes(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "getAllUserType error",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "New User";
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("AcitveUser", values.effectiveDate.toString());
    formData.append("ExpireDayUser", values.expirationDate.toString());
    formData.append("fullname", values.fullname);
    formData.append("password", values.password);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("userTypeId", values.userTypeId);
    formData.append("address", values.address);
    formData.append("unitId", values.unitId);
    formData.append("isActive", false);
    formData.append("isLocked", false);
    formData.append("isDeleted", false);
    formData.append(
      "avatar",
      values.avatar?.fileList.length > 0
        ? values.avatar.fileList[0].originFileObj
        : null,
    );

    users
      .addUser(formData)
      .then(() => {
        openNotificationWithIcon("success", "Created User", "Success");
        setBtnLoading(false);
        navigate("/admin/tai-khoan");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Created error",
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
            <Typography.Title level={3}>Thêm người dùng</Typography.Title>
            <Skeleton loading={loading} active>
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
                      <Typography.Title level={5}>Người dùng</Typography.Title>
                    }
                  >
                    <ProFormText
                      width="xl"
                      name="fullname"
                      required
                      label="Tên người dùng"
                      tooltip="Tên của người dùng"
                      placeholder={"Tên người dùng"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên người dùng!",
                        },
                      ]}
                    />
                    <ProFormText
                      width="xl"
                      name="email"
                      label="Email"
                      required
                      placeholder={"email"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên email!",
                        },
                      ]}
                    />
                    <ProFormText.Password
                      width="xl"
                      name="password"
                      required
                      label="Mật khẩu"
                      placeholder={"Mật khẩu"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập Mật khẩu!",
                        },
                        {
                          pattern: /.{8,}/,
                          message: "Mât khẩu phải có ít nhất 8 ký tự!",
                        },
                      ]}
                    />
                  </ProFormGroup>

                  {/* <ProForm.Group
                    style={{ marginLeft: 100 }}
                    label={
                      <Typography.Title level={5}>Tình trạng</Typography.Title>
                    }
                  >
                    <ProFormSwitch
                      width="lg"
                      name="isActive"
                      label="Kích hoạt"
                      size="large"
                      value={false}
                      disabled
                    />
                    <ProFormSwitch
                      width="lg"
                      cacheForSwr
                      name="isLocked"
                      label="Ngăn chặn"
                      size="large"
                      value={false}
                      disabled
                    />
                    <ProFormSwitch
                      width="lg"
                      cacheForSwr
                      name="isDeleted"
                      label="Xóa bỏ"
                      size="large"
                      value={false}
                      disabled
                    />
                  </ProForm.Group> */}
                </ProFormGroup>

                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Thông tin</Typography.Title>
                  }
                >
                  <ProFormField
                    name={"phone"}
                    width="md"
                    label="Số điện thoại"
                    placeholder={"+84"}
                  />
                  <ProFormDatePicker
                    name={"effectiveDate"}
                    width="md"
                    label="Ngày hiệu lực"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Ngày hiệu lực là bắt buộc",
                      },
                    ]}
                  />

                  <ProFormDatePicker
                    name={"expirationDate"}
                    width="md"
                    label="Ngày hết hạn"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Ngày hết hạn là bắt buộc",
                      },
                    ]}
                  />

                  {/* <ProFormDateTimePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày tạo"
                    disabled
                    placeholder="Ngày tạo"
                  /> */}
                </ProForm.Group>

                <ProFormTextArea
                  name={"address"}
                  label="Địa chỉ"
                  width="lg"
                  placeholder={"..."}
                />

                <ProForm.Group
                  label={<Typography.Title level={5}>Vai trò</Typography.Title>}
                >
                  {/* <ProFormSelect
                    width={200}
                    showSearch
                    label="Vai trò"
                    name="listRoleID"
                    options={roles.map((item) => ({
                      label: item?.roleName,
                      value: item?.id,
                    }))}
                    placeholder="Chọn vai trò"
                    required
                    rules={[
                      { required: true, message: "Vui lòng chọn vai trò!" },
                    ]}
                  /> */}

                  <ProFormSelect
                    showSearch
                    label="Loại tài khoản"
                    name="userTypeId"
                    options={userTypes.map((item) => ({
                      label: item?.typeName,
                      value: item?.id,
                    }))}
                    placeholder="Chọn loại tài khoản"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại tài khoản!",
                      },
                    ]}
                  />
                  <ProFormSelect
                    label="Đơn vị lớp học, phòng ban"
                    name="unitId"
                    showSearch
                    options={userUnits.map((item) => ({
                      label: item?.unitName,
                      value: item?.id,
                    }))}
                    required
                    placeholder="Chọn đơn vị"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn đơn vị lớp học, phòng ban!",
                      },
                    ]}
                  />
                </ProForm.Group>
                <Form.Item
                  name={"avatar"}
                  label="Hình ảnh"
                  help="kích thước khuyến nghị là 114px * 152px! or 30mm x 40mm(3x4). Định dạng ảnh: jpg, png"
                >
                  <Upload
                    accept="image/jpg, image/png"
                    name="avatar"
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={(file) => {
                      const isJpgOrPng =
                        file.type === "image/jpg" || file.type === "image/png";
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
                      //check should be wigth: 400px; height: 600px
                      let check = true;
                      const img = new Image();
                      img.src = URL.createObjectURL(file);
                      img.onload = () => {
                        const width = img.width;
                        const height = img.height;
                        if (width !== 114 || height !== 152) {
                          message(
                            "warning",
                            "Hình ảnh phải là 114px * 152px! or (30mm x 40mm)",
                          );
                          check = false;
                        }
                      };

                      return isJpgOrPng && isLt2M && check;
                    }}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    maxCount={1}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
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

export const NewUser = WithErrorBoundaryCustom(_NewUser);
