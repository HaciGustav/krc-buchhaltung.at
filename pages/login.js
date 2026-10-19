import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      // Leite je nach Rolle oder zur Admin-/Anmeldeseite weiter
      if (email.toLowerCase() === "office@krc-buchhaltung.at") {
        router.push("/admin");
      } else {
        router.push("/anmeldung");
      }
    }
  };

  return (
    <Container maxWidth="xs" disableGutters sx={{ mt: { xs: 2, md: "12vh" } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "8px", border: "1px solid var(--border)" }}>
        
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontSize: 24, fontWeight: 500, mb: 3 }}>
          KRC Buchhaltung - Login
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, fontSize: "0.9rem" }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            
            <TextField
              label="E-Mail-Adresse"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ mt: 1 }}
            >
              Anmelden
            </Button>

          </Box>
        </form>

      </Paper>
    </Container>
  );
}