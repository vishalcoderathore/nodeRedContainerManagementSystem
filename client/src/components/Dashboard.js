import React, { Component } from 'react';
import ContainerAction from './ContainerAction';
import ContainerList from './ContainerList';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, green, red } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import Notification from './Notification';
import {
  createContainer,
  deleteContainers,
  getContainers,
  restartContainer,
  stopContainers
} from '../actions/containers';
import axios from 'axios';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const containerURL_IP = process.env.REACT_APP_URL;

var utilityMethods = require('../models/utils').default;

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openInvalid: false,
      message: ''
    };
  }

  // Called when to display notification
  handleClick = message => {
    this.setState(() => {
      return {
        openInvalid: true,
        message: message
      };
    });
  };

  // Called to close the displayed notification
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState(() => {
      return {
        openInvalid: false
      };
    });
  };

  componentDidMount() {
    console.log('MOUNTED');
    this.handleCallGetContainers();
    this.hideProgressBar();
  }

  // Display Progress Bar
  showProgressBar = () => {
    document.getElementById('progressBar').style.display = 'block';
  };

  // Hide Progress Bar
  hideProgressBar = () => {
    document.getElementById('progressBar').style.display = 'none';
  };

  /*
   * Get All Containers
   */
  handleCallGetContainers = containers => {
    this.callGetApi()
      .then(containers => {
        // this.setState(() => {     return {containers: containers} });
        this.props.getContainers(containers);
        this.hideProgressBar();
        console.log('Containers fetched!! ..', containers);
      })
      .catch(err => console.log(err));
  };

  callGetApi = async () => {
    this.showProgressBar();
    const response = await fetch('/api/getContainers', {
      method: 'post',
      body: JSON.stringify({ userName: this.props.userName })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return utilityMethods.createArrayOnGetOrCreateContainer(body);
  };

  /*
   * Create A Container
   */
  handleCreateContainer = containerName => {
    this.callCreateContainer(containerName)
      .then(container => {
        let msg = containerName;
        this.handleClick(`Container ${msg} created successfully`);
        this.props.createContainer(container[0]);
        this.hideProgressBar();
      })
      .catch(err => console.log(err));
  };

  callCreateContainer = async containerName => {
    this.showProgressBar();
    const response = await fetch('/api/createContainer', {
      method: 'post',
      body: JSON.stringify({
        containerName: containerName,
        userName: this.props.userName
      })
    });
    const body = await response.json();
    console.log('Response : ', response.status);
    if (response.status !== 200) throw Error(body.message);
    return utilityMethods.createArrayOnGetOrCreateContainer(body);
  };

  /*
   * Stop Containers
   */
  handleStopContainers = (containerId, containerName) => {
    console.log(`Container to stop is ${containerId}`);
    this.callStopContainers(containerId)
      .then(containersToStop => {
        let msg;
        containersToStop.length === 1
          ? (msg = `Container ${containerName}`)
          : (msg = 'All the containers');
        this.handleClick(`${msg} stopped successfully`);
        this.props.stopContainers(containersToStop);
        this.hideProgressBar();
      })
      .catch(err => console.log(err));
  };

  callStopContainers = async containerId => {
    this.showProgressBar();
    let response = null;
    if (containerId !== null) {
      response = await fetch('/api/stopAContainer', {
        method: 'post',
        body: JSON.stringify(containerId)
      });
    } else {
      response = await fetch('/api/stopAllContainers', {
        method: 'post',
        body: JSON.stringify({ userName: this.props.userName })
      });
    }

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return utilityMethods.createArrayOnDeleteOrStop(body);
  };

  /*
   * Delete Containers
   */
  handleDeleteContainers = (containerId, containerName) => {
    console.log(`Container to delete is ${containerId}`);
    this.callDeleteContainers(containerId)
      .then(containersToRemove => {
        let msg;
        containersToRemove.length === 1
          ? (msg = `Container ${containerName}`)
          : (msg = 'All the containers');
        this.handleClick(`${msg} deleted successfully`);
        this.props.deleteContainers(containersToRemove);
        this.hideProgressBar();
      })
      .catch(err => console.log(err));
  };

  callDeleteContainers = async containerId => {
    this.showProgressBar();
    let response = null;
    if (containerId !== null) {
      response = await fetch('/api/deleteAContainer', {
        method: 'post',
        body: JSON.stringify(containerId)
      });
    } else {
      response = await fetch('/api/deleteAllContainers', {
        method: 'post',
        body: JSON.stringify({ userName: this.props.userName })
      });
    }
    const body = await response.json();
    if (response.status !== 200 || body.stderr !== '')
      throw Error(body.message);
    return utilityMethods.createArrayOnDeleteOrStop(body);
  };

  /*
   * Access a Container
   */
  handleViewDashboard = containerName => {
    var url = `http://${containerURL_IP}/${containerName}/nodered/dashboard/`;
    window.open(url, '_blank');
  };
  handleViewContainer = containerName => {
    var url = `http://${containerURL_IP}/${containerName}/nodered/`;
    window.open(url, '_blank');
  };

  /*
   * Restart a single container
   */
  handleRestartAContainer = (containerId, containerName) => {
    console.log(`Container to restart is ${containerId}`);
    this.callRestartAContainer(containerId)
      .then(containersToRestart => {
        console.log('>>>>>>>>>>>');
        console.log(containerName);
        this.handleClick(`Container ${containerName} restarted successfully`);
        this.props.restartContainer(containerId);
        this.hideProgressBar();
      })
      .catch(err => console.log(err));
  };

  callRestartAContainer = async containerId => {
    this.showProgressBar();
    const response = await fetch('/api/restartAContainer', {
      method: 'post',
      body: JSON.stringify(containerId)
    });
    const body = await response.json();
    if (response.status !== 200 || body.stderr !== '')
      throw Error(body.message);
    return utilityMethods.createArrayOnDeleteOrStop(body);
  };

  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <ContainerAction
            hasContainers={this.props.containers.length > 0}
            handleCreateContainer={this.handleCreateContainer}
            handleStopContainers={this.handleStopContainers}
            handleDeleteContainers={this.handleDeleteContainers}
            userName={this.props.userName}
          />

          <ContainerList
            containers={this.props.containers}
            hasContainers={this.props.containers.length > 0}
            handleCallGetContainers={this.handleCallGetContainers}
            viewContainer={this.handleViewContainer}
            viewDashboard={this.handleViewDashboard}
            handleRestartAContainer={this.handleRestartAContainer}
            handleStopContainers={this.handleStopContainers}
            handleDeleteContainers={this.handleDeleteContainers}
          />
        </MuiThemeProvider>
        <Notification
          openInvalid={this.state.openInvalid}
          handleClose={this.handleClose}
          message={this.state.message}
          anchorOriginVertical={'bottom'}
          anchorOriginHorizontal={'right'}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { containers: state.containers, userName: state.auth.userName };
};
const mapDispatchToProps = dispatch => {
  return {
    createContainer: container => dispatch(createContainer(container)),
    getContainers: containers => dispatch(getContainers(containers)),
    stopContainers: containersToStop =>
      dispatch(stopContainers(containersToStop)),
    deleteContainers: containersToDelete =>
      dispatch(deleteContainers(containersToDelete)),
    restartContainer: containerToRestart =>
      dispatch(restartContainer(containerToRestart))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
