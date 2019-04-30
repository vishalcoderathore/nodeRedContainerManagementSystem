import React from 'react';
import {Typography, Paper} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

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
        padding : 20,
    }
}

const HelpPage = () => (
    <Grid container direction="row" justify="center" alignItems="center" style={style.Grid}>
    <Grid item xs={6}>
        <Paper style={style.Paper}>
       
            <Grid  container direction="column" justify="center" alignItems="center">
                <Grid item xs={12} sm={12} md={12} lg={12} >
                    <Typography component={'span'} variant="h5" color="inherit" gutterBottom>Help Page</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} >
                <Typography  component={'span'} variant="h6" color="inherit" gutterBottom>To Register, head to the Register Page. Enter your orgnaization details and provide a username and a password to create your account.</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} >
                <Typography component={'span'} variant="h6" color="inherit" gutterBottom>If you are an existing customer, you can login to access your Node-Red flows by providing your login credentials on the Login Page.</Typography>
                </Grid>
            </Grid>
    </Paper>
    </Grid> 
    </Grid>
);

export default HelpPage;