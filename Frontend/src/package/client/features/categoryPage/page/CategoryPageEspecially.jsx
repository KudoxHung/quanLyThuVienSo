import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { books } from "../../../api";
import empty from "../../../asset/Files/empty.jpeg";
import { CarouselLanding } from "../../../components/common/carouselLanding";
import { ProductsFrame } from "../../../components/common/productsFrame";
import { openNotificationWithIcon } from "../../../utils";
import { Empty, Typography } from "antd";

function _CategoryPageEspecially(props) {
  const param = useLocation();
  const path = useParams();
  const [numberBooks, setNumberBooks] = useState(0);
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        books
          .getNumberBooks()
          .then((res) => {
            setNumberBooks(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Get number books error",
              err.message,
            );
          }),
        books
          .getBooksEspecially(pageIndex, pageSize, path.category)
          .then((res) => {
            setBooks(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Get books especially error",
              err.message,
            );
          }),
      ]);
    };
    fetchData();
  }, [path, pageIndex, pageSize]);

  const handleOnChange = (page) => {
    if (page === 0) {
      setPageIndex(1);
    } else setPageIndex(page);
  };
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
    setPageIndex(current);
  };

  useEffect(() => {
    document.title = param?.state?.title;
  }, [param?.state?.title]);
  return (
    <Fragment>
      <CarouselLanding />
      <div className="CategoryPage Container">
        {Books.length === 0 ? (
          <Empty
            style={{ marginTop: 24 }}
            imageStyle={{
              height: "auto",
              width: "100%",
            }}
            image={empty}
            description={
              <Typography.Title level={4} style={{ textAlign: "center" }}>
                Không có dữ liệu
              </Typography.Title>
            }
          />
        ) : (
          <ProductsFrame
            loading={loading}
            totalNumberProducts={numberBooks}
            title={param?.state?.title}
            isCategoryPage={true}
            Arr={Books}
            especially={{ param }}
            handleOnChange={handleOnChange}
            onShowSizeChange={onShowSizeChange}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        )}
      </div>
    </Fragment>
  );
}

export const CategoryPageEspecially = WithErrorBoundaryCustom(
  _CategoryPageEspecially,
);
