import React, { Fragment, useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { books } from "../../../api";
import { banner } from "../../../api/banner";
import { CarouselLanding } from "../../../components/common/carouselLanding";
import { ProductsFrame } from "../../../components/common/productsFrame";
import { openNotificationWithIcon } from "../../../utils";
import { Grid, Image, Spin } from "antd";
const { useBreakpoint } = Grid;
function _HomePageLayout() {
  const breakPoints = useBreakpoint();
  const [newBooks, setNewBooks] = useState([]);
  const [mostPopularBooks, setMostPopularBooks] = useState([]);
  const [newBooksLoading, setNewBooksLoading] = useState(true);
  const [mostPopularBooksLoading, setMostPopularBooksLoading] = useState(true);
  const [Slide, setSlide] = useState([]);
  const [loadingSlide, setLoadingSlide] = useState(true);
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        books
          .getNewBooks(1, 12)
          .then((res) => {
            setNewBooks(res);
            setNewBooksLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy sách mới thất bại",
              err.message,
            );
          }),
        books
          .getMostPopularBooks(1, 12)
          .then((res) => {
            setMostPopularBooks(res);
            setMostPopularBooksLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách sách xem nhiều nhất thất bại",
              err.message,
            );
          }),
        banner
          .readAll()
          .then((res) => {
            setSlide(res);
            setRandomNumber(Math.floor(Math.random() * res.length));
            setLoadingSlide(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy hình ảnh thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Trang chủ";
  }, []);
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  return (
    <Fragment>
      <CarouselLanding />
      <div className="homepage-content Container">
        <ProductsFrame
          especially="GetBookNew"
          title="sách mới"
          Arr={newBooks}
          loading={newBooksLoading}
        />
      </div>

      <Spin spinning={loadingSlide}>
        <Image
          src={`${apiUrl}/api/Book/GetFileImageSlide?fileNameId=${Slide[randomNumber]?.fileName}`}
          alt="background"
          width="100%"
          style={{
            objectFit: "cover",
            height: breakPoints.xs ? 300 : 550,
            marginTop: 40,
          }}
          preview={false}
        ></Image>
      </Spin>

      <div className="Container">
        <ProductsFrame
          especially="GetBookByNumberView"
          title="Sách xem nhiều"
          Arr={mostPopularBooks}
          loading={mostPopularBooksLoading}
        />
      </div>
    </Fragment>
  );
}

export const HomePageLayout = WithErrorBoundaryCustom(_HomePageLayout);
