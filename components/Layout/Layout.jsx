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

  // --- NEUE IMPORTE FÜR DIE ALERT BOX ---
  import Dialog from "@mui/material/Dialog";
  import DialogContent from "@mui/material/DialogContent";
  import DialogActions from "@mui/material/DialogActions";
  import Button from "@mui/material/Button";
  import Checkbox from "@mui/material/Checkbox";
  import FormControlLabel from "@mui/material/FormControlLabel";
  // --------------------------------------

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

  const Layout = ({ children }) => {
    const { t, i18n } = useTranslation(); 
    const router = useRouter(); 
    const theme = useTheme();
    
    const [open, setOpen] = React.useState(true);
    
    // --- NEUE STATES FÜR DIE ALERT BOX ---
    const [alertOpen, setAlertOpen] = React.useState(false); // Startet false, öffnet sich im useEffect
    const [dontShowAgain, setDontShowAgain] = React.useState(false);
    
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

    // --- Alert Box prüfen ---
    React.useEffect(() => {
      const hideHolidayAlert = localStorage.getItem("hide_holiday_alert");
      if (!hideHolidayAlert) {
        setAlertOpen(true);
      }
    }, []);

    React.useEffect(() => {
      setOpen(screenMedium ? false : true);
    }, [screenMedium]);

    // Funktion zum Schließen & Speichern
    const handleCloseAlert = () => {
      if (dontShowAgain) {
        localStorage.setItem("hide_holiday_alert", "true");
      }
      setAlertOpen(false);
    };

    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        
        {/* THE TOP PURPLE HEADER BAR */}
        <AppBar
          sx={{
            height: drawerHeight,
            backgroundColor: "#5a1835",
          }}
        >
          {/* Mobile view layout for the top bar */}
          {screenMedium && (
            <div
              style={{
                textDecoration: "none",
                    backgroundColor: "#421126", //
                    display: "grid",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "space-between", // Platz zwischen Logo und Button
                alignItems: "center",
                paddingInline: "10px", 
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
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
                  <img style={{ width: "2rem" }} src="/assets/logo.svg" alt="Logo" />
                </Link>

                <h3 style={{ fontSize: "0.7rem", textAlign: "center", margin: 0 }}>
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
            <div className={css.header_info_div} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%', paddingRight: '20px' }}>
              <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                {t("header.address")}
                <span style={{ paddingInline: "3px" }} />
                <a style={{ color: "#fff", textDecoration: "none" }} href="tel:+436601743900">
                  +43 660 174 39 00
                </a>
                <span style={{ paddingInline: "3px" }}> | </span>
                <a style={{ color: "#fff", textDecoration: "none" }} href="mailto:office@krc-buchhaltung.at">
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
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            zIndex: 0,
          }}
          // Hier injizieren wir die Styles DIREKT in das innere Paper-Element
          PaperProps={{
            sx: {
              width: drawerWidth,
              boxSizing: 'border-box',
              // !important zwingt MUI, unsere Design-Regeln zu akzeptieren
              backgroundColor: 'rgba(255, 255, 255, 0.98) !important', 
              borderRight: 'none !important', // Entfernt die harte Linie rechts
              boxShadow: '4px 0 24px rgba(0,0,0,0.12) !important', // Setzt den weichen Schatten
              borderRadius: '0 24px 24px 0 !important', // Rundet die Ecken rechts ab
            }
          }}
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
            <h3 style={{ color: "#000", fontSize: "1rem", textAlign: "center", margin: 0 }}>
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
        <Main open={open} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <DrawerHeader /> 
          
          {/* --- NEUE ZENTRIERTE ALERT BOX (MODAL) --- */}
          <Dialog
            open={alertOpen}
            onClose={handleCloseAlert}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "8px",
                border: "3px solid #721c24", // Roter Rahmen
                backgroundColor: "#fff5f5" // Leichter Rot-Stich für Aufmerksamkeit
              }
            }}
          >
            <DialogContent sx={{ color: "#721c24", px: { xs: 2, sm: 4 }, pt: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                {/* Rotes Warn-Zeichen */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#721c24" style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                  <path d="M12 2L1 21h22L12 2zm0 3.45l8.4 14.55H3.6L12 5.45zM11 10h2v5h-2v-5zm0 6h2v2h-2v-2z"/>
                </svg>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Wichtige Information
                </Typography>
              </Box>

              {/* DEUTSCH */}
              <Typography sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
                <b>Betriebsurlaub:</b><br/>
                Vom 08. August 2026 bis zum 24. August 2026 befindet sich unsere Kanzlei im Betriebsurlaub. In dieser Zeit sind wir über WhatsApp und E-Mail erreichbar und werden Ihre Anfragen so schnell wie möglich beantworten. Mitarbeiter an- und -abmeldungen können Sie weiterhin über unsere Webseite vornehmen.<br/><br/>
                Vielen Dank für Ihr Verständnis.
              </Typography>

              <Divider sx={{ my: 3, backgroundColor: "#f5c6cb" }} />

              {/* TÜRKISCH */}
              <Typography sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
                <b>Şirket Tatili:</b><br/>
                8 Agustos 2026 - 24 Agustos 2026 tarihleri arasında büromuz yıllık izin dolayısıyla kapalı olacaktır. Bu süre zarfında bize WhatsApp ve e-posta üzerinden ulaşabilirsiniz. Soru ve taleplerinizi mümkün olan en kısa sürede yanıtlamaya çalışacağız. Personel kaydı ve diğer işlemlerinizi web sitemiz üzerinden yapmaya devam edebilirsiniz.<br/><br/>
                Anlayışınız için teşekkür ederiz.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 2, sm: 4 }, pb: { xs: 2, sm: 3 } }}>
              {/* Kästchen Links */}
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={dontShowAgain} 
                    onChange={(e) => setDontShowAgain(e.target.checked)} 
                    sx={{ color: "#721c24", '&.Mui-checked': { color: '#721c24' } }} 
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.85rem", color: "#721c24", fontWeight: "bold" }}>
                    Nicht mehr anzeigen<br/>Tekrar gösterme
                  </Typography>
                }
              />
              {/* OK Button Rechts */}
              <Button 
                onClick={handleCloseAlert} 
                variant="contained" 
                sx={{ 
                  backgroundColor: "#721c24", 
                  color: "#fff", 
                  fontWeight: "bold",
                  px: 4,
                  "&:hover": { backgroundColor: "#5a151c" } 
                }}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
          {/* ----------------------------------------- */}

          {/* Echter Content */}
          <Box sx={{ flexGrow: 1 }}>
              {children} 
          </Box>
          
        </Main>
      </Box>
    );
  };

  export default Layout;