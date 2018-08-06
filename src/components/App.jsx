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

// components
import MapModal from "./MapModal";
import Row from "./Row";

const styles = theme => ({
  root: {
    flexGrow: 1,
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
    minWidth: 120,
    width: "15%",
    margin: "32px auto"
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
      seasonalExtreme
    } = this.props.appStore.paramsStore;

    return (
      <Grid container className={classes.root} spacing={32}>
        <Grid item xs={12} sm={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: 32
            }}
          >
            <Typography variant="display1" gutterBottom>
              <div>
                Viewing Climate Conditions at{" "}
                <span style={{ color: "#843EA4" }}>{station.name}</span>
              </div>
            </Typography>
            <Button
              variant="extendedFab"
              color="primary"
              aria-label="map"
              onClick={this.handleOpen}
            >
              <Icon style={{ marginRight: 5 }}>place</Icon>
              STATIONS
            </Button>
          </div>

          <div className={classes.formControl}>
            <DatePicker
              style={{ width: "100%" }}
              label="Date of Interest"
              value={new Date()}
              onChange={e => console.log(e)}
              format="MMMM Do, YYYY"
              disableFuture
              showTodayButton
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton style={{ marginRight: -10 }}>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>

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
