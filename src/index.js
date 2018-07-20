import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

// Mobx
import { Provider } from "mobx-react";
import AppStore from "./stores/AppStore";
const appStore = new AppStore();

ReactDOM.render(
  <Provider appStore={appStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
