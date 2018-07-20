import React, { Fragment } from "react";

const PieLabels = ({
  cx,
  cy,
  midAngle,
  endAngle,
  innerRadius,
  outerRadius,
  index,
  payload,
  selectedIdx
}) => {
  const RADIAN = Math.PI / 180;

  // Provides coordinate for quantiles on the Pie
  const sin = Math.sin(-RADIAN * endAngle);
  const cos = Math.cos(-RADIAN * endAngle);
  const x = cx + (innerRadius - 12) * cos;
  const y = cy + (innerRadius - 12) * sin;

  // Provides coordinates for the arc labels
  const sinL = Math.sin(-RADIAN * midAngle);
  const cosL = Math.cos(-RADIAN * midAngle);
  const xL = cx + (innerRadius + (outerRadius - innerRadius) / 2) * cosL;
  const yL = cy + (innerRadius + (outerRadius - innerRadius) / 2) * sinL;

  const { name, daysAboveThisYear, endArcQuantile } = payload;

  return (
    <g>
      <text
        style={{ fontSize: 11 }}
        x={x}
        y={y}
        fill="black"
        opacity={Number(daysAboveThisYear) === endArcQuantile ? 1 : 0.3}
        textAnchor={x > cx ? "middle" : "middle"}
        dominantBaseline="central"
      >
        {payload.endArcQuantile && payload.endArcQuantile.toFixed(1)}
      </text>

      {(name === "Min" ||
        name === "25%" ||
        name === "Mean" ||
        name === "75%" ||
        name === "Max") && (
        <circle
          cx={xL}
          cy={yL}
          r={selectedIdx === index ? 17 : 13}
          fill="#fff"
          stroke={selectedIdx === index ? "black" : null}
          opacity={1}
        />
      )}

      <text
        textAnchor="middle"
        x={xL}
        y={yL}
        dy=".33em"
        fill={
          selectedIdx === index
            ? index === 1 ||
              index === 3 ||
              index === 5 ||
              index === 7 ||
              index === 9
              ? "black"
              : "white"
            : "black"
        }
        fontSize={selectedIdx === index ? 13 : 9}
        fontWeight="bold"
        opacity={selectedIdx === index ? 1 : 0.5}
      >
        {payload.name === "Slightly Below" && (
          <Fragment>
            <tspan x={xL} dy="-5">
              Slightly
            </tspan>
            <tspan x={xL} dy="17">
              Below
            </tspan>
          </Fragment>
        )}

        {payload.name === "Slightly Above" && (
          <Fragment>
            <tspan x={xL} dy="-5">
              Slightly
            </tspan>
            <tspan x={xL} dy="17">
              Above
            </tspan>
          </Fragment>
        )}

        {payload.name !== "Slightly Below" &&
          payload.name !== "Slightly Above" &&
          payload.name}
      </text>
    </g>
  );
};

export default PieLabels;
