import React from "react";
import ReactDOM from "react-dom";
import AppRouter, { history } from "./routers/AppRouter";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store/configureStore";
import { logInUser, logOutUser } from "./actions/containers";
import {
  getFromStorage,
  setInStorage,
  clearFromStorage
} from "./models/storage";

const store = configureStore();

require("dotenv").config();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById("app"));
    hasRendered = true;
  }
};

export const reDirect = (userId, userName) => {
  let currentUser = getFromStorage("currentUser");
  let currentUserName = getFromStorage("currentUserName");
  console.log("Current User: ", currentUser);
  console.log("Current Username ", currentUserName);
  console.log("Location Pathname: ", history.location.pathname);
  console.log("Type of userId: ", typeof userId);
  console.log(`ENV Variable: ${process.env.REACT_APP_URL}`);

  /*
    / User Clicks logout from dashboard page
    / OR
    / User opens the dashboard without loggging in
    */
  if (
    (typeof userId !== "string" &&
      currentUser !== null &&
      history.location.pathname === "/logout") ||
    (typeof userId !== "string" && currentUser === null)
  ) {
    store.dispatch(logOutUser());
    clearFromStorage("currentUser");
    clearFromStorage("currentUserName");
    renderApp();
    history.push("/");
  } else {
    /*
    / User Logs in
    / OR
    / User Logs in and closes tab and then re-opens tab
    */
    if (
      getFromStorage("currentUser") === null ||
      getFromStorage("currentUserName") === null
    ) {
      setInStorage("currentUser", userId);
      setInStorage("currentUserName", userName);
      console.log("Setting Current User: ", getFromStorage("currentUser"));
      console.log(
        "Setting Current Username ",
        getFromStorage("currentUserName")
      );
      store.dispatch(logInUser(userId, userName));
    } else {
      console.log(currentUserName);
      store.dispatch(logInUser(currentUser, currentUserName));
    }

    renderApp();
    if (
      history.location.pathname === "/" ||
      history.location.pathname === "/login"
    ) {
      history.push("/dashboard");
    }
  }
};
reDirect();

serviceWorker.unregister();
