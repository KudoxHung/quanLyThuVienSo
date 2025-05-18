import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { CategoryVesApis } from "../../../api/CategoryVesApis";
import { GroupVesApis } from "../../../api/GroupVesApis";
import { VESApis } from "../../../api/VESApis";
import { CheckOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Radio, Row, Select, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";

function _EditVideoElearningSound({ Data, setVisible, setPostLength }) {
  const [dataGroupVes, setDataGroupVes] = useState([]);
  const [dataCategoryVes, setDataCategoryVes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [isHiddenSelectListUser, setIsHiddenSelectListUser] = useState(true);
  const [listUser, setListUser] = useState([]);
  const [isLoadListUser, setIsLoadListUser] = useState(true);
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      try {
        const res = await GroupVesApis.GetAllGroupVes(0, 0);
        const resCategory = await CategoryVesApis.GetAllCategoryVes(0, 0);
        const resUser = await users.getAllUsers(0, 0);
        setDataCategoryVes(resCategory);
        setDataGroupVes(res);
        setListUser(resUser);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setIsLoadListUser(false);
      }
    })();
  }, []);
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  useEffect(() => {
    (async () => {
      if (Data.id) {
        const res = await VESApis.GetVESById(Data.id);
        form.setFieldsValue({
          ...res,
          idsUser: res?.vesRoles?.map((x) => x?.idUser),
        });
        setIsHiddenSelectListUser(res?.isPublish);
        if (res?.fileNameExtention) {
          setFileList([
            {
              uid: "-1",
              name: res.id,
              status: "done",
              url: `${apiUrl}/api/VES/GetFile?fileNameId=${res?.id}.${res?.fileNameExtention}`,
            },
          ]);
        }
      }
    })();
  }, [Data.id, form]);
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      for (const field in values) {
        if (
          values.hasOwnProperty(field) &&
          values[field] !== undefined &&
          values[field] !== null
        ) {
          formData.append(field, values[field]);
        }
      }
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
      const res = await VESApis.UpdateVES(formData);
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
    <div className="EditGroupVideoElearningSound">
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form layout={"vertical"} form={form} onFinish={onFinish}>
            <Form.Item name={"id"} hidden={true} />
            <Form.Item
              label="Tiêu đề"
              name={"mediaTitle"}
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
              label="Nhóm bài học"
              name={"idGroupVes"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn nhóm bài học",
                },
              ]}
            >
              <Select
                showSearch
                options={dataGroupVes?.map((x) => ({
                  label: `Nhóm: ${x.groupName} => Danh mục: ${
                    dataCategoryVes.find((y) => y.id === x.idcategoryVes)
                      ?.categoryVesName
                  } => Loại: ${
                    dataCategoryVes.find((y) => y.id === x.idcategoryVes)
                      ?.status === 1
                      ? "Bài giảng điện tử"
                      : dataCategoryVes.find((y) => y.id === x.idcategoryVes)
                            ?.status === 2
                        ? "Video"
                        : "Sách nói"
                  }`,
                  value: x.id,
                }))}
                optionFilterProp={"label"}
                loading={loading}
              />
            </Form.Item>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Link (Chỉ dùng link youtube, hoặc link mp3)"
                  name={"mediaPath"}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  label="Mô tả (Có thể thêm các link khác ngoài youtube tại đây)"
                  name={"mediaDescription"}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item>
                  <Upload.Dragger
                    multiple={false}
                    action={null}
                    maxCount={1}
                    fileList={fileList}
                    onChange={(e) => {
                      if (e.fileList[0]) e.fileList[0].status = "done";
                      setFileList(e.fileList);
                    }}
                    onRemove={(file) => {
                      const index = fileList.indexOf(file);
                      const newFileList = fileList.slice();
                      newFileList.splice(index, 1);
                      setFileList(newFileList);
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Nhấp hoặc kéo tệp vào khu vực này để tải lên
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Loại link (Trong trường hợp bài giảng Video chỉ gắn link youtube)"
                  name={"mediaLinkType"}
                  initialValue={1}
                >
                  <Select
                    showSearch
                    options={[
                      {
                        label: "Link youtube (Recommend)",
                        value: 1,
                      },
                    ]}
                    optionFilterProp={"label"}
                  />
                </Form.Item>
                <Form.Item
                  label="Loại media"
                  name={"mediaType"}
                  initialValue={0}
                >
                  <Select
                    showSearch
                    options={[
                      {
                        label: "Video",
                        value: 0,
                      },
                      {
                        label: "Bài giảng điện tử - Dạng PDF",
                        value: 1,
                      },
                      {
                        label: "Bài giảng điện tử - Dạng Video",
                        value: 2,
                      },
                      {
                        label: "Sound - Sách nói dạng MP3",
                        value: 3,
                      },
                      {
                        label: "Sound - Sách nói dạng video",
                        value: 4,
                      },
                    ]}
                    optionFilterProp={"label"}
                  />
                </Form.Item>
                <Form.Item label="Thứ tự sắp xếp" name={"number"}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="isPublish">
                  <Radio.Group
                    defaultValue={true}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setIsHiddenSelectListUser(false);
                      } else {
                        setIsHiddenSelectListUser(true);
                      }
                    }}
                  >
                    <Radio.Button value={true}>Công đồng</Radio.Button>
                    <Radio.Button value={false}>Riêng tư</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name={"idsUser"}
                  hidden={isHiddenSelectListUser}
                  label={"Danh sách người dùng được chọn"}
                >
                  <Select
                    showSearch
                    mode={"multiple"}
                    optionFilterProp={"label"}
                    maxTagCount={"responsive"}
                    options={listUser?.map((user) => {
                      return {
                        label: user.fullname + " - " + user.email,
                        value: user.id,
                      };
                    })}
                    loading={isLoadListUser}
                    placement={"topLeft"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                style={{ float: "right" }}
                icon={<CheckOutlined />}
                htmlType={"submit"}
                type="primary"
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
export const EditVideoElearningSound = WithErrorBoundaryCustom(
  _EditVideoElearningSound,
);
