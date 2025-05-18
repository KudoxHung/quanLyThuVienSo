import React from "react";

import { Line } from "@ant-design/plots";
export function LineChart({ data }) {
  const config = {
    data,
    xField: "createDate",
    yField: "value",
    seriesField: "type",

    legend: {
      position: "top",
    },
    smooth: true,

    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
  };

  return <Line {...config} />;
}
