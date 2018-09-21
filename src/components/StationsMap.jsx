import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Map, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

// import stations from "../assets/stationList.json";
import { returnBoundingBox } from "../utils/utils";

// styles
const styles = theme => ({
  root: {
    // width: "100vh",
    width: 800,
    height: "100%",
    margin: "0 auto"
  }
});

class StationsMap extends Component {
  render() {
    const { classes, handleClose } = this.props;
    const { setStation, station, stns } = this.props.appStore.paramsStore;

    const stationList = stns.map(stn => (
      <CircleMarker
        key={stn.name}
        center={[stn.lat, stn.lon]}
        radius={station.name === stn.name ? 7 : 5}
        color={station.name === stn.name ? "#843EA4" : "#221E22"}
        onClick={() => {
          setStation(stn);
          handleClose();
        }}
      >
        <Tooltip>
          <span>{stn.name}</span>
        </Tooltip>
      </CircleMarker>
    ));

    return (
      <div className={classes.root}>
        <Map
          bounds={returnBoundingBox(stns)}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png" />
          {stationList}
        </Map>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(StationsMap)))
);
