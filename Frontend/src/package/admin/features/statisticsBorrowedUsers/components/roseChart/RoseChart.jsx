import React from "react";

import { Rose } from "@ant-design/plots";
export function RoseChart({ data }) {
  const config = {
    data,
    xField: "name",
    yField: "value",
    seriesField: "name",
    radius: 0.9,
    legend: {
      position: "bottom",
    },
  };
  return <Rose {...config} />;
}
