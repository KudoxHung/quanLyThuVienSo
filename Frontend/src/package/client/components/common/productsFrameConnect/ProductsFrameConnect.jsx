import { memo } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ContactAndIntroduction } from "../../../../admin/api/contactAndIntroduction";
import { openNotificationWithIcon } from "../../../utils";
import { ProductCardConnect } from "./../productCardConnect";
import { Button, Col, Divider, Pagination, Row } from "antd";
import TweenOne from "rc-tween-one";

import "./ProductsFrame.css";
// const { useBreakpoint } = Grid;
function _ProductsFrameConnect(props) {
  // const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const [loadingColor, setLoadingColor] = useState(true);
  const [contactAndIntroduction, setcontactAndIntroduction] = useState({});
  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 3)
      .then((res) => {
        setcontactAndIntroduction({ ...res[0] });
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy cấu hình màu sắc thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setLoadingColor(false);
      });
  }, []);
  if (props?.loading) {
    return (
      <div className="ProductsFrame">
        <Divider
          plain
          className="ProductsFrame-title"
          style={{
            width: "100%",
            borderTopColor: "black",
            marginBottom: 30,
          }}
        >
          {props.title}
        </Divider>
        <Row className="ProductsFrame-product_box" gutter={[20, 24]}>
          {[...Array(props?.pageSize || 12)].map((item, index) => (
            <Col key={index} xs={12} sm={12} md={8} lg={6} xl={4}>
              <ProductCardConnect
                loading={true}
                loadingColor={loadingColor}
                contactAndIntroduction={contactAndIntroduction}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="ProductsFrame">
      {/* <OverPack hideProps={{ tweenOne: { reverse: true } }}> */}
      <TweenOne
        animation={{
          translateY: -10,
          opacity: 1,
        }}
        style={{ opacity: 0, width: "100%" }}
      >
        <Divider
          plain
          className="ProductsFrame-title"
          style={{ borderTopColor: "black", marginBottom: 30 }}
        >
          {props.title}
        </Divider>
      </TweenOne>
      <Row
        className="ProductsFrame-product_box"
        gutter={[
          // breakpoint.xs ? 5 : breakpoint.lg ? 10 : breakpoint.md ? 10 : 50,
          20, 24,
        ]}
      >
        {props?.Arr.map((item, index) => (
          <Col key={item?.document?.id} xs={12} sm={12} md={8} lg={6} xl={4}>
            <ProductCardConnect
              {...item}
              loadingColor={loadingColor}
              contactAndIntroduction={contactAndIntroduction}
            />
          </Col>
        ))}
      </Row>

      <div className="ProductsFrame-more">
        {props.isCategoryPage ? (
          <Paginations
            totalNumberProducts={props?.totalNumberProducts}
            handleOnChange={props?.handleOnChange}
            onShowSizeChange={props?.onShowSizeChange}
            pageSize={props?.pageSize}
            pageIndex={props?.pageIndex}
          />
        ) : (
          <Button
            size="middle"
            style={{
              background: contactAndIntroduction?.col,
              color: contactAndIntroduction?.col1,
            }}
            onClick={(e) => {
              navigate(
                `/category-page-especially-connect/${props?.especially}`,
                {
                  state: { title: props?.title },
                },
              );
            }}
          >
            Xem thêm sách khác
          </Button>
        )}
      </div>
      {/* </OverPack> */}
    </div>
  );
}

function Paginations({
  totalNumberProducts,
  handleOnChange,
  onShowSizeChange,
  pageSize,
  pageIndex,
}) {
  return (
    <div className="ProductsFram-more_pagination">
      <Pagination
        onChange={handleOnChange}
        showQuickJumper
        defaultCurrent={pageIndex}
        total={totalNumberProducts}
        onShowSizeChange={onShowSizeChange}
        pageSize={pageSize}
      />
    </div>
  );
}

export const ProductsFrameConnect = memo(_ProductsFrameConnect);
