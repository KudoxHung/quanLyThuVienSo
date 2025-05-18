import React, { useEffect, useState } from "react";

import { banner } from "../../../api/banner";
import { openNotificationWithIcon } from "../../../utils";
import { Grid, Space, Spin, Typography } from "antd";
import BannerAnim, { Element } from "rc-banner-anim";
import TweenOne from "rc-tween-one";

import "rc-banner-anim/assets/index.css";
import "./CarouselLanding.css";
export function _CarouselLanding() {
  const [listImage, setListImage] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    banner
      .readAll()
      .then((res) => {
        setListImage(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy danh mục hình ảnh thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  }, []);
  return (
    <div className="CarouselLanding">
      <CarouselLandingImage loading={loading} listImage={listImage} />
    </div>
  );
}
const { useBreakpoint } = Grid;
const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

function CarouselLandingImage({ loading, listImage }) {
  const breakPoints = useBreakpoint();

  return (
    <Spin spinning={loading} size={"large"}>
      <BannerAnim
        style={{ height: breakPoints.xs ? 300 : 550 }}
        autoPlaySpeed={3000}
        autoPlay
      >
        {listImage.map((item, index) => (
          <Element
            key={item.key}
            style={{ height: breakPoints.xs ? 300 : 550 }}
            followParallax={{
              delay: 1000,
              data: [
                {
                  id: item.key,
                  value: 20,
                  bgPosition: "50%",
                  type: ["backgroundPositionX"],
                },
                { id: "title", value: 50, type: "x" },
                { id: "content", value: -30, type: "x" },
              ],
            }}
          >
            <Element.BgElement
              key={item.key}
              style={{
                backgroundImage: `url(${apiUrl}/api/Book/GetFileImageSlide?fileNameId=${item?.fileName})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              id={item.key}
            />
            <CarouselLangdingContent
              title={item?.title}
              content={item?.description}
            />
          </Element>
        ))}
      </BannerAnim>
    </Spin>
  );
  function CarouselLangdingContent({ title, content }) {
    return (
      <div className="CarouselLanding-content">
        <Space direction="vertical" size="small">
          <TweenOne animation={{ y: 30, opacity: 0, type: "from" }} id="title">
            <Typography.Title
              level={1}
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
                textTransform: "uppercase",
                color: "white",
                fontWeight: "900",
                fontSize: breakPoints.lg
                  ? 39
                  : breakPoints.md
                    ? 30
                    : breakPoints.sm
                      ? 25
                      : breakPoints.xs
                        ? 20
                        : 38,
              }}
            >
              {title}
            </Typography.Title>
          </TweenOne>
          <TweenOne
            animation={{ y: 30, opacity: 0, type: "from" }}
            id="content"
          >
            <Typography.Title
              level={1}
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
                marginTop: "-20px",
                textTransform: "uppercase",
                color: "#d1d138",
                fontWeight: "900",
                fontSize: breakPoints.lg
                  ? 39
                  : breakPoints.md
                    ? 30
                    : breakPoints.sm
                      ? 25
                      : breakPoints.xs
                        ? 20
                        : 38,
              }}
            >
              {content}
            </Typography.Title>
          </TweenOne>
          {/* <TweenOne animation={{ y: 30, opacity: 0, type: "from" }}>
            <Button className="CarouselLanding-content_btn" size="large">
              Xem ngay
            </Button>
          </TweenOne> */}
        </Space>
      </div>
    );
  }
}

export const CarouselLanding = React.memo(_CarouselLanding);
