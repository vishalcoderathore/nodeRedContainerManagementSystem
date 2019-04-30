import React from 'react';
import {Route, Redirect} from 'react-router-dom';


export const PublicRoute = ({
    userLoggedIn,
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            component={(props) => (userLoggedIn
            ?<Redirect to="/dashboard" /> : <Component {...props} />)}/>
    );
};
