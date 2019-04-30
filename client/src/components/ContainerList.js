import React from 'react';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper
} from '@material-ui/core';
import {
  Delete,
  Refresh,
  PlayArrow,
  Stop,
  ThumbUp,
  ThumbDown,
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const style = {
  Paper: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10
  }
};

const themeRedColor = createMuiTheme({
  palette: {
    primary: red
  }
});

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

class ContainerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteAContainer: false,
      containerToDelete: '',
      containerNameToDelete: ''
    };
  }

  handleClickOpen = (id, name) => {
    this.setState(() => {
      return {
        deleteAContainer: true,
        containerToDelete: id,
        containerNameToDelete: name
      };
    });
  };

  handleClose = () => {
    this.setState(() => {
      return { deleteAContainer: false };
    });
  };

  handleCloseAndDelete = () => {
    this.handleClose();
    this.props.handleDeleteContainers(
      this.state.containerToDelete,
      this.state.containerNameToDelete
    );
    this.setState(() => {
      return { containerToDelete: '', containerNameToDelete: '' };
    });
  };

  render(props) {
    return (
      <Paper style={style.Paper}>
        <Typography variant='h6' color='inherit' gutterBottom>
          Container List
          <Tooltip disableFocusListener disableTouchListener title='Refresh'>
            <IconButton onClick={this.props.handleCallGetContainers}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Editor</TableCell>
              <TableCell>Dashboard</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.containers.length === 0 ? (
              <TableRow>
                <TableCell>No Containers Available</TableCell>
              </TableRow>
            ) : (
              this.props.containers.map(row => {
                return (
                  <TableRow key={row.Id}>
                    <TableCell component='th' scope='row'>
                      {row.Name}
                    </TableCell>
                    <TableCell>{row.Id}</TableCell>
                    <TableCell>{row.Created}</TableCell>
                    <TableCell>
                      {row.State.Status === 'running' ? (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title='Running'>
                          <ThumbUp color='primary' />
                        </Tooltip>
                      ) : (
                        <MuiThemeProvider theme={themeRedColor}>
                          <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title='Stoped'>
                            <ThumbDown color='primary' />
                          </Tooltip>
                        </MuiThemeProvider>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        disableFocusListener
                        disableTouchListener
                        title='Restart'>
                        <IconButton
                          onClick={e =>
                            this.props.handleRestartAContainer(row.Id, row.Name)
                          }
                          disabled={row.State.Status !== 'running'}>
                          <Refresh />
                        </IconButton>
                      </Tooltip>

                      {row.State.Status === 'running' ? (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title='Stop'>
                          <IconButton
                            onClick={e =>
                              this.props.handleStopContainers(row.Id, row.Name)
                            }
                            disabled={row.State.Status !== 'running'}>
                            <Stop />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title='Start'>
                          <IconButton
                            onClick={e =>
                              this.props.handleRestartAContainer(
                                row.Id,
                                row.Name
                              )
                            }>
                            <PlayArrow />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip
                        disableFocusListener
                        disableTouchListener
                        title='Delete'>
                        <IconButton
                          onClick={e => this.handleClickOpen(row.Id, row.Name)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {row.State.Status === 'running' ? (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title='Node-Red Editor'>
                          <IconButton
                            color='primary'
                            onClick={e => {
                              alert(
                                'Note: This is a protected route. CMS is still in development. The username and password for Node-Red Editor is admin.'
                              );
                              this.props.viewContainer(row.Id);
                            }}
                            value={row.Id}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <MuiThemeProvider theme={themeRedColor}>
                          <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title='View'>
                            <IconButton
                              color='primary'
                              disabled={true}
                              onClick={e => this.props.viewContainer(row.Id)}
                              value={row.Id}>
                              <VisibilityOff />
                            </IconButton>
                          </Tooltip>
                        </MuiThemeProvider>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.State.Status === 'running' ? (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title='Node-Red Dashboard'>
                          <IconButton
                            color='primary'
                            onClick={e => this.props.viewDashboard(row.Id)}
                            value={row.Id}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <MuiThemeProvider theme={themeRedColor}>
                          <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title='View'>
                            <IconButton
                              color='primary'
                              disabled={true}
                              onClick={e => this.props.viewDashboard(row.Id)}
                              value={row.Id}>
                              <VisibilityOff />
                            </IconButton>
                          </Tooltip>
                        </MuiThemeProvider>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <MuiThemeProvider theme={themeRedColor}>
          <Dialog
            open={this.state.deleteAContainer}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby='alert-dialog-slide-title2'
            aria-describedby='alert-dialog-slide-description2'>
            <DialogTitle id='alert-dialog-slide-title2'>
              {'Delete container?'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description2'>
                Are you sure you want to delete container '
                {this.state.containerNameToDelete}'?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color='default'>
                No
              </Button>
              <Button onClick={this.handleCloseAndDelete} color='primary'>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </Paper>
    );
  }
}

export default ContainerList;
