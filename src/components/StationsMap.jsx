import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { Map, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";

import { stations } from "../assets/stationList";

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
    const { setStation } = this.props.appStore.paramsStore;

    const stationList = stations.map(stn => (
      <CircleMarker
        key={stn.name}
        center={[stn.lat, stn.lon]}
        radius={6}
        color={"#221E22"}
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
          bounds={[[34, -70], [45, -79]]}
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
