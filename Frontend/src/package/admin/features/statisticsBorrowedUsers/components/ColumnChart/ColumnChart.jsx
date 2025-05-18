import React from "react";

import { Column } from "@ant-design/plots";

export function ColumnChart({ data }) {
  const config = {
    data,
    xField: "name",
    yField: "value",
    seriesField: "name",
    legend: {
      position: "top-left",
    },
    xAxis: {
      label: {
        autoHide: false, // Hiển thị tất cả nhãn
        autoRotate: true, // Xoay nhãn nếu cần
      },
    },
  };

  return <Column {...config} />;
}
