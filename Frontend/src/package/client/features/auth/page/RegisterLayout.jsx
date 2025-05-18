import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { auth } from "../../../api";
import { openNotificationWithIcon } from "../../../utils";
import { ConfirmOTPcode } from "../components/ConfirmOTPcode";
import { Button, Checkbox, Form, Input, Space, Typography } from "antd";

import "./RegisterLayout.css";

function _RegisterLayout() {
  const [result, setResult] = useState(null);
  const [visibleResult, setVisibleResult] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [popConfirm, setPopConfirm] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

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
          }, 2000);
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

  useEffect(() => {
    document.title = "Đăng ký";
  }, []);

  const onFinish = (values) => {
    if (values.Password === values.confirmPassword) {
      setBtnLoading(true);
      auth
        .register(values.Fullname, values.Email, values.Password)
        .then((res) => {
          setEmail(values.Email);
          setVisible(true);
          setResult({ result: "success" });
          setBtnLoading(false);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "Đăng ký thất bại",
            err?.response?.data?.message || err?.message,
          );
          setBtnLoading(false);
        });
    } else {
      openNotificationWithIcon(
        "error",
        "Đăng ký thất bại",
        "2 Mật khẩu không khớp",
      );
    }
  };

  // ngăn chặn rời đi khi chưa lưu
  useEffect(() => {
    if (btnLoading) {
      openNotificationWithIcon(
        "info",
        "Tiến trình đang xử lý",
        "Chúng tôi nhận thấy một tiến trình đang được thực hiện. Bạn không nên rời đi, Thank you !",
      );
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, [btnLoading]);

  return (
    <Fragment>
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
      <div className="RegisterLayout Container">
        <div className="RegisterLayout-box">
          <Space direction="vertical" style={{ marginBottom: 30 }}>
            <Typography.Text style={{ fontSize: 22, fontWeight: 900 }}>
              Đăng ký
            </Typography.Text>
            <Typography.Text>
              Welcome to us! Please enter your details.
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
              label="Họ và tên"
              name="Fullname"
              hasFeedback
              validateStatus={
                result
                  ? result.result === "success"
                    ? "success"
                    : "warning"
                  : undefined
              }
              tooltip="Bạn muốn người khác gọi bạn là gì?"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên!",
                  whitespace: true,
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="Email"
              label="E-mail"
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
                  type: "email",
                  message: "Đầu vào không hợp lệ E-mail!",
                },
                {
                  required: true,
                  message: "Vui lòng nhập E-mail của bạn!",
                },
              ]}
            >
              <Input type="email" allowClear />
            </Form.Item>
            <Form.Item
              name="Password"
              label="Mật khẩu"
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
              label="Xác nhận mật khẩu"
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

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Nên chấp nhận quy định")),
                },
              ]}
            >
              <Checkbox>
                Tôi đã đọc{" "}
                <a href="/gioi-thieu" target="_blank">
                  quy định
                </a>
              </Checkbox>
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
                  width: "100%",
                }}
                loading={btnLoading}
              >
                Đăng ký
              </Button>
              Bạn đã là thành viên? <Link to={"/Login"}>Đăng nhập ngay!</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Fragment>
  );
}
export const RegisterLayout = WithErrorBoundaryCustom(_RegisterLayout);
