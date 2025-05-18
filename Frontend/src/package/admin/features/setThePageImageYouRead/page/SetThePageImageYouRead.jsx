import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { slide } from "../../../api/slide";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  List,
  Row,
  Skeleton,
  Spin,
  Typography,
} from "antd";

function _SetThePageImageYouRead() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [Slide, setSlide] = useState([]);
  useEffect(() => {
    document.title = "Cài đặt hình ảnh trang liên hệ";
  }, []);
  useEffect(() => {
    setLoading(true);
    slide
      .readAll(0, 0)
      .then((res) => {
        setSlide(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh sách slide thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postLength]);

  const handleDelete = (id) => {
    setbtnLoading(true);
    slide
      .delete(id)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Xóa slide thành công",
          res.message,
        );
        setbtnLoading(false);
        setSlide(Slide.filter((item) => item.id !== id));
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Xóa slide thất bại",
          err?.response?.data?.message || err?.message,
        );
        setbtnLoading(false);
        setPostLength(postLength + 1);
      })
      .finally(() => {
        setbtnLoading(false);
      });
  };
  const handleHide = (id) => {
    setbtnLoading(true);
    slide
      .hide(id, true)
      .then((res) => {
        openNotificationWithIcon("success", "Ẩn slide thành công", res.message);
        setbtnLoading(false);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Ẩn slide thất bại",
          err?.response?.data?.message || err?.message,
        );
        setbtnLoading(false);
      })
      .finally(() => {
        setbtnLoading(false);
      });
  };
  const handleUnHide = (id) => {
    setbtnLoading(true);
    slide
      .hide(id, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hiện slide thành công",
          res.message,
        );
        setbtnLoading(false);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Hiện slide thất bại",
          err?.response?.data?.message || err?.message,
        );
        setbtnLoading(false);
      })
      .finally(() => {
        setbtnLoading(false);
      });
  };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  return (
    <div className="layout-content SetThePageImageYouRead">
      <Spin spinning={loading}>
        <Skeleton loading={loading} active avatar paragraph={{ rows: 5 }}>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <Typography.Title level={5}>
                  Thiết lập hình ảnh trang bạn đọc
                </Typography.Title>
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    showTotal: (total) => `Tổng cộng ${total} hình ảnh`,
                    pageSize: 3,
                  }}
                  dataSource={Slide}
                  footer={
                    <div>
                      <Button
                        loading={btnLoading}
                        onClick={() => {
                          navigate("/admin/hinh-anh/new");
                        }}
                      >
                        Thêm hình mới
                      </Button>
                    </div>
                  }
                  renderItem={(item) => (
                    <Badge.Ribbon
                      color={item?.isHide ? "yellow" : "green"}
                      text={item?.isHide ? "Tạm ẩn" : "Hiện"}
                    >
                      <List.Item
                        key={item?.id}
                        actions={[
                          <Button
                            icon={<EditOutlined />}
                            type="primary"
                            loading={btnLoading}
                            onClick={() => {
                              navigate(`/admin/hinh-anh/edit/${item?.id}`);
                            }}
                          >
                            Chỉnh sửa
                          </Button>,
                          <Button
                            icon={<DeleteOutlined />}
                            type="danger"
                            loading={btnLoading}
                            onClick={() => {
                              handleDelete(item?.id);
                            }}
                          >
                            Xóa
                          </Button>,
                          !item.isHide ? (
                            <Button
                              icon={<EyeInvisibleOutlined />}
                              type="dashed"
                              loading={btnLoading}
                              onClick={() => {
                                handleHide(item?.id);
                              }}
                            >
                              Ẩn
                            </Button>
                          ) : (
                            <Button
                              icon={<EyeOutlined />}
                              type="dashed"
                              loading={btnLoading}
                              onClick={() => {
                                handleUnHide(item?.id);
                              }}
                            >
                              Hiện
                            </Button>
                          ),
                        ]}
                        extra={
                          <Image
                            width={272}
                            alt="logo"
                            src={`${apiUrl}/api/Book/GetFileImageSlide?fileNameId=${item?.fileName}`}
                          />
                        }
                      >
                        <List.Item.Meta title={item?.title} />

                        {item?.description}
                      </List.Item>
                    </Badge.Ribbon>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Skeleton>
      </Spin>
    </div>
  );
}

export const SetThePageImageYouRead = WithErrorBoundaryCustom(
  _SetThePageImageYouRead,
);
