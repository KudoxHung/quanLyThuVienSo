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
export function ColumnChartGroup({ data }) {
  //custom xField and yField
  const config = {
    data,
    xField: "school",
    yField: "value",
    seriesField: "type", // Dùng để nhóm các cột
    isGroup: true, // Hiển thị dạng nhóm cột
    label: {
      position: "middle",
      style: {
        fill: "#000",
        opacity: 0.6,
      },
    },
    meta: {
      school: {
        alias: "Trường",
      },
      value: {
        alias: "Số lượng",
      },
    },
    legend: {
      position: "top-left",
    },
  };

  return <Column {...config} />;
}

export function ColumnChartGroup4({ data }) {
  // Custom xField and yField
  const config = {
    data,
    xField: "school", // Each school has its own set of 4 columns
    yField: "value", // The y-axis represents the number of books
    seriesField: "status", // Used to group the columns by "rách nát", "lạc hậu", "mất", "xuất sách"
    isGroup: true, // Display grouped columns
    label: {
      position: "middle",
      style: {
        fill: "#000",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: false, // Hiển thị tất cả nhãn
        autoRotate: true, // Xoay nhãn nếu cần
      },
    },
    meta: {
      school: {
        alias: "Trường", // Alias for 'school' in the tooltip/legend
      },
      value: {
        alias: "Số lượng", // Alias for 'value' (number of books)
      },
    },
    legend: {
      position: "top-left", // Legend positioning
    },
  };

  return <Column {...config} />;
}
