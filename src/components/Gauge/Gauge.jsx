import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../withRoot";

import { arcColoring } from "../../utils/utils";

import { PieChart, Pie, Cell } from "recharts";
import PieLabels from "./PieLabels";
import InnerCircle from "./InnerCircle";

const styles = theme => ({
  root: { flexGrow: 1 }
});

let height = 250;
let width = 270;

class Gauge extends Component {
  render() {
    const { gauge } = this.props;

    let cell;
    if (gauge) {
      cell = gauge.gaugeData.map((arc, index) => {
        return <Cell key={index} fill={arcColoring(arc.name)} />;
      });
    }

    return (
      <PieChart width={width} height={height}>
        <Pie
          opacity={0.8}
          activeIndex={gauge.active}
          activeShape={
            <InnerCircle
              daysAboveThisYear={gauge.daysAboveThisYear}
              label={gauge.label}
            />
          }
          startAngle={250}
          endAngle={-70}
          dataKey="value"
          data={gauge.gaugeData}
          cx={width / 2}
          cy={height / 1.95}
          labelLine={false}
          label={<PieLabels selectedIdx={gauge.active} elem={gauge.elem} />}
          innerRadius={60}
          outerRadius={110}
        >
          {cell}
        </Pie>
      </PieChart>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(Gauge)))
);
