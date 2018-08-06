import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import { CSVLink } from "react-csv";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

import {
  BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Label,
  ResponsiveContainer
} from "recharts";

import GraphLabels from "./GraphLabels";

const styles = theme => ({
  root: { flexGrow: 1 },
  csvLink: {
    textDecoration: "none"
  }
});

class TimeSeries extends Component {
  render() {
    const { classes, gauge } = this.props;

    const renderTooltip = d => {
      if (d.payload[0]) {
        const bar = d.payload[0].payload;
        return (
          <div
            style={{
              background: "white",
              borderRadius: 10,
              padding: 5,
              border: "1px solid #b2b2b2"
            }}
          >
            <p style={{ fontWeight: "bold", color: "#949494" }}>
              Date: {bar.date}
            </p>
            <p style={{ fontWeight: "bold", color: bar.barColor }}>
              Value: {bar.value}
            </p>
          </div>
        );
      }
    };

    return (
      <div
        style={{
          // flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={gauge.graphData}
            margin={{ top: 30, right: 50, left: 100, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="date" tick={<GraphLabels />} />
            <Tooltip content={renderTooltip} />
            <ReferenceLine isFront y={0} stroke="#000">
              <Label
                value={`Mean = ${gauge.mean}`}
                offset={8}
                position="left"
              />
            </ReferenceLine>
            <Bar dataKey="bar" fill={"red"}>
              {gauge.graphData.map((entry, index) => {
                return <Cell key={index} fill={entry.barColor} />;
              })}
            </Bar>
            />
          </BarChart>
        </ResponsiveContainer>
        <CSVLink
          className={classes.csvLink}
          data={gauge.csvData}
          filename={"time-series.csv"}
          target="_self"
        >
          <Button size="small" aria-label="download">
            <Icon style={{ marginRight: 5 }}>save_alt</Icon>
            Download CSV File
          </Button>
        </CSVLink>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(TimeSeries)))
);
