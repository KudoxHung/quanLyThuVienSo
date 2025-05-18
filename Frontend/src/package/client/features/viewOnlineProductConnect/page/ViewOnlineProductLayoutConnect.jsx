import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { booksConnect } from "../../../api/booksConnect";
import { openNotificationWithIcon } from "../../../utils";
import { SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Button, Grid, Space } from "antd";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./style.css";
const { useBreakpoint } = Grid;
function _ViewOnlineProductLayoutConnect() {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const param = useParams();
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const transform = (slot) => ({
    ...slot,
    Download: () => <></>,
    Print: () => <></>,
    DownloadMenuItem: () => <></>,
  });
  const pdfjs = require("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

  const renderToolbar = function (Toolbar) {
    return <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
  });
  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance;
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
            navigate("/detail-page-connect/" + Books?.document?.id);
          }}
        >
          Quay lại
        </Button>
        <div
          className=" Container"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "100vh",
            width: "100%",
          }}
        >
          <Viewer
            fileUrl={
              Books?.document?.fileName
                ? `${apiUrl}/api/Book/GetFilePdf?fileNameId=${Books?.document?.fileName}`
                : "file"
            }
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={SpecialZoomLevel.PageWidth}
          />
        </div>
      </Space>
    </div>
  );
}

export const ViewOnlineProductLayoutConnect = WithErrorBoundaryCustom(
  _ViewOnlineProductLayoutConnect,
);
