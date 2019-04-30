import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import Dashboard from '../components/Dashboard';
import HelpPage from '../components/HelpPage';
import NotFoundPage from '../components/NotFoundPage';
import Header from '../components/Header';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import { PrivateRoute} from './PrivateRoute';
import { PublicRoute} from './PublicRoute';

import {connect} from 'react-redux';

export const history = createHistory();

const AppRouter = (props) => (
    <Router history= {history}>
        <div>
            <Header/>
            <Switch>
                <PublicRoute path="/login" component={LoginPage} userLoggedIn={props.userLoggedIn} exact={true}/>
                <PublicRoute path="/register" userLoggedIn={props.userLoggedIn} component={RegisterPage} />
                <PrivateRoute path="/dashboard" component={Dashboard} userLoggedIn={props.userLoggedIn} />
                <Route path="/help" component={HelpPage}/>
                <PublicRoute path="/" component={LoginPage} userLoggedIn={props.userLoggedIn} />
                <Route component={NotFoundPage}/>
            </Switch>

        </div>
    </Router>
);

//export default AppRouter;
const mapStateToProps = (state) => {
    return {userLoggedIn: !!state.auth.userId};
};

export default connect(mapStateToProps)(AppRouter);