import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { CategoryVesApis } from "../../../api/CategoryVesApis";
import { GroupVesApis } from "../../../api/GroupVesApis";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";

function _NewGroupVideoElearningSound({ setVisible, setPostLength }) {
  const [dataCategory, setDataCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryVesApis.GetAllCategoryVes(0, 0);
        setDataCategory(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const onFinish = async (values) => {
    try {
      const res = await GroupVesApis.InsertGroupVes(values);
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
    <div className="NewGroupVideoElearningSound">
      <Row>
        <Col span={24}>
          <Form layout={"vertical"} form={form} onFinish={onFinish}>
            <Form.Item
              label="Tên nhóm"
              name={"groupName"}
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
              label="Danh mục bài học"
              name={"idcategoryVes"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục bài học",
                },
              ]}
            >
              <Select
                showSearch
                options={dataCategory?.map((x) => ({
                  label: x.categoryVesName,
                  value: x.id,
                }))}
                optionFilterProp={"label"}
                loading={loading}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ float: "right" }}
                icon={<CheckOutlined />}
                htmlType={"submit"}
                type="primary"
              >
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
export const NewGroupVideoElearningSound = WithErrorBoundaryCustom(
  _NewGroupVideoElearningSound,
);
