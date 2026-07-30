import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";

// Icons für die Formulare
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined'; // <-- NEU: Das "X"-Icon für Storno

const SidebarList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const isActive = (path) => router.pathname === path;
  const goldAccentColor = "#c5a880"; 

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "transparent", px: 2, py: 1 }}
      component="nav"
    >
      <div style={{ paddingLeft: "12px", marginBottom: "12px" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1.2px", color: "#888", textTransform: "uppercase" }}>
          {t('navigation.forms') || "Formulare"}
        </span>
      </div>

      <ListItemButton 
        onClick={() => setOpen(!open)}
        sx={{ borderRadius: "12px", mb: 1, py: 1.2, color: "#333", "&:hover": { bgcolor: "rgba(197, 168, 128, 0.08)" } }}
      >
        <ListItemIcon sx={{ minWidth: "36px", color: goldAccentColor }}>
          <DescriptionOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary={t('navigation.forms') || "Formulare"} 
          primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }}
        />
        {open ? <ExpandLess sx={{ color: "#666" }} /> : <ExpandMore sx={{ color: "#666" }} />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1.5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          {/* Anmeldung */}
          <ListItemButton 
            component={Link} 
            href="/anmeldung" 
            selected={isActive("/anmeldung")}
            sx={{
              borderRadius: "10px", py: 1, transition: "all 0.2s ease",
              ...(isActive("/anmeldung") ? {
                bgcolor: "rgba(197, 168, 128, 0.12) !important", color: "#5a1835", fontWeight: "bold",
                borderLeft: `4px solid ${goldAccentColor}`, boxShadow: "0 2px 8px rgba(197, 168, 128, 0.15)"
              } : { color: "#555", "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" } })
            }}
          >
            <ListItemIcon sx={{ minWidth: "34px", color: isActive("/anmeldung") ? goldAccentColor : "#777" }}>
              <PersonAddOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('navigation.registration') || "Anmeldung"} primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isActive("/anmeldung") ? 600 : 400 }} />
          </ListItemButton>

          {/* Abmeldung */}
          <ListItemButton 
            component={Link} 
            href="/abmeldung" 
            selected={isActive("/abmeldung")}
            sx={{
              borderRadius: "10px", py: 1, transition: "all 0.2s ease",
              ...(isActive("/abmeldung") ? {
                bgcolor: "rgba(197, 168, 128, 0.12) !important", color: "#5a1835", fontWeight: "bold",
                borderLeft: `4px solid ${goldAccentColor}`, boxShadow: "0 2px 8px rgba(197, 168, 128, 0.15)"
              } : { color: "#555", "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" } })
            }}
          >
            <ListItemIcon sx={{ minWidth: "34px", color: isActive("/abmeldung") ? goldAccentColor : "#777" }}>
              <PersonRemoveOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('navigation.deregistration') || "Abmeldung"} primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isActive("/abmeldung") ? 600 : 400 }} />
          </ListItemButton>

          {/* Änderung */}
          <ListItemButton 
            component={Link} 
            href="/aenderung" 
            selected={isActive("/aenderung")}
            sx={{
              borderRadius: "10px", py: 1, transition: "all 0.2s ease",
              ...(isActive("/aenderung") ? {
                bgcolor: "rgba(197, 168, 128, 0.12) !important", color: "#5a1835", fontWeight: "bold",
                borderLeft: `4px solid ${goldAccentColor}`, boxShadow: "0 2px 8px rgba(197, 168, 128, 0.15)"
              } : { color: "#555", "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" } })
            }}
          >
            <ListItemIcon sx={{ minWidth: "34px", color: isActive("/aenderung") ? goldAccentColor : "#777" }}>
              <EditNoteOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('navigation.change') || "Änderung"} primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isActive("/aenderung") ? 600 : 400 }} />
          </ListItemButton>

          {/* Stornierung mit X-Icon */}
          <ListItemButton 
            component={Link} 
            href="/storno" 
            selected={isActive("/storno")}
            sx={{
              borderRadius: "10px", py: 1, transition: "all 0.2s ease",
              ...(isActive("/storno") ? {
                bgcolor: "rgba(197, 168, 128, 0.12) !important", color: "#5a1835", fontWeight: "bold",
                borderLeft: `4px solid ${goldAccentColor}`, boxShadow: "0 2px 8px rgba(197, 168, 128, 0.15)"
              } : { color: "#555", "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" } })
            }}
          >
            <ListItemIcon sx={{ minWidth: "34px", color: isActive("/storno") ? goldAccentColor : "#777" }}>
              <CloseOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('navigation.cancellation') || "Stornierung"} primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isActive("/storno") ? 600 : 400 }} />
          </ListItemButton>

        </List>
      </Collapse>
    </List>
  );
};

export default SidebarList;