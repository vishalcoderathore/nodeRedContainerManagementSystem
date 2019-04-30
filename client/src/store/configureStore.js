import {createStore, combineReducers, compose} from 'redux';
//import thunk from 'redux-thunk';
import containersReducer from '../reducers/containersReducer';
import authReducer from '../reducers/authReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default() => {
    const store = createStore(combineReducers({
        containers: containersReducer,
        auth: authReducer
    }),
    // composeEnhancers(applyMiddleware(thunk)) window.__REDUX_DEVTOOLS_EXTENSION__
    // && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
};