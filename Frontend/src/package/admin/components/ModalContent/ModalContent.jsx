import React from "react";

import WithErrorBoundaryCustom from "../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { Modal } from "antd";

function _Modal(props) {
  const { visible, setVisible, children, title, width, top } = props;
  return (
    <div className="Modal">
      <Modal
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
        width={width || "85%"}
        style={{ top: top || 20 }}
        {...props}
      >
        {children}
      </Modal>
    </div>
  );
}

export const ModalContent = WithErrorBoundaryCustom(_Modal);
