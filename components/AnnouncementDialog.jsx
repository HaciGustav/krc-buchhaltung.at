import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

const AnnouncementDialog = () => {
  // --- NEUE STATES FÜR DIE ALERT BOX ---
  const [alertOpen, setAlertOpen] = useState(false); // Startet false, öffnet sich im useEffect
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // --- Alert Box prüfen ---
  useEffect(() => {
    const hideHolidayAlert = localStorage.getItem("hide_holiday_alert");
    if (!hideHolidayAlert) {
      setAlertOpen(true);
    }
  }, []);

  // Funktion zum Schließen & Speichern
  const handleCloseAlert = () => {
    if (dontShowAgain) {
      localStorage.setItem("hide_holiday_alert", "true");
    }
    setAlertOpen(false);
  };

  return (
    <Dialog
      open={alertOpen}
      onClose={handleCloseAlert}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          border: "3px solid #721c24", // Roter Rahmen
          backgroundColor: "#fff5f5", // Leichter Rot-Stich für Aufmerksamkeit
        },
      }}
    >
      <DialogContent
        sx={{ color: "#721c24", px: { xs: 2, sm: 4 }, pt: { xs: 3, sm: 4 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          {/* Rotes Warn-Zeichen */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#721c24"
            style={{ width: "36px", height: "36px", flexShrink: 0 }}
          >
            <path d="M12 2L1 21h22L12 2zm0 3.45l8.4 14.55H3.6L12 5.45zM11 10h2v5h-2v-5zm0 6h2v2h-2v-2z" />
          </svg>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Wichtige Information
          </Typography>
        </Box>

        {/* DEUTSCH */}
        <Typography sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
          <b>Betriebsurlaub:</b>
          <br />
          Vom 08. August 2026 bis zum 24. August 2026 befindet sich unsere
          Kanzlei im Betriebsurlaub. In dieser Zeit sind wir über WhatsApp und
          E-Mail erreichbar und werden Ihre Anfragen so schnell wie möglich
          beantworten. Mitarbeiter an- und -abmeldungen können Sie weiterhin
          über unsere Webseite vornehmen.
          <br />
          <br />
          Vielen Dank für Ihr Verständnis.
        </Typography>

        <Divider sx={{ my: 3, backgroundColor: "#f5c6cb" }} />

        {/* TÜRKISCH */}
        <Typography sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
          <b>Şirket Tatili:</b>
          <br />
          8 Agustos 2026 - 24 Agustos 2026 tarihleri arasında büromuz yıllık
          izin dolayısıyla kapalı olacaktır. Bu süre zarfında bize WhatsApp ve
          e-posta üzerinden ulaşabilirsiniz. Soru ve taleplerinizi mümkün olan
          en kısa sürede yanıtlamaya çalışacağız. Personel kaydı ve diğer
          işlemlerinizi web sitemiz üzerinden yapmaya devam edebilirsiniz.
          <br />
          <br />
          Anlayışınız için teşekkür ederiz.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        {/* Kästchen Links */}
        <FormControlLabel
          control={
            <Checkbox
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              sx={{ color: "#721c24", "&.Mui-checked": { color: "#721c24" } }}
            />
          }
          label={
            <Typography
              sx={{ fontSize: "0.85rem", color: "#721c24", fontWeight: "bold" }}
            >
              Nicht mehr anzeigen
              <br />
              Tekrar gösterme
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
            "&:hover": { backgroundColor: "#5a151c" },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementDialog;
