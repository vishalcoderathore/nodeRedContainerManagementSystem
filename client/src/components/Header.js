import React from 'react';
import {connect} from 'react-redux';
import { history} from '../routers/AppRouter';
import {reDirect} from '../index';
import MenuAppBar from './MenuAppBar';

export const Header = (props) => (
    <MenuAppBar userLoggedIn={props.userLoggedIn} logOutUser={props.logOutUser}/>
);

//export default Header;
const mapStateToProps = (state) => {
    return {userLoggedIn: state.auth.userLoggedIn};
};
const mapDispatchToProps = (dispatch) => {
    return {
        logOutUser: () => {
            history.push('/logout');
            reDirect();
        }
            
    };
};
//export default Header;
export default connect(mapStateToProps, mapDispatchToProps)(Header);