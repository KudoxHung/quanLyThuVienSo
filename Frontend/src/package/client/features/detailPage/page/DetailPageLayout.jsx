import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { ContactAndIntroduction } from "../../../../admin/api/contactAndIntroduction";
import { books } from "../../../api";
import { banner } from "../../../api/banner";
import emptyImage from "../../../asset/logo/empty-image.avif";
import LoadingImage from "../../../asset/logo/loading-image.avif";
import { CarouselLanding } from "../../../components/common/carouselLanding";
import { openNotificationWithIcon } from "../../../utils";
import { getImageFilterForSizeImage } from "../../../utils/filterImage";
import {
  Button,
  Col,
  Divider,
  Grid,
  Image,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import moment from "moment";

const textBold = { fontWeight: "900", fontSize: "18px" };
const text = { fontWeight: "600", fontSize: "18px", lineHeight: "1.5" };
const { useBreakpoint } = Grid;
const { Option } = Select;

function _DetailPageLayout() {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const param = useParams();
  const [book, setBook] = useState({});
  const [Slide, setSlide] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ramdomNumber] = useState(1);
  const [loadingColor, setLoadingColor] = useState(true);
  const [contactAndIntroduction, setcontactAndIntroduction] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [slelecTypeReadBook, setSlelecTypeReadBook] = useState(1);
  const handleOk = () => {
    setIsModalVisible(false);
    if (1 === slelecTypeReadBook) {
      navigate(`/view-online/${param?.id}`);
    } else {
      navigate(`/view-online-flip-books/${param?.id}`);
    }
  };
  const handleChangeSelect = (value) => {
    setSlelecTypeReadBook(value);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        books
          .getBookById(param.id)
          .then((res) => {
            setBook(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "get book by id error",
              err.message,
            );
          }),
        banner
          .readAll()
          .then((res) => {
            setSlide(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy hình ảnh thất bạis",
              err?.response?.data?.message || err?.message,
            );
          }),
        ContactAndIntroduction.read(1, 1, 3)
          .then((res) => {
            setcontactAndIntroduction(res[0]);
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
          }),
      ]);
    };
    fetchData();
  }, [param.id]);
  useEffect(() => {
    document.title = "Thông tin chi tiết - " + book?.document?.docName;
  }, [book]);

  return (
    <Fragment>
      <Modal
        title="Chọn phong cách đọc sách"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          value={slelecTypeReadBook}
          style={{
            width: 300,
          }}
          onChange={handleChangeSelect}
        >
          <Option value={1}>Chế độ truyền thống</Option>
          <Option value={2}>Chế độ lật sách</Option>
        </Select>
      </Modal>
      <CarouselLanding />
      <div className="detailPage Container" style={{ marginTop: 30 }}>
        <Divider
          plain
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 30,
            borderTopColor: "black",
          }}
        >
          Thông tin chi tiết
        </Divider>
        <Row
          gutter={[30, 0]}
          style={{ padding: breakpoint.xs ? "0px 10px 0 10px" : 0 }}
        >
          <Col xl={{ span: 10 }} xs={{ span: 24 }}>
            <DetailImage
              src={
                book?.listAvatar?.length > 0
                  ? getImageFilterForSizeImage(book?.listAvatar, 1)
                  : emptyImage
              }
            />
          </Col>
          <Col xl={{ span: 14 }} md={{ span: 24 }}>
            <DetailInfo
              setIsModalVisible={setIsModalVisible}
              loadingColor={loadingColor}
              contactAndIntroduction={contactAndIntroduction}
              textBold={textBold}
              text={text}
              docName={book?.document?.docName}
              author={book?.document?.author}
              publisher={book?.document?.publisher}
              publishYear={book?.document?.publishYear}
              documentId={book?.document?.id}
              description={book?.document?.description}
              loading={loading}
              nameCategory={book?.nameCategory}
            />
          </Col>
        </Row>
        {/* <div className="detailPage-relatedProducts" style={{ marginTop: 40 }}>
          <ProductsFrame title="KHÁM PHÁ THÊM CÁC TỰA SÁCH KHÁC" />
        </div> */}
      </div>
      <Spin spinning={loading}>
        <Image
          src={`${apiUrl}/api/Book/GetFileImageSlide?fileNameId=${Slide[ramdomNumber]?.fileName}`}
          alt="background"
          width="100%"
          style={{
            objectFit: "cover",
            height: breakpoint.xs ? 300 : 550,
            marginTop: 40,
          }}
          preview={false}
        ></Image>
      </Spin>
    </Fragment>
  );
}

function DetailImage({ src }) {
  return (
    <Image
      width="100%"
      src={src}
      alt="Image"
      style={{ objectFit: "cover" }}
      placeholder={
        <Image
          preview={false}
          src={LoadingImage}
          width="100%"
          height="600px"
          style={{ objectFit: "cover", filter: "blur(4px)" }}
        />
      }
    ></Image>
  );
}

function DetailInfo({
  textBold,
  text,
  docName,
  author,
  publisher,
  publishYear,
  documentId,
  description,
  loading,
  nameCategory,
  loadingColor,
  contactAndIntroduction,
  setIsModalVisible,
}) {
  return (
    <div className="detailPage-info">
      {loading ? (
        <Skeleton.Input
          active
          size="small"
          block
          style={{ marginBottom: 20 }}
        />
      ) : (
        <Typography.Title level={3}>{docName}</Typography.Title>
      )}

      <Space direction="vertical">
        {loading ? (
          <Skeleton.Input loading={loading} active size="default" />
        ) : (
          <Typography.Text style={textBold}>
            Chuyên mục:{" "}
            <Typography.Text style={text}>{nameCategory}</Typography.Text>
          </Typography.Text>
        )}

        {loading ? (
          <Skeleton.Input loading={loading} active size="default" />
        ) : (
          <Typography.Text style={textBold}>
            Tác giả: <Typography.Text style={text}>{author}</Typography.Text>
          </Typography.Text>
        )}

        {loading ? (
          <Skeleton.Input loading={loading} active size="default" />
        ) : (
          <Typography.Text style={textBold}>
            Nhà xuất bản:{" "}
            <Typography.Text style={text}>{publisher}</Typography.Text>
          </Typography.Text>
        )}

        {loading ? (
          <Skeleton.Input loading={loading} active size="default" />
        ) : (
          <Typography.Text style={textBold}>
            Xuất bản năm:{" "}
            <Typography.Text style={text}>
              {publishYear && moment(publishYear).format("YYYY")}
            </Typography.Text>
          </Typography.Text>
        )}

        {loading ? (
          <Skeleton.Input loading={loading} active size="default" />
        ) : (
          <Typography.Text style={textBold}>
            Giới thiệu:{" "}
            <Typography.Text style={text}>{description}</Typography.Text>
          </Typography.Text>
        )}

        {loading ? (
          <Skeleton.Button loading={loading} active size="default" />
        ) : (
          <Spin spinning={loadingColor}>
            <Button
              size="large"
              style={{
                color: contactAndIntroduction?.col1 || "white",
                background: contactAndIntroduction?.col || "#df1f26",
                marginTop: 20,
              }}
              onClick={() => {
                setIsModalVisible(true);
              }}
            >
              Đọc sách online
            </Button>
          </Spin>
        )}
      </Space>
    </div>
  );
}

export const DetailPageLayout = WithErrorBoundaryCustom(_DetailPageLayout);
