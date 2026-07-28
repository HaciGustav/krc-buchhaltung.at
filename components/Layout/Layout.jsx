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
import LogoutIcon from "@mui/icons-material/Logout";
import Fab from "@mui/material/Fab";

// --- IMPORTE FÜR DIE ALERT BOX ---
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
// ----------------------------------

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
import LangSwitch from "../LangSwitch"; 
import { supabase } from "../../lib/supabaseClient";

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation(); 
  const router = useRouter(); 
  const theme = useTheme();
  
  const [open, setOpen] = React.useState(true);
  const [userEmail, setUserEmail] = React.useState("");
  
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  
  const screenMedium = useMediaQuery("(max-width:800px)");

  // --- KUGELSICHERE LOGIK FÜRS AUSBLENDEN ---
  // Prüft, ob der Pfad "/" ist, "/login" enthält oder ob asPath "/" ist.
  const isExcludedPage = 
    router.pathname === "/" || 
    router.asPath === "/" || 
    router.pathname.includes("login");

  // Zeigt Abmelden/Angemeldet als NUR an, wenn wir NICHT auf den ausgeschlossenen Seiten sind UND der User eingeloggt ist.
  const showAuthInfo = !isExcludedPage && userEmail !== "";

  // --- CURRENT USER ABRUFEN ---
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }
    };
    fetchUser();
  }, [router.pathname]);

  // --- LOGOUT FUNKTION ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail("");
    router.push("/login");
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
              backgroundColor: "#421126",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
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
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <LangSwitch />
            </div>
          </div>
        )}

        {/* Desktop view layout for the top bar */}
        {!screenMedium && (
          <div className={css.header_info_div} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', paddingInline: '24px', width: '100%' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
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
            
            {/* Rechts: Angemeldet Als (falls eingeloggt) & Sprachwechsler */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {showAuthInfo && (
                <Typography sx={{ color: "#fff", fontSize: "0.85rem", opacity: 0.9 }}>
                  Angemeldet als: <strong style={{ color: "#d9b877", fontWeight: 600 }}>{userEmail}</strong>
                </Typography>
              )}
              <LangSwitch />
            </div>
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.98)', 
            borderRight: 'none', 
            boxShadow: '4px 0 24px rgba(0,0,0,0.06)', 
            borderRadius: '0 24px 24px 0', 
          },
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
      <Main open={open} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', position: 'relative' }}>
        <DrawerHeader /> 
        
        {/* --- EXTENDED FLOATING ACTION BUTTON (nur für angemeldete User, nicht auf Start/Login) --- */}
        {showAuthInfo && (
          <Fab
            variant="extended"
            onClick={handleLogout}
            sx={{
              position: "fixed",
              bottom: 30,
              right: 30,
              zIndex: 1200,
              backgroundColor: "#5a1835",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              boxShadow: "0 6px 20px rgba(90, 24, 53, 0.35)",
              "&:hover": {
                backgroundColor: "#421126",
                transform: "scale(1.05)",
                boxShadow: "0 8px 25px rgba(90, 24, 53, 0.5)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <LogoutIcon sx={{ mr: 1 }} />
            Abmelden
          </Fab>
        )}
        {/* ------------------------------------------------------------------------------------------ */}

        {/* ALERT BOX (MODAL) */}
        <Dialog
          open={alertOpen}
          onClose={handleCloseAlert}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "8px",
              border: "3px solid #721c24", 
              backgroundColor: "#fff5f5" 
            }
          }}
        >
          <DialogContent sx={{ color: "#721c24", px: { xs: 2, sm: 4 }, pt: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#721c24" style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                <path d="M12 2L1 21h22L12 2zm0 3.45l8.4 14.55H3.6L12 5.45zM11 10h2v5h-2v-5zm0 6h2v2h-2v-2z"/>
              </svg>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Wichtige Information
              </Typography>
            </Box>

            <Typography sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
              <b>Betriebsurlaub:</b><br/>
              Vom 08. August 2026 bis zum 24. August 2026 befindet sich unsere Kanzlei im Betriebsurlaub. In dieser Zeit sind wir über WhatsApp und E-Mail erreichbar und werden Ihre Anfragen so schnell wie möglich beantworten. Mitarbeiter an- und -abmeldungen können Sie weiterhin über unsere Webseite vornehmen.<br/><br/>
              Vielen Dank für Ihr Verständnis.
            </Typography>

            <Divider sx={{ my: 3, backgroundColor: "#f5c6cb" }} />

            <Typography sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
              <b>Şirket Tatili:</b><br/>
              8 Agustos 2026 - 24 Agustos 2026 tarihleri arasında büromuz yıllık izin dolayısıyla kapalı olacaktır. Bu süre zarfında bize WhatsApp ve e-posta üzerinden ulaşabilirsiniz. Soru ve taleplerinizi mümkün olan en kısa sürede yanıtlamaya çalışacağız. Personel kaydı ve diğer işlemlerinizi web sitemiz üzerinden yapmaya devam edebilirsiniz.<br/><br/>
              Anlayışınız için teşekkür ederiz.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 2, sm: 4 }, pb: { xs: 2, sm: 3 } }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={dontShowAgain} 
                  onChange={(e) => setDontShowAgain(e.target.value ? e.target.checked : e.target.checked)} 
                  sx={{ color: "#721c24", '&.Mui-checked': { color: '#721c24' } }} 
                />
              }
              label={
                <Typography sx={{ fontSize: "0.85rem", color: "#721c24", fontWeight: "bold" }}>
                  Nicht mehr anzeigen<br/>Tekrar gösterme
                </Typography>
              }
            />
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

        {/* Echter Content */}
        <Box sx={{ flexGrow: 1 }}>
            {children} 
        </Box>
        
      </Main>
    </Box>
  );
};

export default Layout;