import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { RingProgress } from "@ant-design/plots";
function _RingProgressChart(props) {
  const percent = Math.round((props.percent / props.maxSizeGB) * 100) / 100;
  const config = {
    height: 200,
    width: 200,
    autoFit: true,
    percent: percent,
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
    innerRadius: 0.85,
    radius: 0.98,
    statistic: {
      title: {
        style: {
          color: "#363636",
          fontSize: "12px",
          lineHeight: "14px",
        },
        formatter: () => "Đã sử dụng",
      },
    },
  };
  return (
    <div className="RingProgressChart">
      <RingProgress {...config} />
    </div>
  );
}
export const RingProgressChart = WithErrorBoundaryCustom(_RingProgressChart);
