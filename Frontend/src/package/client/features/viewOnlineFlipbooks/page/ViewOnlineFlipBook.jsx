import React, { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { books } from "../../../api";
import { openNotificationWithIcon } from "../../../utils";
import { Button, Grid, Space, Spin } from "antd";

import "./style.css";
const { useBreakpoint } = Grid;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function _ViewOnlineFlipBook() {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();

  const param = useParams();
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true); // New state for controlling spinner
  const [pageNumber, setPageNumber] = useState(1);
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    setShowSpinner(true); // Show spinner when starting to load
    books
      .getBookById(param.id)
      .then((res) => {
        setBooks(res);
        setLoading(false);
        setShowSpinner(false); // Hide spinner when loaded
      })
      .catch((err) => {
        openNotificationWithIcon("error", "get book by id error", err.message);
        setLoading(false);
      });
    console.log(1);
  }, [param.id]);

  useEffect(() => {
    document.title = "Xem trực tuyến - " + Books?.document?.docName;
    if (!Books?.document?.fileName && !loading) {
      openNotificationWithIcon(
        "info",
        "Thông báo sự thiếu sót",
        "Hiện tại chưa có bản điện tử nào, vui lòng quay lại sau, cảm ơn!",
      );
    }
    console.log(2);
  }, [Books, loading]);

  useEffect(() => {
    if (Books?.document?.fileName) {
      const url = `${apiUrl}/api/Book/GetFilePdf?fileNameId=${Books?.document?.fileName}`;
      console.log("PDF URL:", url);
      setFileURL(url);
    }
    console.log(3);
  }, [Books]);

  const Page = React.forwardRef(({ pageNumber }, ref) => {
    return (
      <div ref={ref}>
        <ReactPdfPage pageNumber={pageNumber} />
      </div>
    );
  });

  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  return showSpinner && Books ? (
    <p> Đang tải dữ liệu</p> // Show spinner when showSpinner is true
  ) : (
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
          {fileURL ? (
            <Document
              file={fileURL}
              onLoadSuccess={(pdf) => {
                setPageNumber(pdf.numPages);
              }}
              onLoadError={(error) => {
                openNotificationWithIcon(
                  "error",
                  "PDF load error",
                  error.message,
                );
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
          ) : (
            <p>File not found or loading error</p>
          )}
        </div>
      </Space>
    </div>
  );
}

export const ViewOnlineFlipBook = WithErrorBoundaryCustom(_ViewOnlineFlipBook);
