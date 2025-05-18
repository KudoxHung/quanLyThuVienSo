import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Result,
  Space,
  Statistic,
  Typography,
} from "antd";

export function ConfirmOTPcode({
  activeCode,
  setActiveCode,
  visible,
  handleOk,
  confirmLoading,
  popConfirm,
  handlePopConfirm,
  handlePopCancel,
  handleCancel,
  visibleResult,
  setVisibleResult,
}) {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Modal
        title="Xác nhận người dùng."
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        footer={[
          <Space size={"small"}>
            <Popconfirm
              placement="bottom"
              title="Bạn vẫn có thế kích hoạt tài khoản ở đăng nhập -> kích hoạt tài khoản"
              visible={popConfirm}
              onConfirm={handlePopConfirm}
              onCancel={handlePopCancel}
            >
              <Button type="default" onClick={handleCancel}>
                Thoát
              </Button>
            </Popconfirm>
            <Button type="primary" onClick={handleOk} loading={confirmLoading}>
              Xác nhận
            </Button>
          </Space>,
        ]}
      >
        <Space direction="vertical">
          <Typography.Title level={3}>Xác nhận active code</Typography.Title>
          <Input
            placeholder="mã active code"
            type={"number"}
            value={activeCode}
            onChange={(e) => setActiveCode(e.target.value)}
          ></Input>
          <Typography.Paragraph
            style={{
              padding: 10,
              color: "#7a7474",
            }}
          >
            Một mã xác nhận người dùng đã được gửi về mail của bạn. Hãy kiểm tra
            và nhập chúng. Thank you.
          </Typography.Paragraph>
          <Statistic.Countdown
            title="Thời gian hiệu lực"
            value={Date.now() + 1000 * 5 * 5 * 6 * 2 + 1000}
            format="HH:mm:ss:SSS"
            showZero
          />
        </Space>
      </Modal>
      <ResultSuccess
        visibleResult={visibleResult}
        navigate={navigate}
        setVisibleResult={setVisibleResult}
      />
    </Fragment>
  );
}

function ResultSuccess({ visibleResult, navigate, setVisibleResult }) {
  return (
    <Modal visible={visibleResult} footer={null} closeIcon={<></>} width={600}>
      <Result
        status="success"
        title="Xác nhận người dùng thành công !"
        subTitle="Hệ thống thư viện sẽ tự động kích hoạt tài khoản của bạn. Chúc bạn đọc sách vui vẻ!"
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={(e) => {
              navigate("/login");
              setVisibleResult(false);
            }}
          >
            Đi tới đăng nhập
          </Button>,
        ]}
      />
    </Modal>
  );
}
