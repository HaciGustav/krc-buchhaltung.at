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

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>KRC Buchhaltung - Login</h2>
      
      {errorMsg && <div style={{ color: "red", marginBottom: "15px" }}>{errorMsg}</div>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>E-Mail-Adresse</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: "100%", padding: "10px", backgroundColor: "#e10000", color: "white", border: "none", cursor: "pointer" }}
        >
          Anmelden
        </button>
      </form>
    </div>
  );
}