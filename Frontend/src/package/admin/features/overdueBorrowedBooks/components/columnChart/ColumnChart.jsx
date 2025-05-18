import React from "react";

import { Column } from "@ant-design/plots";

export function ColumnChart({ data }) {
  const config = {
    data,
    xField: "type",
    yField: "value",
    label: {
      position: "middle",

      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "name",
      },
      value: {
        alias: "value",
      },
    },
  };
  return <Column {...config} />;
}
