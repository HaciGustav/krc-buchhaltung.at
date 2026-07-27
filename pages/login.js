import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg("Login fehlgeschlagen: " + error.message);
    } else {
      // --- HIER IST DIE WEICHE ---
      if (email === "office@krc-buchhaltung.at") {
        router.push("/admin"); // Admin geht direkt ins Admin-Panel
      } else {
        router.push("/anmeldung"); // Normaler User geht zur Anmeldung
      }
    }
  };

  // 1. ÄUSSERER CONTAINER: Jetzt strikt ohne Scrollbalken und sauberes React
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "calc(100vh - 100px)", // Zieht den Header-Platz von der Bildschirmhöhe ab
      backgroundColor: "#f4f6f8", 
      padding: "20px",
      boxSizing: "border-box", // Verhindert, dass das Padding zur Höhe addiert wird
      overflow: "hidden" // Blockiert jegliches Scrollverhalten
    }}>
      
      {/* 2. DIE LOGIN-KARTE: Das "Accent Border Card" Design */}
      <div style={{ 
        width: "100%",
        maxWidth: "400px", 
        padding: "40px 30px", 
        fontFamily: "sans-serif",
        backgroundColor: "#fff", 
        borderRadius: "16px", 
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)", 
        borderTop: "6px solid #5a1835" 
      }}>
        <h2 style={{ marginTop: 0, textAlign: "center", color: "#1a1a1a", marginBottom: "30px" }}>
          KRC Login
        </h2>
        
        {errorMsg && (
          <div style={{ 
            color: "#721c24", 
            backgroundColor: "#f8d7da", 
            padding: "10px", 
            borderRadius: "6px", 
            marginBottom: "20px",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* E-MAIL FELD */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600", color: "#444" }}>
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                borderRadius: "8px", 
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                fontSize: "1rem",
                outlineColor: "#5a1835" 
              }}
            />
          </div>

          {/* PASSWORT FELD */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600", color: "#444" }}>
              Passwort *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                borderRadius: "8px", 
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                fontSize: "1rem",
                outlineColor: "#5a1835" 
              }}
            />
          </div>

          {/* ANMELDE-BUTTON */}
          <button 
            type="submit" 
            style={{ 
              width: "100%", 
              padding: "14px", 
              backgroundColor: "#5a1835", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.05rem",
              boxShadow: "0 4px 14px rgba(90, 24, 53, 0.4)", 
              transition: "transform 0.1s ease-in-out",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"} 
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}