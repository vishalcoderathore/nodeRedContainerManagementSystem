import React, { Component } from "react";
import { Button, Typography, Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { reDirect } from "../index";
import Notification from "./Notification";
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";

const style = {
  Grid: {
    marginTop: 100
  },
  Paper: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10
  },
  Button: {
    marginLeft: 0,
    marginTop: 10,
    marginBottom: 10,
    padding: 20
  }
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openInvalid: false,
      message: "",
      loading: false
    };
  }

  handleClick = message => {
    console.log("setting state");
    this.setState(() => {
      return {
        openInvalid: true,
        message: message
      };
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState(() => {
      return {
        openInvalid: false
      };
    });
  };

  handleClickLoading = () => {
    this.setState(state => ({
      loading: !state.loading
    }));
  };

  onSubmit = e => {
    e.preventDefault();
    this.handleClickLoading();
    // Get User Entered Username
    var userName = document.getElementById("user").value;
    // Get User Entered Password
    var password = document.getElementById("pass").value;
    // Reset input fields to blank
    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
    if (userName === "" || password === "") {
      this.handleClickLoading();
      this.handleClick("Error: Username and Password are required fields!");
    } else {
      this.callOnSubmit(userName, password)
        .then(res => {
          this.handleClickLoading();
          var statusCode = JSON.parse(res.body).code;
          if (statusCode === 401) {
            this.handleClick("Access Denied Incorrect Credentials");
          } else if (statusCode === 404) {
            this.handleClick("Access Denied. Unknown User");
          } else if (statusCode === 200) {
            reDirect(res.userId, res.userName);
          } else {
            this.handleClick("Server Error");
          }
        })
        .catch(err => {
          this.handleClickLoading();
          console.log(err);
        });
    }
  };

  callOnSubmit = async (userName, password) => {
    const response = await fetch("/api/login", {
      method: "post",
      body: JSON.stringify({ userName: userName, password: password })
    });
    const body = await response.json();
    if (
      response.status !== 200 &&
      response.status !== 401 &&
      response.status !== 404
    ) {
      throw Error(body.message);
    }
    return body;
  };

  render(props) {
    const { loading } = this.state;

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={style.Grid}
      >
        <Grid item xs={6}>
          <Paper style={style.Paper}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Hidden lgDown>
                <Grid item xs={6}>
                  <img src="../images/docker_node_red_banner.png" />
                </Grid>
              </Hidden>
              <Grid item xs={6}>
                <form onSubmit={this.onSubmit}>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        component={"span"}
                        variant="h6"
                        color="inherit"
                        gutterBottom
                      >
                        Enter Credentials to Login
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextField
                        label="Enter Username"
                        id="user"
                        defaultValue=""
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextField
                        label="Enter Password"
                        id="pass"
                        type="password"
                        defaultValue=""
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Button
                        id="submitLoginBtn"
                        variant="contained"
                        style={style.Button}
                        color="primary"
                        size="small"
                        type="submit"
                      >
                        Log In
                      </Button>
                    </Grid>
                    <Fade
                      in={loading}
                      style={{
                        transitionDelay: loading ? "800ms" : "0ms"
                      }}
                      unmountOnExit
                    >
                      <CircularProgress />
                    </Fade>
                  </Grid>
                </form>
              </Grid>
            </Grid>
            <Notification
              openInvalid={this.state.openInvalid}
              handleClose={this.handleClose}
              message={this.state.message}
              anchorOriginVertical={"top"}
              anchorOriginHorizontal={"center"}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return { userLoggedIn: state.auth.userLoggedIn };
};

//export default LoginPage;
export default connect(mapStateToProps)(LoginPage);
