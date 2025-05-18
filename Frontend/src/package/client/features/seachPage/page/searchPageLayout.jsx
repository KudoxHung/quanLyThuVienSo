import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { books } from "../../../api/books";
import { CarouselLanding } from "../../../components/common/carouselLanding";
import { ProductsFrame } from "../../../components/common/productsFrame";
import { openNotificationWithIcon } from "../../../utils";
import { Empty, Typography } from "antd";

function _SearchPageLayout() {
  const param = useParams();

  const [numberBooks, setNumberBooks] = useState(0);
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    books
      .searchBook(pageIndex, pageSize, param?.value)
      .then((res) => {
        setNumberBooks(res[0]?.total);
        setBooks(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          `Tìm book value="${param?.value}" error`,
          err.message,
        );
      });
  }, [param.value, pageIndex, pageSize]);

  const handleOnChange = (page) => {
    setPageIndex(page);
  };
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
    setPageIndex(current);
  };
  useEffect(() => {
    document.title = param?.value;
  }, [param?.value]);

  if (Books.length === 0 && loading === false) {
    return (
      <Fragment>
        {/* <CarouselLanding /> */}
        <div
          className="CategoryPage Container"
          style={{ height: 585, position: "relative" }}
        >
          <Empty
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            description={
              <Typography.Title level={1}>
                Không tìm thấy sách nào cho <b>{param?.value}</b>
              </Typography.Title>
            }
          />
        </div>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <CarouselLanding />
        <div className="CategoryPage Container">
          <ProductsFrame
            loading={loading}
            totalNumberProducts={numberBooks}
            title={param?.value}
            isCategoryPage={true}
            Arr={Books}
            especially={{ param }}
            handleOnChange={handleOnChange}
            onShowSizeChange={onShowSizeChange}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </div>
      </Fragment>
    );
  }
}

export const SearchPageLayout = WithErrorBoundaryCustom(_SearchPageLayout);
