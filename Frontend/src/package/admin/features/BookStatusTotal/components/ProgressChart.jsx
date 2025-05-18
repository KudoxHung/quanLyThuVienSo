import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { Progress } from "@ant-design/plots";

function _ProgressChart(props) {
  const percent = Math.round((props.percent / props.maxSizeGB) * 100) / 100;

  const config = {
    height: 150,
    angleField: "title",
    color: [
      percent > 0.8
        ? "red"
        : percent > 0.6
          ? "#FAAD14"
          : percent > 0.2
            ? "#1890FF"
            : "#52C41A",
      "#E8EDF3",
    ],
    legend: {
      position: "top-left",
    },
    percent: percent,
    label: {
      content: (item) => {
        if (item.type === "current") return ` ${props.percent}GB `;
        if (item.type === "target")
          return ` ${
            Math.round((props.maxSizeGB - props.percent) * 100) / 100 < 0
              ? ""
              : Math.round((props.maxSizeGB - props.percent) * 100) / 100 + "GB"
          }`;
      },
      position: "middle",
      style: {
        fill: "#000",
        fontSize: 18,
        fontWeight: 600,
      },
    },
  };

  return (
    <div className="ProgressChart">
      <Progress {...config} />
    </div>
  );
}
export const ProgressChart = WithErrorBoundaryCustom(_ProgressChart);
