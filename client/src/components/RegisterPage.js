import React, { Component } from "react";
import { Button, Typography, Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Notification from "./Notification";
import Grid from "@material-ui/core/Grid";

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

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openInvalid: false,
      message: ""
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

  onSubmit = () => {
    let userName = document.getElementById("usernameId").value;
    let password = document.getElementById("passwordId").value;
    let retypePassword = document.getElementById("retypePasswordId").value;
    let organization = document.getElementById("organizationNameId").value;
    document.getElementById("usernameId").value = "";
    document.getElementById("passwordId").value = "";
    document.getElementById("organizationNameId").value = "";
    document.getElementById("retypePasswordId").value = "";
    if (userName === "" || password === "" || organization === "") {
      this.handleClick("Error: All fields are required!");
    } else if (password !== retypePassword) {
      this.handleClick("Error: Passwords do not match!");
    } else {
      this.callOnSubmit(userName, password, organization)
        .then(res => {
          this.handleClick(`Success: ${JSON.parse(res.body).msg}`);
        })
        .catch(err => console.log(err));
    }
  };

  callOnSubmit = async (userName, password, organization) => {
    const response = await fetch("/api/register", {
      method: "post",
      body: JSON.stringify({
        userName: userName,
        password: password,
        organization: organization
      })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render(props) {
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
                    Enter Credentials to Register
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Enter Organization Name"
                    id="organizationNameId"
                    defaultValue=""
                    onChange={e => {
                      e.target.value = e.target.value.replace(/\s/g, "");
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Enter Username"
                    id="usernameId"
                    defaultValue=""
                    onChange={e => {
                      e.target.value = e.target.value.replace(/\s/g, "");
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Enter Password"
                    id="passwordId"
                    type="password"
                    defaultValue=""
                    onChange={e => {
                      e.target.value = e.target.value.replace(/\s/g, "");
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Re-Type Password"
                    id="retypePasswordId"
                    type="password"
                    defaultValue=""
                    onChange={e => {
                      e.target.value = e.target.value.replace(/\s/g, "");
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button
                    id="submitRegisterBtn"
                    variant="contained"
                    style={style.Button}
                    color="primary"
                    size="small"
                    onClick={this.onSubmit}
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </form>
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

export default RegisterPage;
