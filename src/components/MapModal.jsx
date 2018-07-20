import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Modal from "@material-ui/core/Modal";
import StationsMap from "./StationsMap";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class MapModal extends Component {
  render() {
    const { classes, isOpen, handleClose } = this.props;

    return (
      <div className={classes.root}>
        <Modal
          disableAutoFocus
          onClose={handleClose}
          open={isOpen}
          aria-labelledby="map-modal"
        >
          <StationsMap handleClose={handleClose} />
        </Modal>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(MapModal)))
);
