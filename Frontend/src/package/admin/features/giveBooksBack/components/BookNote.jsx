import React, { useEffect, useState } from "react";

import { openNotificationWithIcon } from "../../../../client/utils";
import { documentInVoice } from "../../../api/documentInVoice";
import { Button, Input, Space } from "antd";
const { TextArea } = Input;

function BookNote(props) {
  const { id, note } = props;
  const [NoteContent, setNoteContent] = useState("");
  const [IsVisibleNote, setIsVisibleNote] = useState(false);
  // const [DocumentInVoiceDetail, setDocumentInVoiceDetail] = useState({});
  // const [ReloadContent, setReloadContent] = useState(false)

  useEffect(() => {
    // getDocumentDetailById();
    setIsVisibleNote(false);
    setNoteContent(note);
  }, [id, note]);

  // const getDocumentDetailById = () => {
  //     documentInVoice.GetDocumentInvoiceDetailById(id)
  //         .then((res) => {
  //             setDocumentInVoiceDetail(res);
  //             setNoteContent(DocumentInVoiceDetail.note)
  //             // openNotificationWithIcon("success", "Thành công", res?.message);
  //         })
  //         .catch((err) => {
  //             openNotificationWithIcon("error", "Không tìm thấy thông tin", err?.response?.data?.message || err?.message);
  //         }).finally(() => {
  //     });
  // };
  const onChangeNoteContent = () => {
    documentInVoice
      .EditNoteContentDocumentInvoiceDetailById({
        id: id,
        note: NoteContent,
      })
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res?.message);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {});
    setIsVisibleNote(false);
    // setReloadContent(true);
  };
  const handleTextAreaChange = (e) => {
    setIsVisibleNote(true);
    setNoteContent(e.target.value);
  };
  return (
    <div style={{ marginLeft: "auto" }}>
      <TextArea
        onChange={handleTextAreaChange}
        rows={5}
        value={NoteContent}
        showCount={true}
        size={"middle"}
        placeholder="Nội dung ghi chú..."
      />
      <br />
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        {IsVisibleNote && (
          <p style={{ color: "red" }}>*Nội dung đã được thay đổi và chưa lưu</p>
        )}
        <Button type={"primary"} onClick={onChangeNoteContent}>
          Lưu thay đổi
        </Button>
      </Space>
    </div>
  );
}
export default BookNote;
