import React from "react";

import { Column } from "@ant-design/plots";

export function ColumnChart({ data }) {
  //custom xField and yField
  const config = {
    data,
    xField: "type",
    yField: "value",
    label: {
      position: "middle",
      style: {
        fill: "#000",
        opacity: 0.6,
      },
    },
    meta: {
      type: {
        alias: "type",
        formatter: (v) => `${v.split("/")[0]}`,
      },
      value: {
        alias: "value",
      },
    },
    seriesField: "type",
    legend: {
      position: "top-left",
    },
  };

  return <Column {...config} />;
}
