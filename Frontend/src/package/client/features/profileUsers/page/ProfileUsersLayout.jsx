import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { users } from "../../../../admin/api/users";
import { usersClient } from "../../../api";
import { openNotificationWithIcon } from "../../../utils";
import { getBase64 } from "../../../utils/getBase64";
import { PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDateTimePicker,
  ProFormField,
  ProFormGroup,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Row,
  Skeleton,
  Typography,
  Upload,
} from "antd";
import moment from "moment";

function _ProfileUsersLayout() {
  const [result, setResult] = useState(null);
  const param = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [userUnits, setUserUnits] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

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
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
    document.title = "Profile";
  }, []);
  useEffect(() => {
    const fecthData = async () => {
      Promise.all([
        usersClient
          .getUserById(param.id)
          .then((res) => {
            setUser(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "get user by id error",
              err?.response?.data?.message || err?.message,
            );
            setLoading(false);
          }),
        users
          .getAllUnit()
          .then((res) => {
            setUserUnits(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "get all unit error",
              err?.response?.data?.message || err?.message,
            );
          }),
        users
          .getAllUserType()
          .then((res) => {
            setUserTypes(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "get all type error",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fecthData();
  }, [param.id]);

  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("fullname", values.fullname || user.fullname);
    formData.append("email", values.email || user.email);
    formData.append("phone", values.phone || "");
    formData.append("userTypeId", values.userTypeId || user.userTypeId);
    formData.append("address", values.address || "");
    formData.append("Description", values.description || user.description);
    formData.append("unitId", values.unitId || user.unitId);
    formData.append(
      "avatar",
      values.avatar?.fileList.length > 0
        ? values.avatar.fileList[0].originFileObj
        : null,
    );
    users
      .updateUser(formData)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật tài khoản thành công",
          res.message,
        );
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật tài khoản thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };

  const onFinishChangePassword = (values) => {
    setBtnLoading(true);
    if (values.newPassword !== values.confirmPassword) {
      openNotificationWithIcon(
        "error",
        "mật khẩu không khớp",
        "mật khẩu không khớp",
      );
      setBtnLoading(false);
      return;
    }
    if (values.oldPassword === values.newPassword) {
      openNotificationWithIcon(
        "error",
        "Mật khẩu mới không khác gì mật khẩu cũ",
        "Mật khẩu mới không khác gì mật khẩu cũ",
      );
      setBtnLoading(false);
      return;
    } else {
      usersClient
        .changePassword(user.email, values.oldPassword, values.newPassword)
        .then((res) => {
          openNotificationWithIcon(
            "success",
            "change password success",
            res.message,
          );
          setResult("success");
          setBtnLoading(false);
          navigate("/");
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "change password error",
            err?.response?.data?.message || err?.message,
          );
          setBtnLoading(false);
          setResult("error");
        });
    }
  };

  return (
    <div className="Container ProfileUser" style={{ height: "auto" }}>
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
                Cập nhật thông tin cá nhân
              </Typography.Title>
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
                <Skeleton loading={loading} active>
                  <ProFormGroup>
                    <ProFormGroup
                      label={
                        <Typography.Title level={5}>
                          Người dùng
                        </Typography.Title>
                      }
                    >
                      <ProFormText
                        width="xl"
                        name="fullname"
                        required
                        label="Tên người dùng"
                        tooltip="Tên của người dùng"
                        placeholder={"Tên người dùng"}
                        value={user?.fullname}
                      />
                    </ProFormGroup>

                    <ProForm.Group
                      style={{ marginLeft: 100 }}
                      label={
                        <Typography.Title level={5}>
                          Tình trạng
                        </Typography.Title>
                      }
                    >
                      <ProFormSwitch
                        width="lg"
                        name="isActive"
                        label="Kích hoạt"
                        size="large"
                        value={user?.isActive}
                        disabled
                      />
                    </ProForm.Group>
                  </ProFormGroup>
                </Skeleton>
                <Skeleton loading={loading} active>
                  <ProForm.Group
                    label={
                      <Typography.Title level={5}>Thông tin</Typography.Title>
                    }
                  >
                    <ProFormField
                      name={"phone"}
                      width="md"
                      label="Phone Number"
                      placeholder={"+84"}
                      value={user?.phone}
                    />
                    <ProFormDateTimePicker
                      width="md"
                      name={"createdDate"}
                      label="Ngày tạo"
                      placeholder={
                        moment(user?.createdDate).format(
                          "DD/MM/YYYY HH:mm:ss",
                        ) || "Ngày tạo"
                      }
                      disabled
                    />
                  </ProForm.Group>
                </Skeleton>
                <Skeleton loading={loading} active>
                  <ProFormTextArea
                    name={"address"}
                    label="Địa chỉ"
                    width="lg"
                    placeholder={"..."}
                    value={user?.address}
                  />
                  <ProFormTextArea
                    name={"description"}
                    label="Ghi chú bản thân"
                    width="lg"
                    value={user?.description}
                  />
                </Skeleton>

                <Skeleton loading={loading} active>
                  <ProForm.Group
                    label={
                      <Typography.Title level={5}>Vai trò</Typography.Title>
                    }
                  >
                    <ProFormSelect
                      showSearch
                      label="Loại tài khoản"
                      name="userTypeId"
                      options={userTypes.map((item) => ({
                        label: item.typeName,
                        value: item.id,
                      }))}
                      placeholder={
                        !loading &&
                        userTypes.map((item) =>
                          item.id === user?.userTypeId ? item.typeName : null,
                        )
                      }
                      required
                      rules={[
                        {
                          required: user?.userTypeId ? false : true,
                          message: "Vui lòng chọn loại tài khoản",
                        },
                      ]}
                    />
                    <ProFormSelect
                      label="Đơn vị lớp học, phòng ban"
                      name="unitId"
                      showSearch
                      options={userUnits.map((item) => ({
                        label: item.unitName,
                        value: item.id,
                      }))}
                      placeholder={
                        !loading &&
                        userUnits.map((item) =>
                          item.id === user?.unitId ? item.unitName : null,
                        )
                      }
                      required
                      rules={[
                        {
                          required: user?.unitId ? false : true,
                          message: "Vui lòng chọn đơn vị",
                        },
                      ]}
                    />
                  </ProForm.Group>
                  <Form.Item
                    name={"avatar"}
                    label="Avatar"
                    help="kích thước khuyến nghị là 114px * 152px! or 30mm x 40mm(3x4). Định dạng ảnh: jpg, png"
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
                </Skeleton>
              </ProForm>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card bordered={false} className="criclebox h-full">
              <Card bordered={false}>
                <Collapse accordion defaultActiveKey={["1"]}>
                  <Collapse.Panel header="Thay đổi mật khẩu" key="1">
                    <Form
                      initialValues={{
                        remember: true,
                      }}
                      onFinish={onFinishChangePassword}
                      name="normal_login"
                      className="login-form"
                    >
                      <Form.Item
                        name="oldPassword"
                        label="Mật khẩu cũ."
                        hasFeedback
                        validateStatus={
                          result
                            ? result.result === "success"
                              ? "success"
                              : "warning"
                            : undefined
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu cũ !",
                          },
                          {
                            pattern: /.{8,}/,
                            message: "Mât khẩu phải có ít nhất 8 ký tự!",
                          },
                        ]}
                      >
                        <Input.Password type="password" allowClear />
                      </Form.Item>
                      <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        hasFeedback
                        validateStatus={
                          result
                            ? result.result === "success"
                              ? "success"
                              : "warning"
                            : undefined
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới!",
                          },
                          {
                            pattern: /.{8,}/,
                            message: "Mât khẩu phải có ít nhất 8 ký tự!",
                          },
                        ]}
                      >
                        <Input.Password type="password" allowClear />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mới"
                        hasFeedback
                        validateStatus={
                          result
                            ? result.result === "success"
                              ? "success"
                              : "warning"
                            : undefined
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập lại mật khẩu!",
                          },
                          {
                            pattern: /.{8,}/,
                            message: "Mât khẩu phải có ít nhất 8 ký tự!",
                          },
                        ]}
                      >
                        <Input.Password type="confirmPassword" allowClear />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          style={{
                            borderRadius: "20px",
                            background: "#2D2D7A",
                            width: "100%",
                          }}
                          loading={btnLoading}
                        >
                          Xác nhận
                        </Button>
                      </Form.Item>
                    </Form>
                  </Collapse.Panel>
                </Collapse>
              </Card>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export const ProfileUsersLayout = WithErrorBoundaryCustom(_ProfileUsersLayout);
