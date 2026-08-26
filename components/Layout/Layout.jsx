import * as React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SidebarList from "./List";
import {
  AppBar,
  DrawerHeader,
  Main,
  drawerHeight,
  drawerWidth,
} from "./LayoutComponents";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import css from "@/styles/layout.module.css";
import LangSwitch from "../LangSwitch"; // Dein Sprach-Schalter
import AnnouncementDialog from "../AnnouncementDialog";

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const [open, setOpen] = React.useState(true);

  const screenMedium = useMediaQuery("(max-width:800px)");

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // --- Sprache aus dem Gedächtnis laden ---
  React.useEffect(() => {
    const savedLang = localStorage.getItem("krc_language");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  React.useEffect(() => {
    setOpen(screenMedium ? false : true);
  }, [screenMedium]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      {/* <AnnouncementDialog /> */}
      {/* THE TOP PURPLE HEADER BAR */}
      <AppBar
        sx={{
          height: drawerHeight,
          backgroundColor: "#692046",
        }}
      >
        {/* Mobile view layout for the top bar */}
        {screenMedium && (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-between", // Platz zwischen Logo und Button
              alignItems: "center",
              paddingInline: "10px",
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <IconButton onClick={() => setOpen(!open)}>
                {open ? (
                  <CloseIcon sx={{ color: "#fff" }} />
                ) : (
                  <MenuIcon sx={{ color: "#fff" }} />
                )}
              </IconButton>

              <Link
                href={"/"}
                style={{
                  textDecoration: "none",
                  backgroundColor: "#591036",
                  display: "grid",
                  placeItems: "center",
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "25%",
                }}
              >
                <img
                  style={{ width: "2rem" }}
                  src="/assets/logo.svg"
                  alt="Logo"
                />
              </Link>

              <h3
                style={{ fontSize: "0.7rem", textAlign: "center", margin: 0 }}
              >
                <span style={{ fontSize: "0.7rem", padding: "0" }}>KRC </span>
                {t("header.kanzlei")}
              </h3>
            </div>

            {/* Sprachwechsler Mobile */}
            <LangSwitch />
          </div>
        )}

        {/* Desktop view layout for the top bar (contact info) */}
        {!screenMedium && (
          <div
            className={css.header_info_div}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "100%",
              paddingRight: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              {t("header.address")}
              <span style={{ paddingInline: "3px" }} />
              <a
                style={{ color: "#fff", textDecoration: "none" }}
                href="tel:+436601743900"
              >
                +43 660 174 39 00
              </a>
              <span style={{ paddingInline: "3px" }}> | </span>
              <a
                style={{ color: "#fff", textDecoration: "none" }}
                href="mailto:office@krc-buchhaltung.at"
              >
                office@krc-buchhaltung.at
              </a>
            </div>

            {/* Sprachwechsler Desktop */}
            <LangSwitch />
          </div>
        )}
      </AppBar>

      {/* THE LEFT SIDEBAR MENU */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fff",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader />
        <div
          style={{
            display: "flex",
            columnGap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            paddingBlock: "2rem",
          }}
        >
          <Link href={"/"} style={{ textDecoration: "none" }}>
            <img style={{ width: "8rem" }} src="/assets/logo.svg" alt="Logo" />
          </Link>
          <h3
            style={{
              color: "#000",
              fontSize: "1rem",
              textAlign: "center",
              margin: 0,
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                display: "block",
                width: "100%",
                padding: "0",
              }}
            >
              KRC
            </span>
            {t("header.kanzlei")}
          </h3>
        </div>
        <Divider />
        <SidebarList />
      </Drawer>

      {/* THE MAIN CONTENT AREA ON THE RIGHT */}
      <Main
        open={open}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <DrawerHeader />

        {/* Echter Content */}
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Main>
    </Box>
  );
};

export default Layout;
