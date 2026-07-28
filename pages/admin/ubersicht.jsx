import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import ProtectedRoute from "../../components/ProtectedRoute";
import { 
  Box, Typography, Container, Paper, Grid, TextField, 
  Button, Card, CardContent, Avatar, Chip, Divider, IconButton,
  Menu, MenuItem, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, CircularProgress 
} from "@mui/material";
import { toast } from "react-toastify";
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/Notes';

export default function AdminUbersicht() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const ADMIN_EMAIL = "office@krc-buchhaltung.at"; 

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [showPasswords, setShowPasswords] = useState({});

  // 3-Punkte-Menü und Modal States
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    companyMail: "",
    employer: "",
    workAddress: "",
    password: "",
    description: ""
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace("/login");
        return;
      }
      setIsAuthorized(true);
      fetchUsers();
    };
    verifyAdmin();
  }, [router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin-get-users');
      const result = await response.json();
      if (!response.ok) {
        toast.error("Fehler beim Laden: " + result.error);
      } else {
        setUsers(result.users || []);
      }
    } catch (err) {
      toast.error("Netzwerkfehler beim Laden der Kunden.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (email) => {
    setShowPasswords(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setActiveCustomer(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStartEdit = () => {
    if (!activeCustomer) return;
    setEditForm({
      companyMail: activeCustomer.company_mail || "",
      employer: activeCustomer.employer || "",
      workAddress: activeCustomer.work_address || "",
      password: "",
      description: activeCustomer.description || ""
    });
    setEditOpen(true);
    handleMenuClose();
  };

  const handleStartDelete = () => {
    if (activeCustomer?.company_mail === ADMIN_EMAIL) {
      toast.error("Der Admin-Account kann hier nicht gelöscht werden!");
      handleMenuClose();
      return;
    }
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin-kunden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          companyMail: editForm.companyMail,
          employer: editForm.employer,
          workAddress: editForm.workAddress,
          password: editForm.password,
          description: editForm.description
        })
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Fehler beim Aktualisieren.");
      } else {
        toast.success("Kunde erfolgreich aktualisiert!");
        setEditOpen(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error("Fehler: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeCustomer) return;
    
    if (activeCustomer.company_mail === ADMIN_EMAIL) {
      toast.error("Der Admin-Account kann nicht gelöscht werden!");
      setDeleteOpen(false);
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin-kunden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          companyMail: activeCustomer.company_mail
        })
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Fehler beim Löschen.");
      } else {
        toast.success("Kunde wurde komplett gelöscht!");
        setDeleteOpen(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error("Fehler: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtern und Admin immer ganz nach oben sortieren
  const filteredUsers = users
    .filter(user => {
      if (!user) return false;
      const q = searchTerm.toLowerCase();
      const mail = (user.company_mail || "").toLowerCase();
      const emp = (user.employer || "").toLowerCase();
      const addr = (user.work_address || "").toLowerCase();
      const desc = (user.description || "").toLowerCase();
      
      return mail.includes(q) || emp.includes(q) || addr.includes(q) || desc.includes(q);
    })
    .sort((a, b) => {
      if (a.company_mail === ADMIN_EMAIL) return -1;
      if (b.company_mail === ADMIN_EMAIL) return 1;
      return 0;
    });

  if (!isAuthorized) return null;

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        
        {/* Navigation & Header Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin')}
            sx={{ 
              fontWeight: 'bold', 
              borderColor: '#5a1835', 
              color: '#5a1835', 
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { borderColor: '#421126', bgcolor: 'rgba(90, 24, 53, 0.04)' } 
            }}
          >
            Zurück zum Admin Panel
          </Button>

          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            sx={{ 
              fontWeight: 'bold', 
              bgcolor: '#5a1835', 
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(90, 24, 53, 0.25)',
              '&:hover': { bgcolor: '#421126' } 
            }}
          >
            Aktualisieren
          </Button>
        </Box>

        {/* Haupttitel-Box */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderTop: '6px solid #5a1835', 
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <div>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                Kunden Übersicht
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Alle registrierten Kunden, Zugangsdaten und Arbeitsstandorte auf einen Blick.
              </Typography>
            </div>
            <Chip 
              label={`Aktive Kunden: ${users.length}`} 
              sx={{ 
                fontSize: '1rem', 
                py: 2.5, 
                px: 1, 
                fontWeight: 'bold', 
                bgcolor: 'rgba(90, 24, 53, 0.08)', 
                color: '#5a1835', 
                borderRadius: '8px' 
              }} 
            />
          </Box>

          {/* Suchleiste */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Suche nach E-Mail, Firma, Adresse oder Notiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1.5 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        </Paper>

        {/* Kunden Karten Grid */}
        {isLoading ? (
          <Typography variant="h6" align="center" sx={{ mt: 8, color: 'text.secondary' }}>
            Lade Kundendaten...
          </Typography>
        ) : filteredUsers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
            <Typography variant="h6" color="text.secondary">
              Keine Kunden gefunden.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user, index) => {
              const isPasswordVisible = showPasswords[user.company_mail] || false;
              const isAdminCard = user.company_mail === ADMIN_EMAIL;

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    elevation={isAdminCard ? 4 : 2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '1px solid #eaeaea',
                      borderTop: isAdminCard ? '6px solid #5a1835' : '1px solid #eaeaea',
                      transition: 'all 0.2s ease-in-out',
                      position: 'relative',
                      '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', borderColor: '#5a1835' }
                    }}
                  >
                    
                    {/* 3-Punkte-Button oben rechts */}
                    <IconButton 
                      onClick={(e) => handleMenuOpen(e, user)}
                      sx={{ position: 'absolute', top: 12, right: 12, color: '#666' }}
                    >
                      <MoreVertIcon />
                    </IconButton>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      
                      {/* Arbeitgeber */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pr: 4 }}>
                        <Avatar sx={{ bgcolor: '#5a1835', mr: 2, width: 42, height: 42 }}>
                          <BusinessIcon />
                        </Avatar>
                        <div>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {isAdminCard ? "Administrator" : "Arbeitgeber"}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: '#222' }}>
                            {user.employer || "Nicht angegeben"}
                          </Typography>
                        </div>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* E-Mail */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <EmailIcon sx={{ fontSize: '18px', color: '#666', mr: 1.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: '500', wordBreak: 'break-all', color: '#333' }}>
                          {user.company_mail}
                        </Typography>
                      </Box>

                      {/* Passwort mit Auge-Toggle */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, bgcolor: '#f9f9f9', px: 1.5, py: 0.5, borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                          <LockIcon sx={{ fontSize: '18px', color: '#666', mr: 1.5 }} />
                          <Typography variant="body2" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#444' }}>
                            {isPasswordVisible ? (user.password || "Kein Passwort") : "••••••••"}
                          </Typography>
                        </div>
                        <IconButton 
                          size="small" 
                          onClick={() => togglePasswordVisibility(user.company_mail)}
                          sx={{ color: '#5a1835' }}
                        >
                          {isPasswordVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </Box>

                      {/* Arbeitsadresse */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOnIcon sx={{ fontSize: '18px', color: '#5a1835', mr: 1.5, alignSelf: 'flex-start', mt: 0.2 }} />
                        <Typography variant="body2" color="text.secondary">
                          {user.work_address || "Keine Adresse hinterlegt"}
                        </Typography>
                      </Box>

                      {/* Beschreibung anzeigen (nur wenn vorhanden) */}
                      {user.description && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2, pt: 1.5, borderTop: '1px dashed #eaeaea' }}>
                          <NotesIcon sx={{ fontSize: '18px', color: '#888', mr: 1.5, mt: 0.2 }} />
                          <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                            {user.description}
                          </Typography>
                        </Box>
                      )}

                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* 3-Punkte Dropdown-Menü (Löschen wird beim Admin ausgeblendet!) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}
        >
          <MenuItem onClick={handleStartEdit} sx={{ gap: 1.5, py: 1, px: 2 }}>
            <EditIcon fontSize="small" sx={{ color: '#5a1835' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Bearbeiten</Typography>
          </MenuItem>
          
          {activeCustomer?.company_mail !== ADMIN_EMAIL && (
            <MenuItem onClick={handleStartDelete} sx={{ gap: 1.5, py: 1, px: 2, color: '#d32f2f' }}>
              <DeleteIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Löschen</Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Modal zum Bearbeiten */}
        <Dialog 
          open={editOpen} 
          onClose={() => setEditOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', color: '#5a1835' }}>
            Kunde bearbeiten
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Firmen E-Mail"
                disabled
                fullWidth
                value={editForm.companyMail}
              />
              <TextField
                label="Arbeitgeber"
                fullWidth
                value={editForm.employer}
                onChange={(e) => setEditForm({ ...editForm, employer: e.target.value })}
              />
              <TextField
                label="Arbeitsadresse"
                fullWidth
                value={editForm.workAddress}
                onChange={(e) => setEditForm({ ...editForm, workAddress: e.target.value })}
              />
              <TextField
                label="Neues Passwort (optional)"
                type="password"
                fullWidth
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
              <TextField
                label="Beschreibung (optional)"
                fullWidth
                size="small"
                multiline
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditOpen(false)} sx={{ color: '#666' }}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained"
              disabled={actionLoading}
              sx={{ bgcolor: '#5a1835', '&:hover': { bgcolor: '#421126' } }}
            >
              {actionLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : "Speichern"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal zum Löschen */}
        <Dialog 
          open={deleteOpen} 
          onClose={() => setDeleteOpen(false)}
          PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
            Kunden wirklich löschen?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Möchtest du den Kunden <strong>{activeCustomer?.company_mail}</strong> wirklich unwiderruflich aus der Datenbank und Authentifizierung entfernen?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDeleteOpen(false)} sx={{ color: '#666' }}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              variant="contained"
              disabled={actionLoading}
              sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
            >
              {actionLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : "Ja, löschen"}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </ProtectedRoute>
  );
}