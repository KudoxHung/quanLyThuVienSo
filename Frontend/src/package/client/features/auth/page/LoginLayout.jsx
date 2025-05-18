import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { auth } from "../../../api/auth";
import { openNotificationWithIcon, setCookie } from "../../../utils";
import { ConfirmOTPcode } from "../components/ConfirmOTPcode";
import { LockOutlined, MailOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Typography,
} from "antd";

import "./LoginLayout.css";

function _LoginLayout() {
  const [result, setResult] = useState(null);
  const [activeCode, setActiveCode] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [visibleAgainActiveCode, setVisibleAgainActiveCode] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [visibleResult, setVisibleResult] = useState(false);
  const [visible, setVisible] = useState(false);
  const [popConfirm, setPopConfirm] = useState(false);

  const [visibleFoggetPassword, setVisibleFoggetPassword] = useState(false);

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  const onFinish = (values) => {
    setBtnLoading(true);
    auth
      .login(values.email, values.password)
      .then((res) => {
        setResult({ result: "success" });
        setCookie("jwt", res.data.accessToken, { path: "/" });
        setTimeout(() => {
          setBtnLoading(false);
          window.location.href = "/";
        }, 1000);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Đăng nhập thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };

  const handleOkAgainActiveCode = () => {
    setConfirmLoading(true);

    if (email === "") {
      openNotificationWithIcon("info", "Vui lòng nhập email");
      setConfirmLoading(false);
    } else {
      auth
        .sendActiveCode(email)
        .then(() => {
          setTimeout(() => {
            setVisibleAgainActiveCode(false);
            setConfirmLoading(false);
            setVisible(true);
          }, 1000);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Gửi mã kích hoạt thất bại",
            err?.response?.data?.message || err?.message,
          );
          setConfirmLoading(false);
        });
    }
  };

  const handleCancelAgainActiveCode = () => {
    setVisibleAgainActiveCode(false);
  };

  const handleOk = () => {
    if (activeCode === "") {
      openNotificationWithIcon(
        "warning",
        "active code warning",
        "active code không được để trống",
      );
      return;
    } else {
      auth
        .ActiveCode(email, activeCode)
        .then((res) => {
          setConfirmLoading(true);
          setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
            setVisibleResult(true);
          }, 1000);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "active code error",
            err.response.data.message,
          );
        });
    }
  };

  const handleCancel = () => {
    setPopConfirm(true);
  };

  const handlePopConfirm = () => {
    setPopConfirm(false);
    setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  const handlePopCancel = () => {
    setPopConfirm(false);
  };

  return (
    <div className="LoginLayout Container">
      <div className="LoginLayout-box">
        <Space direction="vertical" style={{ marginBottom: 30 }}>
          <Typography.Text style={{ fontSize: 22, fontWeight: 900 }}>
            Đăng nhập
          </Typography.Text>
          <Typography.Text>
            Chào mừng! Vui lòng nhập thông tin chi tiết của bạn.
          </Typography.Text>
        </Space>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            hasFeedback
            validateStatus={
              result
                ? result.result === "success"
                  ? "success"
                  : "warning"
                : undefined
            }
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Email!",
              },
            ]}
          >
            <Input
              allowClear
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
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
                message: "Vui lòng nhập mật khẩu!",
              },
              {
                pattern: /.{8,}/,
                message: "Mât khẩu phải có ít nhất 8 ký tự!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ thông tin</Checkbox>
            </Form.Item>

            <Link
              className="login-form-forgot"
              to="#"
              onClick={(e) => {
                setVisibleFoggetPassword(true);
              }}
            >
              Quên mật khẩu?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{
                borderRadius: "20px",
                marginBottom: 20,
                background: "#2D2D7A",
              }}
              loading={btnLoading}
            >
              Đăng nhập
            </Button>
            {/* <Button
              htmlType="button"
              className="login-form-button"
              style={{
                borderRadius: "20px",
                marginBottom: 20,
                color: "#4B6EA9",
              }}
              icon={<FacebookOutlined style={{ color: "#2054af" }} />}
              disabled
            >
              Đăng nhập với Facebook
            </Button>
            <Button
              htmlType="button"
              className="login-form-button"
              style={{
                borderRadius: "20px",
                marginBottom: 20,
                color: "#E66654",
              }}
              icon={<GooglePlusOutlined style={{ color: "#e4361f" }} />}
              disabled
            >
              Đăng nhập với Google
            </Button> */}
            <Button
              htmlType="button"
              className="login-form-button"
              onClick={() => setVisibleAgainActiveCode(true)}
              style={{
                borderRadius: "20px",
                marginBottom: 20,
                color: "#0e9522",
              }}
              icon={<UserAddOutlined style={{ color: "#0e9522" }} />}
            >
              Kích hoạt tài khoản
            </Button>
            Bạn chưa là thành viên? <Link to={"/Register"}>Đăng ký ngay!</Link>
          </Form.Item>
        </Form>
        <ConfirmOTPcode
          activeCode={activeCode}
          setActiveCode={setActiveCode}
          visible={visible}
          handleOk={handleOk}
          confirmLoading={confirmLoading}
          popConfirm={popConfirm}
          handlePopConfirm={handlePopConfirm}
          handlePopCancel={handlePopCancel}
          handleCancel={handleCancel}
          visibleResult={visibleResult}
          setVisibleResult={setVisibleResult}
        />
        <AgainActiveCodeModal
          visibleAgainActiveCode={visibleAgainActiveCode}
          confirmLoading={confirmLoading}
          handleCancelAgainActiveCode={handleCancelAgainActiveCode}
          handleOkAgainActiveCode={handleOkAgainActiveCode}
          email={email}
          setEmail={setEmail}
        />
        <FoggetPasswordModal
          visibleFoggetPassword={visibleFoggetPassword}
          setVisibleFoggetPassword={setVisibleFoggetPassword}
        />
      </div>
    </div>
  );
}

