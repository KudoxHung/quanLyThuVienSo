import React from "react";

import { Pie } from "@ant-design/plots";

export function PieChart({ data }) {
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "name",
    radius: 0.8,
    label: {
      type: "outer",
    },

    state: {
      active: {
        style: {
          lineWidth: 0,
          fillOpacity: 0.65,
        },
      },
    },
    interactions: [
      {
        type: "element-single-selected",
      },
      {
        type: "element-active",
      },
    ],
  };
  return <Pie {...config} />;
}
