import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const styles = theme => ({
  root: {
    height: 200
  }
});

class MySlider extends Component {
  render() {
    const { setExtreemeValues } = this.props.appStore.paramsStore;
    const { sliderStyle } = this.props;
    return (
      <Grid item style={{ width: 200 }}>
        <Slider
          handleStyle={{
            borderColor: "#843EA4",
            height: 14,
            width: 14,
            backgroundColor: "white"
          }}
          dotStyle={{ borderColor: "#843EA4" }}
          activeDotStyle={{ borderColor: "#843EA4" }}
          trackStyle={{ background: "#843EA4" }}
          min={sliderStyle.min}
          marks={sliderStyle.marks}
          step={null}
          max={sliderStyle.max}
          // value={value}
          onAfterChange={e => setExtreemeValues(sliderStyle.type, e)}
          defaultValue={sliderStyle.defaultValue}
        />
      </Grid>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(MySlider)))
);
