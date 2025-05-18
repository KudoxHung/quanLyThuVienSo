import { Fragment } from "react";
import { memo } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getImageFilterForSizeImage } from "../../../utils/filterImage";
import {
  Button,
  Card,
  Grid,
  Image,
  Modal,
  Select,
  Skeleton,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";

import "./ProductCard.css";
const { useBreakpoint } = Grid;
const { Option } = Select;

function _ProductCard(props) {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectTypeReadBook, setSelectTypeReadBook] = useState(1);
  const handleOk = () => {
    setIsModalVisible(false);
    if (selectTypeReadBook === 1) {
      navigate(`/view-online/${props?.document?.id}`);
    } else {
      navigate(`/view-online-flip-books/${props?.document?.id}`);
    }
  };
  const handleChangeSelect = (value) => {
    setSelectTypeReadBook(value);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.loading ? setLoading(true) : setLoading(false);
  }, [props.loading, props.loadingColor]);

  return (
    <div className="ProductCard">
      <Modal
        title="Chọn phong cách đọc sách"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select value={selectTypeReadBook} onChange={handleChangeSelect}>
          <Option value={1}>Chế độ truyền thống</Option>
          <Option value={2}>Chế độ lật sách</Option>
        </Select>
      </Modal>
      <Card
        hoverable
        cover={
          loading ? (
            <Skeleton.Image
              style={{
                height:
                  breakpoint.lg || breakpoint.md || breakpoint.sm
                    ? 332
                    : breakpoint.xs
                      ? 260
                      : 280,
                width: 180,
              }}
            />
          ) : (
            <Image
              height={
                breakpoint.lg
                  ? 280
                  : breakpoint.md || breakpoint.sm
                    ? 332
                    : breakpoint.xs
                      ? 260
                      : 280
              }
              preview={false}
              style={{ objectFit: "cover" }}
              onClick={() => {
                navigate(`/detail-page/${props?.document?.id}`, {
                  state: { id: props?.document?.id },
                });
              }}
              alt="book"
              src={
                props?.listAvatar?.length > 0
                  ? getImageFilterForSizeImage(props?.listAvatar, 1)
                  : defaultImage
              }
            />
          )
        }
        actions={[
          loading ? (
            <Skeleton.Button loading={loading} active size="small" />
          ) : (
            <Spin spinning={props?.loadingColor}>
              <Space direction="vertical">
                <Tooltip title={props?.document?.author} color="lime">
                  <Typography.Text
                    style={{
                      fontWeight: "bold",
                      wordBreak: "break-word",
                      color: "#ce8028",
                      margin: 5,
                    }}
                  >
                    {props?.document?.author}
                  </Typography.Text>
                </Tooltip>
                <Button
                  style={{
                    color: props.contactAndIntroduction?.col1 || "white",
                    background: props.contactAndIntroduction?.col || "#df1f26",
                  }}
                  onClick={() => {
                    setIsModalVisible(true);
                  }}
                >
                  Đọc sách online
                </Button>
              </Space>
            </Spin>
          ),
        ]}
      >
        {loading ? (
          <Skeleton.Input loading={loading} active size="default" />
        ) : (
          <Tooltip title={props?.document?.docName} color="lime">
            <Card.Meta
              style={{ height: 50, overflow: "hidden" }}
              description={
                <Fragment>
                  <span style={{ fontWeight: "bold", color: "#000" }}>
                    {props?.document?.docName}
                  </span>
                </Fragment>
              }
            />
          </Tooltip>
        )}
      </Card>
    </div>
  );
}

export const ProductCard = memo(_ProductCard);
