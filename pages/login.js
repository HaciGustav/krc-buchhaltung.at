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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: "16px", borderTop: "6px solid #5a1835" }}>
        
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          KRC Buchhaltung - Login
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, fontSize: "0.9rem" }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            <TextField
              label="E-Mail-Adresse"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />

            <TextField
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ 
                mt: 1, 
                py: 1.5, 
                fontWeight: "bold", 
                bgcolor: "#5a1835", 
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": { 
                  bgcolor: "#421126" 
                } 
              }}
            >
              Anmelden
            </Button>

          </Box>
        </form>

      </Paper>
    </Container>
  );
}