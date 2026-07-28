import "@/styles/globals.css";
import "../i18n/i18n"; 

import Layout from "@/components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

// --- NEUE IMPORTE FÜR LADEBILDSCHIRM ---
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
// --------------------------------------

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState("light");
  
  // --- STATE FÜR ROUTER & LADEBILDSCHIRM ---
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // -----------------------------------------

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
    localStorage.setItem("theme", mode === "dark" ? "light" : "dark");
  };

  const getDesignTokens = () => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            navbar: { main: "#5a1835" },     // <--- Geändert auf Weinrot
            primary: { main: "#1976D2" },    
            secondary: { main: "#5a1835" },  // <--- Geändert auf Weinrot
            error: { main: "#e10000" },      // (Error bleibt meistens rot)
            dateInputColor: { main: "#000" },
          }
        : {
            primary: { main: "#1976D2" },
            secondary: { main: "#5a1835" },  // <--- Geändert auf Weinrot
            error: { main: "#e10000" },
            toggleBtn: { main: "#008000" },
            dateInputColor: { main: "#fff" },
          }),
    },
    components: {
      MuiInputLabel: {
        defaultProps: {
          sx: {
            "&.MuiInputLabel-shrink": { top: "3px" },
          },
        },
        styleOverrides: {
          root: { fontSize: "0.7rem" },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { fontSize: "0.7rem" },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { fontSize: "0.7rem" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { fontSize: "0.7rem" },
        },
      },
    },
  });

  const theme = useMemo(() => {
    const baseTheme = getDesignTokens(mode);
    return createTheme({
      ...baseTheme,
      components: {
        ...(baseTheme.components || {}),
        MuiMenu: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
        MuiPopover: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
        MuiModal: {
          defaultProps: {
            disableScrollLock: true,
          },
        },
      },
    });
  }, [mode]);
  
  useEffect(() => {
    const x = localStorage.getItem("theme");
    setMode(x ? x : "light");
  }, []);

  // --- LOGIK FÜR DEN LADEBILDSCHIRM ---
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);
  // ------------------------------------

  return (
    <ThemeProvider theme={theme}>
      
      {/* --- LADEBILDSCHIRM OVERLAY --- */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)", 
            backdropFilter: "blur(6px)", // Macht den Hintergrund elegant unscharf
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Legt sich über alles andere
          }}
        >
          {/* Ladekreis in eurer Bordeaux-Roten Kanzleifarbe */}
          <CircularProgress size={60} sx={{ color: "#5a1835" }} />
        </Box>
      )}
      {/* ------------------------------ */}

      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </ThemeProvider>
  );
}