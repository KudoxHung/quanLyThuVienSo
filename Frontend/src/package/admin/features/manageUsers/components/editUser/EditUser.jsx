import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function _EditUser() {
  const navigate = useNavigate();
  const param = useParams();
  const [form] = Form.useForm();

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userUnits, setUserUnits] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
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
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        users
          .getUserById(param.id)
          .then((res) => {
            form.setFieldsValue({
              ...res,
              acitveUser: res?.acitveUser ? moment(res.acitveUser) : null,
              expireDayUser: res?.expireDayUser
                ? moment(res.expireDayUser)
                : null,
            });

            setUser(res);
            setLoading(false);

            setFileList([
              {
                uid: "-1",
                name: res.id,
                status: "done",
                url: `${apiUrl}/api/Book/GetFileAvatar?fileNameId=${res?.avatar}`,
              },
            ]);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "getUserById error",
              err?.response?.data?.message || err?.message,
            );
          }),
        users
          .getAllUnit()
          .then((res) => {
            setUserUnits(res);
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
  }, [param.id]);

  useEffect(() => {
    document.title = "Chỉnh sửa tài khoản";
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("fullname", values.fullname || user.fullname);
    formData.append("email", values.email || user.email);
    formData.append("phone", values.phone || "");
    formData.append("acitveUser", values.acitveUser);
    formData.append("expireDayUser", values.expireDayUser);
    formData.append("userTypeId", values.userTypeId || user.userTypeId);
    formData.append("address", values.address || "");
    formData.append("unitId", values.unitId || user.unitId);
    formData.append("userCode", values.userCode || user.userCode);
    formData.append("isActive", values.isActive || user.isActive);
    formData.append("isLocked", values.isLocked || user.isLocked);
    formData.append("isDeleted", values.isDeleted || user.isDeleted);

    if (fileList.length > 0 && fileList[0].uid !== "-1") {
      // đã chỉnh sửa file
      formData.append("Files", fileList[0].originFileObj);
    } else if (fileList.length > 0 && fileList[0].uid === "-1") {
      // không chỉnh sửa file
      formData.append("idFile", fileList[0].name);
    } else if (fileList.length === 0) {
      // xóa file
      formData.append("idFile", "");
    }

    users
      .updateUser(formData)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật tài khoản thành công",
          res?.message,
        );
        setBtnLoading(false);
        navigate("/admin/tai-khoan");
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

  const handleResstPassword = () => {
    setBtnLoading(true);
    users
      .ForgotPassWord(user.email, "12345678")
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Mật khẩu được làm mới mặc định là 12345678",
          res?.message,
        );
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy lại mật khẩu thất bại",
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
            <Typography.Title level={3}>Chỉnh sửa người dùng</Typography.Title>
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
                        tooltip="mật khẩu làm mới mặc định là 12345678"
                        loading={btnLoading}
                        onClick={() => handleResstPassword()}
                      >
                        Làm mới mật khẩu
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
                      value={user?.fullname}
                      placeholder="Nhập tên người dùng"
                    />
                    <ProFormText
                      width="xl"
                      name="email"
                      value={user?.email}
                      label="Email"
                      disabled
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
                      value={user?.isActive}
                      disabled
                    />
                    <ProFormSwitch
                      width="lg"
                      cacheForSwr
                      name="isLocked"
                      label="Ngăn chặn"
                      size="large"
                      value={user?.isLocked}
                      disabled
                    />
                    <ProFormSwitch
                      width="lg"
                      cacheForSwr
                      name="isDeleted"
                      label="Xóa bỏ"
                      size="large"
                      value={user?.isDeleted}
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
                    value={user?.phone}
                  />
                  {/* <ProFormDateTimePicker
                    width="md"
                    name={"createdDate"}
                    label="Ngày tạo"
                    placeholder={
                      moment(user?.createdDate).format("DD/MM/YYYY HH:mm:ss") ||
                      "Ngày tạo"
                    }
                    disabled
                  /> */}
                  <ProFormField
                    name={"userCode"}
                    width="md"
                    label="Mã người dùng"
                    value={user?.userCode}
                    rules={[
                      // max langth: 12
                      {
                        max: 12,
                        message: "Mã người dùng không quá 12 ký tự",
                      },
                      // regex no Vietnamese characters
                      {
                        pattern: /^[a-zA-Z0-9]+$/,
                        message:
                          "Mã người dùng không chứa ký tự tiếng Việt hoặc khoảng cách",
                      },
                    ]}
                  />
                </ProForm.Group>

                <ProForm.Group
                  label={
                    <Typography.Title level={5}>Ngày hiệu lực</Typography.Title>
                  }
                >
                  <ProFormDatePicker
                    name="acitveUser"
                    label="Ngày hiệu lực"
                    width="lg"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Ngày hiệu lực là bắt buộc",
                      },
                    ]}
                  />
                  <ProFormDatePicker
                    name="expireDayUser"
                    width="lg"
                    label="Ngày hết hạn"
                    format="DD/MM/YYYY"
                    rules={[
                      {
                        required: true,
                        message: "Ngày hết hạn là bắt buộc",
                      },
                    ]}
                  />
                </ProForm.Group>
                <ProFormTextArea
                  name={"address"}
                  label="Địa chỉ"
                  width="lg"
                  placeholder={"..."}
                  value={user?.address}
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
                      label: item.roleName,
                      value: item.id,
                    }))}
                    value={user?.idRole}
                    placeholder="Chọn vai trò"
                    required
                  /> */}

                  <ProFormSelect
                    showSearch
                    label="Loại tài khoản"
                    name="userTypeId"
                    options={userTypes.map((item) => ({
                      label: item.typeName,
                      value: item.id,
                    }))}
                    value={user?.userTypeId}
                    placeholder="Chọn loại tài khoản"
                    required
                  />
                  <ProFormSelect
                    label="Đơn vị lớp học, phòng ban"
                    name="unitId"
                    showSearch
                    options={userUnits.map((item) => ({
                      label: item.unitName,
                      value: item.id,
                    }))}
                    value={user?.unitId}
                    placeholder="Chọn đơn vị lớp học, phòng ban"
                    required
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
                    progress={{
                      strokeColor: {
                        success: "#10e951",
                        error: "#ff5500",
                        active: "#108ee9",
                      },
                      strokeWidth: 2,
                      format: (percent) => `${percent}%`,
                    }}
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

export const EditUser = WithErrorBoundaryCustom(_EditUser);
