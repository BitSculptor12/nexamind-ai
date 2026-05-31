import { createTheme } from "@mui/material/styles";

const theme = createTheme({

  palette: {

    mode: "light",

    primary: {
      main: "#6C63FF",
    },

    secondary: {
      main: "#8B5CF6",
    },

    info: {
      main: "#06B6D4",
    },

    success: {
      main: "#10B981",
    },

    error: {
      main: "#EF4444",
    },

    background: {

      default: "#F5F7FB",

      paper: "#FFFFFF",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {

    fontFamily:
      '"Inter", "Roboto", sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;