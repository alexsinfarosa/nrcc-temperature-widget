import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Gauge from "./Gauge/Gauge";
import MySlider from "./MySlider";
import GaugeGraphModal from "./GaugeGraphModal";
import TimeSeries from "./TimeSeries";

import { RingLoader } from "react-spinners";

const styles = theme => ({
  root: {
    flexGrowth: 1,
    borderLeft: "2px solid #67793E",
    marginBottom: theme.spacing.unit * 4
  },
  button: {
    margin: 0,
    padding: 0,
    background: "none",
    border: "none",
    transitionDuration: "0.1s",
    borderRadius: 50,
    "&:hover": {
      cursor: "pointer",
      background: "#EDE8F2"
    },
    "&:focus": {
      outline: 0
    }
  }
});

class Rows extends Component {
  state = {
    isOpen: false,
    idx: 0
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { classes, row, type } = this.props;

    return (
      <div className={classes.root}>
        <Typography
          variant="caption"
          style={{ color: "#67793E", marginLeft: 10, fontWeight: "bold" }}
        >
          {type}
        </Typography>
        {row ? (
          <Grid container justify="space-around" alignItems="center">
            {row.map((gauge, i) => (
              <Grid item key={i}>
                <Grid
                  container
                  alignItems="center"
                  // spacing={2}
                  style={{ flexDirection: "column", justifyContent: "center" }}
                >
                  <Grid item>
                    <button
                      className={classes.button}
                      onClick={() => {
                        this.setState({ isOpen: true, idx: i });
                      }}
                    >
                      <Gauge gauge={gauge} />
                    </button>
                  </Grid>
                  {gauge.isSlider ? (
                    <MySlider sliderStyle={gauge.sliderStyle} />
                  ) : (
                    <Grid item />
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container justify="space-around" alignItems="center">
            {[1, 2, 3].map(n => (
              <Grid item key={n}>
                <Grid container alignItems="center" spacing={8}>
                  <Grid item />

                  <Grid
                    item
                    style={{
                      height: 260,
                      width: 290,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <RingLoader color={"#67793E"} loading={!row} />
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}

        {row && (
          <GaugeGraphModal
            title={type}
            onClose={this.onClose}
            isOpen={this.state.isOpen}
            gauge={<Gauge gauge={row[this.state.idx]} />}
            timeSeries={<TimeSeries gauge={row[this.state.idx]} />}
          />
        )}
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(inject("appStore")(observer(Rows))));
