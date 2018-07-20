import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: "0 auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    paddingLeft: 0,
    paddingRight: 0
  }
});

class GaugeGraphModal extends Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, isOpen, gauge, title, timeSeries } = this.props;

    return (
      <div className={classes.root}>
        <Modal
          disableAutoFocus
          onClose={this.handleClose}
          open={isOpen}
          aria-labelledby="simple-dialog-title"
        >
          <div className={classes.paper}>
            <Typography
              variant="display1"
              gutterBottom
              style={{ marginBottom: 32 }}
            >
              {title}
            </Typography>
            <div>{gauge}</div>
            <div>{timeSeries}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(GaugeGraphModal)))
);
