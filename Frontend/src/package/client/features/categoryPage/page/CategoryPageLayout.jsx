import { Fragment, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { books } from "../../../api/books";
import { CarouselLanding } from "../../../components/common/carouselLanding";
import { ProductsFrame } from "../../../components/common/productsFrame";
import { openNotificationWithIcon } from "../../../utils";

function _CategoryPageLayout() {
  const path = useLocation();
  const param = useParams();
  const [Books, setBooks] = useState([]);
  const [numberBooks, setNumberBooks] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      Promise.all([
        books
          .getBookByCategory(pageIndex, pageSize, param.id)
          .then((res) => {
            setBooks(res);
            setLoading(false);
            setNumberBooks(res[0]?.total);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "get book by category error",
              err.message,
            );
          }),
      ]);
    };
    fetchData();
  }, [param, pageIndex, pageSize]);

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
    document.title = path?.state?.title;
  }, [path?.state?.title]);

  return (
    <Fragment>
      <CarouselLanding />
      <div className="CategoryPage Container">
        <ProductsFrame
          loading={loading}
          title={path?.state?.title}
          isCategoryPage={true}
          Arr={Books}
          totalNumberProducts={numberBooks}
          handleOnChange={handleOnChange}
          onShowSizeChange={onShowSizeChange}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
    </Fragment>
  );
}

export const CategoryPageLayout = WithErrorBoundaryCustom(_CategoryPageLayout);
