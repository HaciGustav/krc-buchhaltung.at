import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function AdminUbersicht() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const ADMIN_EMAIL = "office@krc-buchhaltung.at";

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    const verifyAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      const response = await fetch("/api/admin-get-users");
      const result = await response.json();
      if (!response.ok) {
        toast.error("Fehler beim Laden: " + result.error);
      } else {
        setUsers(result.users || []);
      }
    } catch (err) {
      console.log({ err });
      toast.error("Netzwerkfehler beim Laden der Kunden.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (email) => {
    setShowPasswords((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.company_mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.work_address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isAuthorized) return null;

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        {/* Navigation & Header Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin")}
            sx={{
              fontWeight: "bold",
              borderColor: "#5a1835",
              color: "#5a1835",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#421126",
                bgcolor: "rgba(90, 24, 53, 0.04)",
              },
            }}
          >
            Zurück zum Admin Panel
          </Button>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            sx={{
              fontWeight: "bold",
              bgcolor: "#5a1835",
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(90, 24, 53, 0.25)",
              "&:hover": { bgcolor: "#421126" },
            }}
          >
            Aktualisieren
          </Button>
        </Box>

        {/* Haupttitel-Box mit einheitlicher Akzentkante */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderTop: "6px solid #5a1835",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <div>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: "bold", color: "#1a1a1a" }}
              >
                Kunden Übersicht
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Alle registrierten Kunden, Zugangsdaten und Arbeitsstandorte auf
                einen Blick.
              </Typography>
            </div>
            <Chip
              label={`Aktive Kunden: ${users.length}`}
              sx={{
                fontSize: "1rem",
                py: 2.5,
                px: 1,
                fontWeight: "bold",
                bgcolor: "rgba(90, 24, 53, 0.08)",
                color: "#5a1835",
                borderRadius: "8px",
              }}
            />
          </Box>

          {/* Suchleiste */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Suche nach E-Mail, Firma oder Adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1.5 }} />
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />
          </Box>
        </Paper>

        {/* Kunden Karten Grid */}
        {isLoading ? (
          <Typography
            variant="h6"
            align="center"
            sx={{ mt: 8, color: "text.secondary" }}
          >
            Lade Kundendaten...
          </Typography>
        ) : filteredUsers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "16px" }}>
            <Typography variant="h6" color="text.secondary">
              Keine Kunden gefunden.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user, index) => {
              const isPasswordVisible =
                showPasswords[user.company_mail] || false;

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      border: "1px solid #eaeaea",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        borderColor: "#5a1835",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Arbeitgeber */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#5a1835",
                            mr: 2,
                            width: 42,
                            height: 42,
                          }}
                        >
                          <BusinessIcon />
                        </Avatar>
                        <div>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Arbeitgeber
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              lineHeight: 1.2,
                              color: "#222",
                            }}
                          >
                            {user.employer || "Nicht angegeben"}
                          </Typography>
                        </div>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* E-Mail */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <EmailIcon
                          sx={{ fontSize: "18px", color: "#666", mr: 1.5 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "500",
                            wordBreak: "break-all",
                            color: "#333",
                          }}
                        >
                          {user.company_mail}
                        </Typography>
                      </Box>

                      {/* Passwort mit Auge-Toggle */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                          bgcolor: "#f9f9f9",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <LockIcon
                            sx={{ fontSize: "18px", color: "#666", mr: 1.5 }}
                          />
                          <Typography
                            variant="body2"
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              color: "#444",
                            }}
                          >
                            {isPasswordVisible
                              ? user.password || "Kein Passwort"
                              : "••••••••"}
                          </Typography>
                        </div>
                        <IconButton
                          size="small"
                          onClick={() =>
                            togglePasswordVisibility(user.company_mail)
                          }
                          sx={{ color: "#5a1835" }}
                        >
                          {isPasswordVisible ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </Box>

                      {/* Arbeitsadresse */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <LocationOnIcon
                          sx={{
                            fontSize: "18px",
                            color: "#5a1835",
                            mr: 1.5,
                            alignSelf: "flex-start",
                            mt: 0.2,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {user.work_address || "Keine Adresse hinterlegt"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </ProtectedRoute>
  );
}
