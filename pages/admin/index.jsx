import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import ProtectedRoute from "../../components/ProtectedRoute";
import { 
  Box, Typography, Container, Paper, TextField, 
  Button, Tabs, Tab, Alert, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { toast } from "react-toastify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const ADMIN_EMAIL = "office@krc-buchhaltung.at";

  const [tabValue, setTabValue] = useState(0); // 0: Anlegen, 1: Bearbeiten, 2: Löschen
  const [loading, setLoading] = useState(false);

  // Dialog State für die Sicherheitsabfrage
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Formular-Felder
  const [companyMail, setCompanyMail] = useState("");
  const [password, setPassword] = useState("");
  const [employer, setEmployer] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace("/login");
        return;
      }
      setIsAuthorized(true);
    };
    verifyAdmin();
  }, [router]);

  // --- NEU: Felder komplett leeren, wenn der Tab gewechselt wird ---
  const handleTabChange = (event, newVal) => {
    setTabValue(newVal);
    setCompanyMail("");
    setPassword("");
    setEmployer("");
    setWorkAddress("");
    setDescription("");
  };

  // Fängt den Formular-Submit ab und öffnet ggf. den Dialog
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (tabValue === 1 || tabValue === 2) {
      setConfirmOpen(true); // Öffnet den Dialog bei Ändern/Löschen
    } else {
      executeAction(); // Führt Anlegen sofort aus
    }
  };

  // Die eigentliche Funktion, die an das Backend sendet
  const executeAction = async () => {
    setLoading(true);
    setConfirmOpen(false); // Schließt den Dialog, falls er offen war

    const actionMap = ["create", "update", "delete"];
    const currentAction = actionMap[tabValue];

    try {
      const response = await fetch('/api/admin-kunden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: currentAction,
          companyMail,
          password,
          employer,
          workAddress,
          description
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Ein Fehler ist aufgetreten.");
      } else {
        toast.success(result.message || "Erfolgreich ausgeführt!");
        // Nach erfolgreicher Aktion alles leeren
        setCompanyMail("");
        setPassword("");
        setEmployer("");
        setWorkAddress("");
        setDescription("");
      }
    } catch (err) {
      toast.error("Netzwerkfehler: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <ProtectedRoute>
      {/* Container: Kompakt und zentriert, damit nicht gescrollt werden muss */}
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: 'calc(100vh - 100px)', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          py: 2
        }}
      >
        
        {/* Header & Stylischer Zur-Übersicht Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <div>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AdminPanelSettingsIcon sx={{ color: '#5a1835', fontSize: '36px' }} />
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Kunden verwalten (Eingeloggt als: <strong>office@krc-buchhaltung.at</strong>)
            </Typography>
          </div>

          <Button 
            onClick={() => router.push('/admin/ubersicht')}
            sx={{ 
              bgcolor: '#5a1835', 
              color: '#fff',
              px: 3,
              py: 1.2,
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(90, 24, 53, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                bgcolor: '#421126',
                boxShadow: '0 6px 16px rgba(90, 24, 53, 0.4)',
                transform: 'translateY(-1px)'
              } 
            }}
          >
            Zur Kunden Übersicht
            <ArrowForwardIcon fontSize="small" />
          </Button>
        </Box>

        {/* Hauptkarte */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: '16px', 
            borderTop: '6px solid #5a1835',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
          }}
        >
          
          {/* Tabs mit dem neuen Handler, der beim Wechsel alles leert */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              mb: 3, 
              borderBottom: '1px solid #eaeaea',
              '& .MuiTabs-indicator': { backgroundColor: '#5a1835', height: '3px' },
              '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1rem', color: '#666' },
              '& .Mui-selected': { color: '#5a1835 !important' }
            }}
          >
            <Tab label="ANLEGEN" />
            <Tab label="BEARBEITEN" />
            <Tab label="LÖSCHEN" />
          </Tabs>

          <form onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              {/* IMMER SICHTBAR: Firmen E-Mail */}
              <TextField
                label="Firmen E-Mail "
                variant="outlined"
                required
                fullWidth
                value={companyMail}
                onChange={(e) => setCompanyMail(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { fontSize: "1rem" }, 
                  "& .MuiInputLabel-root": { fontSize: "1rem" } 
                }}
              />

              {/* DIESE FELDER WERDEN BEIM LÖSCHEN (tabValue === 2) AUSGEBLENDET */}
              {tabValue !== 2 && (
                <>
                  {/* Passwort */}
                  <TextField
                    label={tabValue === 0 ? "Initiales Passwort " : "Neues Passwort (optional)"}
                    variant="outlined"
                    type="password"
                    required={tabValue === 0}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": { fontSize: "1rem" },
                      "& .MuiInputLabel-root": { fontSize: "1rem" }
                    }}
                  />

                  {/* Arbeitgeber */}
                  <TextField
                    label={tabValue === 0 ? "Arbeitgeber " : "Arbeitgeber (optional)"}
                    variant="outlined"
                    required={tabValue === 0}
                    fullWidth
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": { fontSize: "1rem" },
                      "& .MuiInputLabel-root": { fontSize: "1rem" }
                    }}
                  />

                  {/* Arbeitsadresse */}
                  <TextField
                    label={tabValue === 0 ? "Arbeitsadresse " : "Arbeitsadresse (optional)"}
                    variant="outlined"
                    required={tabValue === 0}
                    fullWidth
                    value={workAddress}
                    onChange={(e) => setWorkAddress(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": { fontSize: "1rem" },
                      "& .MuiInputLabel-root": { fontSize: "1rem" }
                    }}
                  />

                  {/* Beschreibung */}
                  <TextField
                    label="Beschreibung (optional)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": { fontSize: "1rem" },
                      "& .MuiInputLabel-root": { fontSize: "1rem" }
                    }}
                  />
                </>
              )}

              {/* Warnhinweis beim Löschen */}
              {tabValue === 2 && (
                <Alert severity="warning" sx={{ borderRadius: '8px', mt: 1 }}>
                  Achtung: Beim Löschen wird der Kunde komplett aus der Datenbank entfernt!
                </Alert>
              )}

              {/* Dynamischer Aktions-Button */}
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 1, 
                  py: 1.4, 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  borderRadius: '8px',
                  bgcolor: tabValue === 2 ? '#d32f2f' : '#5a1835', 
                  '&:hover': { 
                    bgcolor: tabValue === 2 ? '#b71c1c' : '#421126' 
                  } 
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : tabValue === 0 ? (
                  "Kunde anlegen"
                ) : tabValue === 1 ? (
                  "Änderungen speichern"
                ) : (
                  "Kunde unwiderruflich löschen"
                )}
              </Button>

            </Box>
          </form>

        </Paper>
      </Container>

      {/* --- DER SICHERHEITS-DIALOG --- */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: { borderRadius: '12px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {tabValue === 1 ? "Kunden bearbeiten?" : "Kunden wirklich löschen?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {tabValue === 1 
              ? `Bist du dir sicher, dass du die Daten für die E-Mail "${companyMail}" aktualisieren möchtest?`
              : `Bist du dir sicher? Der Kunde "${companyMail}" wird dauerhaft gelöscht und kann sich nicht mehr anmelden. Das kann nicht rückgängig gemacht werden.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#666' }}>
            Abbrechen
          </Button>
          <Button 
            onClick={executeAction} 
            variant="contained" 
            sx={{ 
              bgcolor: tabValue === 2 ? '#d32f2f' : '#5a1835',
              '&:hover': { bgcolor: tabValue === 2 ? '#b71c1c' : '#421126' }
            }}
          >
            Ja, sicher
          </Button>
        </DialogActions>
      </Dialog>
    </ProtectedRoute>
  );
}