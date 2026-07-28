import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useTranslation } from "react-i18next";

const ValidationWarningModal = ({ modalProps, handleClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={Boolean(modalProps?.open)}
      onClose={handleClose}
      aria-labelledby="validation-dialog-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
          borderTop: "6px solid #d32f2f", 
        },
      }}
    >
      {/* HEADER MIT ZENTRIERTEM ICON BADGE */}
      <DialogTitle id="validation-dialog-title" sx={{ pt: 2, pb: 1, textAlign: "center" }}>
        <Box
          sx={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#fde8e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: "32px", color: "#d32f2f" }} />
        </Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
          {t("errors.missingInput")}
        </Typography>
      </DialogTitle>

      {/* CONTENT / FEHLERMELDUNG */}
      <DialogContent sx={{ textAlign: "center", py: 1 }}>
        {modalProps?.message ? (
          <Typography sx={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.5 }}>
            {modalProps.message}
          </Typography>
        ) : (
          <Typography sx={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.5 }}>
            Das Feld
            <Box
              component="span"
              sx={{
                display: "inline-block",
                fontWeight: "700",
                color: "#d32f2f",
                bgcolor: "#fde8e8",
                px: 1,
                py: 0.2,
                borderRadius: "6px",
                mx: 1, // Abstand links und rechts
              }}
            >
              {modalProps?.fieldCaption || ""}
            </Box>
            {t("errors.fieldRequired")}
          </Typography>
        )}
      </DialogContent>

      {/* ACTION BUTTON */}
      <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 1, px: 3 }}>
        <Button
          variant="contained"
          onClick={handleClose}
          fullWidth
          autoFocus
          sx={{
            bgcolor: "#5a1835",
            color: "#fff",
            fontWeight: "bold",
            py: 1.2,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.95rem",
            boxShadow: "0 4px 12px rgba(90, 24, 53, 0.2)",
            "&:hover": {
              bgcolor: "#421126",
              boxShadow: "0 6px 16px rgba(90, 24, 53, 0.35)",
            },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationWarningModal;