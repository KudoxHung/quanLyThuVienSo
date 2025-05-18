import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { slide } from "../../../api/slide";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Spin,
  Typography,
  Upload,
} from "antd";

function _EditImage() {
  const param = useParams();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setbtnLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [Slide, setSlide] = useState({});
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  useEffect(() => {
    slide
      .readById(param.id)
      .then((res) => {
        setSlide(res);
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: `${apiUrl}/api/Book/GetFileImageSlide?fileNameId=${res?.fileName}`,
          },
        ]);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thông tin slide thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [param.id]);
  const navigate = useNavigate();
  const onFinish = (values) => {
    setbtnLoading(true);
    var data = new FormData();
    data.append("Description", values.Description || Slide.description || " ");
    data.append("Title", values.Title || slide.title || " ");
    data.append("Id", slide.id || param.id);
    data.append(
      "Files",
      values.Files?.fileList.length > 0
        ? values.Files.fileList[0].originFileObj
        : null,
    );
    slide
      .update(data)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật slide thành công",
          res.message,
        );
        setbtnLoading(false);
        navigate("/admin/hinh-anh");
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cập nhật slide thất bại",
          err?.response?.data?.message || err?.message,
        );
        setbtnLoading(false);
      })
      .finally(() => {
        setbtnLoading(false);
      });
  };
  const onChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      if (newFileList.length > 0) {
        newFileList[0].response = "ok";
      }
    }
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="layout-content SetUpContactPageReaders">
      <Spin spinning={loading}>
        <Skeleton loading={loading} active avatar paragraph={{ rows: 15 }}>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <Typography.Title level={5}>
                  Chỉnh sửa hình ảnh trang bạn đọc
                </Typography.Title>
                <Form
                  onFinish={onFinish}
                  layout={"vertical"}
                  initialValues={{
                    remember: true,
                  }}
                  className="ant-advanced-search-form"
                  name="normal_login"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="Tiêu đề" name="Title">
                        <Input.TextArea
                          placeholder="Tiêu đề"
                          showCount
                          defaultValue={Slide?.title}
                          value={Slide?.title}
                        />
                      </Form.Item>
                      <Form.Item label="Mô tả" name="Description">
                        <Input.TextArea
                          placeholder="Mô tả"
                          showCount
                          defaultValue={Slide?.description}
                          value={Slide?.description}
                          rows={5}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          loading={btnLoading}
                          htmlType="submit"
                        >
                          Lưu lại
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Hình ảnh" name="Files">
                        <Upload
                          name="Files"
                          listType="picture-card"
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                        >
                          {fileList.length >= 1 ? null : "+ Upload"}
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Skeleton>
      </Spin>
    </div>
  );
}

export const EditImage = WithErrorBoundaryCustom(_EditImage);
