import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { langSelected } from "../Redux/selectors";
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

export default ({ children }) => {
  const langSelected1 = useSelector((state) => langSelected(state));
  const [locale, setLocale] = useState();

  useEffect(() => {
    switch (langSelected1) {
      case "es":
        import("@material-ui/core/locale").then((obj) => setLocale(obj.esES));
        return;
      case "en":
        import("@material-ui/core/locale").then((obj) => setLocale(obj.enUS));
        return;
      default:
        import("@material-ui/core/locale").then((obj) => setLocale(obj.esES));
        return;
    }
  }, [langSelected1]);

  const theme = createMuiTheme(
    {
      /* palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    }, */
    },
    locale
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
