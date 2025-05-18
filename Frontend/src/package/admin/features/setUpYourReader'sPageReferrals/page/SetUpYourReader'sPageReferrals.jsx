import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { Badge, Button, Card, Col, Row, Skeleton, Spin } from "antd";
import DOMPurify from "dompurify";
import { convertToHTML } from "draft-convert";
import { ContentState, convertFromHTML, EditorState } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./SetUpYourReader'sPageReferrals.css";

function _SetUpYourReaderSPageReferrals() {
  const [btnloading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cài đặt trang giới thiệu";
  }, []);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };

  const convertContentToHTML = () => {
    const currentContentAsHTML = convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === "IMAGE") {
          return `<img src="${entity.data.src}" />`;
        }
        return originalText;
      },
    })(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };

  const handleSubmit = () => {
    setBtnLoading(true);
    ContactAndIntroduction.create({
      type: 1,
      col: convertedContent,
    })
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Thay đổi đã được lưu lại",
          res?.message,
        );
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cố gì đó không ổn",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("File", file);
      ContactAndIntroduction.SaveImageIntroduction(data)
        .then((res) => {
          openNotificationWithIcon("success", "Thành công", res?.message);
          resolve({
            data: {
              link: `${apiUrl}/api/ContactAndIntroduction/GetFileImageIntroduction?fileNameId=${res}`,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          openNotificationWithIcon("error", "Có lỗi", err?.message);
        });
    });
  }

  const config = {
    image: { uploadCallback: uploadImageCallBack },
    inputAccept:
      "application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel",
  };

  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 1)
      .then((res) => {
        const blocksFromHTML = convertFromHTML(res[0]?.col + "<p></p>" || "");
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
        );
        setEditorState(EditorState.createWithContent(state));

        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Cố gì đó không ổn",
          err?.response?.data?.message || err?.message,
        );
      });
  }, []);

  return (
    <Spin spinning={loading} size={"large"}>
      <div className="layout-content SetUpYourReaderSPageReferrals">
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Skeleton loading={loading} active avatar paragraph={{ rows: 10 }}>
              <Card bordered={false} className="criclebox h-full">
                <header className="App-header">
                  Viết nội dung giới thiệu cho trang bạn đọc
                </header>
                <Editor
                  toolbar={config}
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                />
                <Button
                  type="primary"
                  loading={btnloading}
                  style={{ marginTop: 10 }}
                  onClick={(e) => {
                    handleSubmit();
                  }}
                  disabled={convertedContent === null}
                >
                  Lưu lại
                </Button>
              </Card>
            </Skeleton>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Skeleton loading={loading} active avatar paragraph={{ rows: 15 }}>
              <Badge.Ribbon color={"blue"} text="Xem trước">
                <Card bordered={false} className="criclebox h-full">
                  <div
                    className="preview"
                    dangerouslySetInnerHTML={createMarkup(convertedContent)}
                  ></div>
                </Card>
              </Badge.Ribbon>
            </Skeleton>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export const SetUpYourReaderSPageReferrals = WithErrorBoundaryCustom(
  _SetUpYourReaderSPageReferrals,
);
