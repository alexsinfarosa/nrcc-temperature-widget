import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

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
    paddingLeft: 16,
    paddingRight: 16
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "space-between"
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
            <div className={classes.header}>
              <div style={{ display: "flex", flex: 1 }} />
              <div
                style={{
                  display: "flex",
                  flex: 5,
                  justifyContent: "center",
                  alignItems: "baseline"
                }}
              >
                <Typography
                  variant="display1"
                  gutterBottom
                  style={{ marginBottom: 32 }}
                >
                  {title}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "baseline"
                }}
              >
                <Button size="small" onClick={this.handleClose}>
                  <Icon style={{ marginRight: 5 }}>close</Icon>
                </Button>
              </div>
            </div>

            <div>{gauge}</div>
            {timeSeries}
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("appStore")(observer(GaugeGraphModal)))
);
