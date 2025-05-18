import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

import { Button } from "antd";

export function WordViewer({ fileUrl }) {
  if (!fileUrl) {
    return <p>Loading...</p>;
  }

  const documents = [
    {
      uri: fileUrl,
      fileType: "doc",
    },
  ];

  return (
    <>
      <h2
        style={{ textAlign: "center", fontWeight: "bold", paddingBottom: 10 }}
      >
        Nội dung biểu mẫu
      </h2>
      <DocViewer
        style={{
          height: "80vh",
        }}
        pluginRenderers={DocViewerRenderers}
        documents={documents}
        config={{
          header: {
            disableFileName: true,
            disableHeader: true,
          },
        }}
      />
    </>
  );
}
