import React, { Component } from "react";
import { Button, Typography, Tooltip, Paper } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Add, Delete, Stop } from "@material-ui/icons";
import { blue, red } from "@material-ui/core/colors";
import LinearProgress from "@material-ui/core/LinearProgress";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";

const style = {
  Paper: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10
  },
  Button: {
    marginLeft: 10
  }
};

const themeRedColor = createMuiTheme({
  palette: {
    primary: red,
    secondary: blue
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ContainerAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteAllContainers: false,
      newContainerName: "",
      createNewContFlag: false
    };
  }

  /*
   * Open Dialog box when Deleting Containers
   */
  handleClickOpen = () => {
    this.setState({ deleteAllContainers: true });
  };

  /*
   * Close Dialog box when Deleting Containers (with No option)
   */
  handleClose = () => {
    this.setState(() => {
      return { deleteAllContainers: false };
    });
  };

  /*
   * Close Dialog box when Deleting Containers (with Yes option)
   */
  handleCloseAndDelete = () => {
    this.handleClose();
    this.props.handleDeleteContainers(null);
  };
  /******************************************************************************************************************************** */
  handleClickOpenNewContDialog = () => {
    this.setState({ createNewContFlag: true });
  };

  handleCloseNewContDialog = () => {
    this.setState(() => {
      return { createNewContFlag: false, newContainerName: "" };
    });
  };

  handleCloseAndCreateNewCont = () => {
    this.props.handleCreateContainer(this.state.newContainerName);
    this.handleCloseNewContDialog();
  };

  handleNewContInput = e => {
    const text = e.target.value.replace(/\s/g, "");
    this.setState(e => {
      return {
        newContainerName: text
      };
    });
  };

  onClickStopContainers = () => {
    this.props.handleStopContainers(null);
  };

  render(props) {
    return (
      <Paper style={style.Paper}>
        <Typography variant="h5" color="inherit" gutterBottom>
          Welcome {this.props.userName}
        </Typography>
        <Typography variant="h6" color="inherit" gutterBottom>
          Container Action
          <Tooltip
            disableFocusListener
            disableTouchListener
            title="Stop All Containers"
          >
            <Button
              id="stopALLBtn"
              variant="contained"
              style={style.Button}
              color="secondary"
              disabled={!this.props.hasContainers}
              onClick={this.onClickStopContainers}
              size="small"
            >
              <Stop />
              Stop All
            </Button>
          </Tooltip>
          <MuiThemeProvider theme={themeRedColor}>
            <Tooltip
              disableFocusListener
              disableTouchListener
              title="Delete All Containers"
            >
              <Button
                id="delALLBtn"
                variant="contained"
                style={style.Button}
                color="primary"
                disabled={!this.props.hasContainers}
                onClick={this.handleClickOpen}
                size="small"
              >
                <Delete />
                Delete All
              </Button>
            </Tooltip>
          </MuiThemeProvider>
          <Tooltip
            disableFocusListener
            disableTouchListener
            title="Add A Container"
          >
            <Button
              variant="contained"
              style={style.Button}
              color="primary"
              onClick={this.handleClickOpenNewContDialog}
              size="small"
            >
              <Add />
              Add Container
            </Button>
          </Tooltip>
        </Typography>

        <MuiThemeProvider theme={themeRedColor}>
          <Dialog
            open={this.state.deleteAllContainers}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Delete All Containers?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete all the containers?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="default">
                No
              </Button>

              <Button onClick={this.handleCloseAndDelete} color="primary">
                Yes! Delete All
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={this.state.createNewContFlag}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleCloseNewContDialog}
            aria-labelledby="alert-dialog-newCont-title"
            aria-describedby="alert-dialog-newCont-description"
          >
            <DialogTitle id="alert-dialog-newCont-title">
              {"New Container Wizard"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-newCont-description">
                <TextField
                  label="Enter Contianer Name"
                  id="margin-none"
                  onChange={e => this.handleNewContInput(e)}
                  value={this.state.newContainerName}
                  defaultValue=""
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseNewContDialog} color="default">
                Cancel
              </Button>

              <Button
                onClick={this.handleCloseAndCreateNewCont}
                color="primary"
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
        <div id="progressBar">
          <LinearProgress color="secondary" />
        </div>
      </Paper>
    );
  }
}

export default ContainerAction;
