import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { booksConnect } from "../../../api/booksConnect";
import { openNotificationWithIcon } from "../../../utils";
import { Button, Grid, Space } from "antd";

import "./style.css";
const { useBreakpoint } = Grid;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function _ViewOnlineFlipBookConnect() {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();

  const param = useParams();
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    booksConnect
      .getBookById(param.id)
      .then((res) => {
        setBooks(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "get book by id error", err.message);
        setLoading(false);
      });
  }, [param.id]);

  useEffect(() => {
    document.title = "xem trực tuyến - " + Books?.document?.docName;
    if (!Books?.document?.fileName && !loading) {
      openNotificationWithIcon(
        "info",
        "Thông báo sự thiếu sót",
        "Hiện tại chưa có bản điện tử nào, vui lòng quay lại sau, cảm ơn!",
      );
    }
  }, [Books, loading]);

  const Page = React.forwardRef(({ pageNumber }, ref) => {
    return (
      <div ref={ref}>
        <ReactPdfPage pageNumber={pageNumber} />
      </div>
    );
  });
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS_OWNER;
  return (
    <div className="viewOnlineProductLayout">
      <Space
        style={{ width: "100vw" }}
        direction={breakpoint.xl ? "horizontal" : "vertical"}
      >
        <Button
          style={{ marginLeft: 20 }}
          onClick={() => {
            navigate("/detail-page/" + Books?.document?.id);
          }}
        >
          Quay lại
        </Button>
        <div
          className="viewOnlineFlipBooksLayout Container"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "100vh",
          }}
        >
          <Document
            file={
              Books?.document?.fileName
                ? `${apiUrl}/api/Book/GetFilePdf?fileNameId=${Books?.document?.fileName}`
                : "file"
            }
            onLoadSuccess={(pdf) => {
              setPageNumber(pdf.numPages);
            }}
          >
            <HTMLFlipBook
              width={500}
              height={630}
              size="stretch"
              minWidth={315}
              maxWidth={600}
              minHeight={400}
              maxHeight={900}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="demo-book"
            >
              {Array.from(Array(pageNumber).keys()).map((page) => (
                <Page key={page} pageNumber={page + 1} />
              ))}
            </HTMLFlipBook>
          </Document>
        </div>
      </Space>
    </div>
  );
}

export const ViewOnlineFlipBookConnect = WithErrorBoundaryCustom(
  _ViewOnlineFlipBookConnect,
);
