import React from "react";

import ReactDOM from "react-dom/client";

import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";

import App from "./App";


const theme = createTheme({

  palette: {

    mode: "dark",

    primary: {
      main: "#6C63FF"
    },

    secondary: {
      main: "#8B5CF6"
    },

    background: {

      default: "#080810",

      paper: "#0d0d18"
    },

    success: {
      main: "#10B981"
    },

    warning: {
      main: "#F59E0B"
    },

    error: {
      main: "#EF4444"
    }
  },

  typography: {
    fontFamily:
      "Inter, sans-serif"
  }
});


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <ThemeProvider theme={theme}>

      <CssBaseline />

      <App />

    </ThemeProvider>

  </React.StrictMode>
);