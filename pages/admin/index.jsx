import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import ProtectedRoute from "../../components/ProtectedRoute";
import { 
  Box, Typography, Container, Paper, TextField, 
  Button, Tabs, Tab, Alert, CircularProgress 
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

  // Formular-Felder
  const [companyMail, setCompanyMail] = useState("");
  const [password, setPassword] = useState("");
  const [employer, setEmployer] = useState("");
  const [workAddress, setWorkAddress] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
          workAddress
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Ein Fehler ist aufgetreten.");
      } else {
        toast.success(result.message || "Erfolgreich ausgeführt!");
        if (currentAction === 'create') {
          setCompanyMail("");
          setPassword("");
          setEmployer("");
          setWorkAddress("");
        }
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
      <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
        
        {/* Header & Stylischer Zur-Übersicht Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <div>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AdminPanelSettingsIcon sx={{ color: '#5a1835', fontSize: '36px' }} />
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Kunden verwalten (Eingeloggt als: <strong>office@krc-buchhaltung.at</strong>)
            </Typography>
          </div>

          {/* Neuer, edler Button im Stil der oberen Leiste */}
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
            p: 4, 
            borderRadius: '16px', 
            borderTop: '6px solid #5a1835',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
          }}
        >
          
          {/* Tabs (Anlegen / Bearbeiten / Löschen) im einheitlichen Design */}
          <Tabs 
            value={tabValue} 
            onChange={(e, newVal) => setTabValue(newVal)} 
            variant="fullWidth"
            sx={{ 
              mb: 4, 
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

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* E-Mail Feld */}
              <TextField
                label="Firmen E-Mail (Primary Key)*"
                type="email"
                value={companyMail}
                onChange={(e) => setCompanyMail(e.target.value)}
                required
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              {/* Passwort Feld (Nur bei Anlegen oder Bearbeiten) */}
              {tabValue !== 2 && (
                <TextField
                  label={tabValue === 0 ? "Initiales Passwort für den Kunden*" : "Neues Passwort (optional - leer lassen zum Beibehalten)"}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={tabValue === 0}
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              )}

              {/* Zusätzliche Felder (Nur bei Anlegen oder Bearbeiten) */}
              {tabValue !== 2 && (
                <>
                  <TextField
                    label="Arbeitgeber (Employer)*"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    required={tabValue === 0}
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />

                  <TextField
                    label="Arbeitsadresse (Work Address)*"
                    value={workAddress}
                    onChange={(e) => setWorkAddress(e.target.value)}
                    required={tabValue === 0}
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </>
              )}

              {/* Warnhinweis beim Löschen */}
              {tabValue === 2 && (
                <Alert severity="warning" sx={{ borderRadius: '8px' }}>
                  Achtung: Beim Löschen wird der Kunde sowohl aus der Authentifizierung (Login nicht mehr möglich) als auch komplett aus der Datenbank entfernt!
                </Alert>
              )}

              {/* Dynamischer Aktions-Button in einheitlicher Farbgebung */}
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  py: 1.6, 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  borderRadius: '8px',
                  bgcolor: tabValue === 2 ? '#d32f2f' : '#5a1835', // Rot nur ganz dezent beim Löschen, sonst eleganter KRC-Ton
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
    </ProtectedRoute>
  );
}