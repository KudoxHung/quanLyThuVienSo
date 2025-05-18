import React, { useEffect, useState } from "react";

import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Progress, Space, Typography } from "antd";

const maskStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(5px)",
};

const ModalProgress = ({ start, title }) => {
  const [completed, setCompleted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setPercent((prev) => {
          if (prev === 99) return prev;
          if (prev === 100) {
            setCompleted(true);
          }
          return prev + 1;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [visible]);

  useEffect(() => {
    if (start) {
      setPercent(0);
      setVisible(true);
    } else {
      setPercent(100);
    }
  }, [start]);

  const handleModalClose = () => {
    if (completed) {
      setVisible(false);
      setPercent(0);
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      maskClosable={false}
      maskStyle={maskStyle}
      onCancel={handleModalClose}
      afterClose={() => setCompleted(false)}
      zIndex={10000}
    >
      <Space
        direction={"vertical"}
        size={"middle"}
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        <Typography.Title level={5} style={{ textAlign: "center" }}>
          {title}
        </Typography.Title>
        <Progress
          percent={percent}
          status={completed ? "success" : "active"}
          type="dashboard"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
        />
        <Typography.Title level={5}>
          {completed ? "Quá trình hoàn thành" : "Đang xử lý quá trình..."}
        </Typography.Title>
        <Button
          type="primary"
          onClick={handleModalClose}
          hidden={!completed}
          icon={<CheckOutlined />}
        >
          Hoàn thành
        </Button>
      </Space>
    </Modal>
  );
};

export default ModalProgress;
