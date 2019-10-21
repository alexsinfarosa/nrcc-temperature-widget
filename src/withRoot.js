import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";
import CssBaseline from "@material-ui/core/CssBaseline";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#67793E"
    },
    secondary: {
      main: amber[500]
    }
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
