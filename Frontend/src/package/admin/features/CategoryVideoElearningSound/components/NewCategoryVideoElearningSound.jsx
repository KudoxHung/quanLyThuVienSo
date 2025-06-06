import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { CategoryVesApis } from "../../../api/CategoryVesApis";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";

function _NewCategoryVideoElearningSound({ setVisible, setPostLength }) {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const res = await CategoryVesApis.InsertCategoryVes(values);
      if (res.success) {
        setVisible(false);
        setPostLength((prev) => prev + 1);
        form.resetFields();
        openNotificationWithIcon("success", res.message);
      } else {
        openNotificationWithIcon("warning", res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="NewCategoryVideoElearningSound">
      <Row>
        <Col span={24}>
          <Form layout={"vertical"} form={form} onFinish={onFinish}>
            <Form.Item
              label="Tên danh mục"
              name={"categoryVesName"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên danh mục",
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item
              label="Loại"
              name={"status"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn loại",
                },
              ]}
            >
              <Select>
                <Select.Option value={1}>Bải giảng điện tử</Select.Option>
                <Select.Option value={2}>Video</Select.Option>
                <Select.Option value={3}>Sách nói</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                style={{ float: "right" }}
                icon={<CheckOutlined />}
                htmlType={"submit"}
                type="primary"
              >
                Thêm danh mục
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export const NewCategoryVideoElearningSound = WithErrorBoundaryCustom(
  _NewCategoryVideoElearningSound,
);
