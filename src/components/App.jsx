import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import withRoot from "../withRoot";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

import DatePicker from "material-ui-pickers/DatePicker";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

import getYear from "date-fns/getYear";

// components
import MapModal from "./MapModal";
import Row from "./Row";

const styles = theme => ({
  root: {
    flexGrow: 1,
    flexDirection: "column",
    padding: theme.spacing.unit * 2
  },
  centered: {
    display: "flex",
    flex: 1,
    height: 330,
    justifyContent: "center",
    alignItems: "center"
  },
  legend: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center"
  },
  formControl: {
    minWidth: 140,
    width: "15%",
    marginleft: 8,
    marginRight: 8
  }
});

class App extends Component {
  state = {
    isOpen: false
  };

  handleOpen = () => {
    this.setState({ isOpen: true });
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { classes } = this.props;
    const {
      station,
      avgTemps,
      avgPcpns,
      seasonalExtreme,
      dateOfInterest,
      setDateOfInterest
    } = this.props.appStore.paramsStore;

    const thisYear = getYear(new Date());
    const selectedYear = getYear(dateOfInterest);
    const isThisYear = thisYear === selectedYear;

    return (
      <Grid container className={classes.root} spacing={32}>
        <Grid item>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            spacing={32}
          >
            <Grid item>
              <Typography variant="title">
                <div>
                  Viewing Climate Conditions at{" "}
                  {station ? (
                    <span style={{ color: "#843EA4" }}>{station.name}</span>
                  ) : (
                    <span style={{ color: "#843EA4" }}>...</span>
                  )}
                </div>
              </Typography>
            </Grid>

            <Grid item>
              <DatePicker
                style={{ width: "100%" }}
                label="Date of Interest"
                value={dateOfInterest}
                onChange={setDateOfInterest}
                format={isThisYear ? "MMMM Do" : "MMMM Do YYYY"}
                disableFuture
                showTodayButton
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton style={{ marginRight: -20 }}>
                        <Icon>date_range</Icon>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item>
              <Button
                variant="extendedFab"
                color="primary"
                aria-label="map"
                onClick={this.handleOpen}
                size="small"
              >
                <Icon style={{ marginRight: 5 }}>place</Icon>
                STATIONS
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Row type="TEMPERATURE" row={avgTemps} />
          <Row type="PRECIPITATION" row={avgPcpns} />
          <Row type="SEASONAL EXTREME" row={seasonalExtreme} />
        </Grid>
        <MapModal isOpen={this.state.isOpen} handleClose={this.handleClose} />
      </Grid>
    );
  }
}
export default withRoot(withStyles(styles)(inject("appStore")(observer(App))));
