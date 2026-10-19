import "@/styles/globals.css";
import "../i18n/i18n";

import Layout from "@/components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material";

// Achromatic ledger: chrome in ink, KRC plum only on focus and links.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1d1f20" },
    secondary: { main: "#692046" },
    error: { main: "#c4242a" },
    text: { primary: "#111111", secondary: "#5f6368" },
    background: { default: "#f5f4f2", paper: "#ffffff" },
    divider: "#e8e8e8",
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Geist", Inter, system-ui, sans-serif',
    fontSize: 14,
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 40, paddingInline: 18, borderRadius: 6 },
      },
    },
    // Labels sit above the field instead of floating inside it.
    MuiInputLabel: {
      defaultProps: { shrink: true },
      styleOverrides: {
        root: {
          position: "relative",
          transform: "none !important",
          fontSize: 14,
          fontWeight: 500,
          color: "#111111",
          marginBottom: 6,
          whiteSpace: "normal",
          maxWidth: "100%",
          "&.Mui-focused": { color: "#111111" },
          "&.Mui-error": { color: "#c4242a" },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: { notched: false },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 6,
          fontSize: 14,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d5db",
            top: 0,
            "& legend": { display: "none" },
          },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#692046",
            borderWidth: 2,
          },
        },
        input: {
          padding: "10px 12px",
          "&::placeholder": { color: "#6b6b6b", opacity: 1 },
        },
        inputSizeSmall: { padding: "10px 12px" },
        multiline: { padding: "10px 12px" },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: { label: { fontSize: 14 } },
    },
    MuiCheckbox: {
      styleOverrides: { root: { "&.Mui-checked": { color: "#1d1f20" } } },
    },
    MuiMenuItem: { styleOverrides: { root: { fontSize: 14 } } },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 8 } },
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </ThemeProvider>
  );
}
