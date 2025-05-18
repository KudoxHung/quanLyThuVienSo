import React from "react";

import { Bar } from "@ant-design/plots";

export function BarChart({ data }) {
  const config = {
    data,
    xField: "value",
    yField: "type",
    seriesField: "type",
    legend: {
      position: "top-left",
    },
  };
  return <Bar {...config} />;
}
