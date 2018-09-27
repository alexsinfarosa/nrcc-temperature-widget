import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
// import registerServiceWorker from "./registerServiceWorker";

import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import enLocale from "date-fns/locale/en-US";
// Mobx
import { Provider } from "mobx-react";
import AppStore from "./stores/AppStore";
const appStore = new AppStore();

ReactDOM.render(
  <Provider appStore={appStore}>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
      <App />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById("root")
);
// registerServiceWorker();
