import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { Button, Box } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (err) {
      console.error("Fehler beim Abmelden:", err.message);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      sx={{
        position: "fixed",
        bottom: { xs: 24, md: 32 },
        right: { xs: 24, md: 32 },
        zIndex: 9999,
        backgroundColor: "#5c1d35",
        color: "white",
        borderRadius: "50px",
        minWidth: { xs: "50px", md: "140px" },
        height: { xs: "50px", md: "45px" },
        padding: { xs: "0", md: "0 20px" },
        boxShadow: "0 4px 20px rgba(92, 29, 53, 0.4)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "#4a172b",
          transform: "translateY(-3px)",
          boxShadow: "0 6px 25px rgba(92, 29, 53, 0.6)",
        },
      }}
    >
      {/* Das saubere Material UI Icon */}
      <LogoutIcon sx={{ fontSize: 22 }} />
      
      <Box 
        component="span" 
        sx={{ 
          display: { xs: "none", md: "inline" }, 
          ml: 1.5, 
          fontWeight: 500,
          letterSpacing: "0.5px",
          textTransform: "none"
        }}
      >
        Abmelden
      </Box>
    </Button>
  );
}