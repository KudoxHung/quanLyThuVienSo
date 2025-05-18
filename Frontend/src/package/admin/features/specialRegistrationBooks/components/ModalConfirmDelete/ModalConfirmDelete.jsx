import WithErrorBoundaryCustom from "../../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { Modal } from "antd";

function _ModalConfirmDelete(props) {
  const { visible, setVisible, children } = props;
  return (
    <div className="ModalConfirmDelete">
      <Modal
        title={"Kiểm tra trước khi xóa"}
        footer={null}
        onCancel={() => setVisible(false)}
        visible={visible}
      >
        {children}
      </Modal>
    </div>
  );
}

export const ModalConfirmDelete = WithErrorBoundaryCustom(_ModalConfirmDelete);
