import React from 'react';
import {Route, Redirect} from 'react-router-dom';


export const PrivateRoute = ({
    userLoggedIn,
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            component={(props) => (userLoggedIn
            ? <div>
                    <Component {...props}/>
                </div>
            : <Redirect to="/"/>)}/>
    );
};