function AgainActiveCodeModal({
  visibleAgainActiveCode,
  confirmLoading,
  handleCancelAgainActiveCode,
  handleOkAgainActiveCode,
  email,
  setEmail,
}) {
  return (
    <Modal
      title="kích hoạt tài khoản"
      closable={false}
      visible={visibleAgainActiveCode}
      confirmLoading={confirmLoading}
      footer={[
        <Space size={"small"}>
          <Button type="default" onClick={handleCancelAgainActiveCode}>
            Thoát
          </Button>
          <Button
            type="primary"
            onClick={handleOkAgainActiveCode}
            loading={confirmLoading}
          >
            Xác nhận
          </Button>
        </Space>,
      ]}
    >
      <Input
        style={{
          margin: 10,
        }}
        type={"email"}
        value={email}
        allowClear
        onChange={(e) => setEmail(e.target.value)}
        prefix={<MailOutlined className="site-form-item-icon" />}
        placeholder="vui lòng nhập email của bạn!"
      />
    </Modal>
  );
}
function FoggetPasswordModal({
  visibleFoggetPassword,
  setVisibleFoggetPassword,
}) {
  const [email, setEmail] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [popConfirm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleResult, setVisibleResult] = useState(false);
  const [result] = useState(null);
  const [popConfirmCancel, setPopConfirmCancel] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleCancelFoggetPassword = () => {
    setVisibleFoggetPassword(false);
  };
  const handleCancelConfirmPassword = () => {
    setPopConfirmCancel(true);
  };

  const handleOkFoggetPassword = () => {
    setConfirmLoading(true);
    if (email === "") {
      openNotificationWithIcon("info", "Vui lòng nhập email");
      setConfirmLoading(false);
    } else {
      auth
        .sendCodeWithEmail(email)
        .then(() => {
          setTimeout(() => {
            setVisibleFoggetPassword(false);
            setConfirmLoading(false);
            setVisible(true);
          }, 1000);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Gửi mã kích hoạt thất bại",
            err?.response?.data?.message || err?.message,
          );
          setConfirmLoading(false);
        });
    }
  };

  const handleOk = () => {
    if (activeCode === "") {
      openNotificationWithIcon(
        "warning",
        "active code warning",
        "active code không được để trống",
      );
      return;
    } else {
      auth
        .verifyCode(email, activeCode)
        .then((res) => {
          setConfirmLoading(true);
          setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
            setVisibleResult(true);
          }, 1000);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Xác nhận tài khoản xãy ra lỗi",
            err.response.data.message,
          );
        });
    }
  };

  const handlePopConfirm = () => {
    setPopConfirmCancel(false);
    setTimeout(() => {
      setVisibleResult(false);
    }, 100);
  };

  const handlePopCancel = () => {
    setPopConfirmCancel(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    if (values.Password !== values.confirmPassword) {
      openNotificationWithIcon(
        "error",
        "Mật khẩu không khớp",
        "Vui lòng nhập lại mật khẩu",
      );
      return;
    } else {
      setBtnLoading(true);
      auth
        .forgotPassword(email, values.Password)
        .then(() => {
          setTimeout(() => {
            setVisible(false);
            setVisibleResult(false);
            openNotificationWithIcon(
              "success",
              "Mật khẩu mới đã được xác thực",
              "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi",
            );
            setBtnLoading(false);
          }, 1000);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Đổi mật khẩu thất bại",
            err.response.data.message,
          );
          setBtnLoading(false);
        });
    }
  };

  return (
    <Fragment>
      <ConfirmOTPcode
        activeCode={activeCode}
        setActiveCode={setActiveCode}
        visible={visible}
        handleOk={handleOk}
        confirmLoading={confirmLoading}
        popConfirm={popConfirm}
        handleCancel={handleCancel}
      />
      <Modal
        title="Mật khẩu mới"
        closable={false}
        visible={visibleResult}
        confirmLoading={confirmLoading}
        footer={[
          <Space size={"small"}>
            <Popconfirm
              placement="bottom"
              title="Nếu bạn thoát mọi tiến trình trước sẽ bị hủy, bạn có chắc chắn muốn thoát?"
              visible={popConfirmCancel}
              onConfirm={handlePopConfirm}
              onCancel={handlePopCancel}
            >
              <Button type="default" onClick={handleCancelConfirmPassword}>
                Thoát
              </Button>
            </Popconfirm>
          </Space>,
        ]}
      >
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          name="normal_login"
          className="login-form"
        >
          <Form.Item
            name="Password"
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
                message: "Vui lòng nhập mật khẩu!",
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
      </Modal>

      <Modal
        title="Quên Mật Khẩu"
        closable={false}
        visible={visibleFoggetPassword}
        confirmLoading={confirmLoading}
        footer={[
          <Space size={"small"}>
            <Button type="default" onClick={handleCancelFoggetPassword}>
              Thoát
            </Button>
            <Button
              type="primary"
              onClick={handleOkFoggetPassword}
              loading={confirmLoading}
            >
              Xác nhận
            </Button>
          </Space>,
        ]}
      >
        <Input
          style={{
            margin: 10,
          }}
          type={"email"}
          value={email}
          allowClear
          onChange={(e) => setEmail(e.target.value)}
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="vui lòng nhập email của bạn!"
        />
      </Modal>
    </Fragment>
  );
}

export const LoginLayout = WithErrorBoundaryCustom(_LoginLayout);
