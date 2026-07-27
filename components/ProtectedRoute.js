import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import LogoutButton from "./LogoutButton";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserClaims = async () => {
      try {
        const { data, error } = await supabase.auth.getClaims();
        console.log("Türsteher-Check:", { data, error });

        if (error || !data) {
          console.log("Zutritt verweigert!");
          
          // DIE RETTUNG: Nur umleiten, wenn wir NICHT schon auf /login sind!
          if (router.pathname !== "/login") {
            router.push("/login");
          } else {
            // Wir sind schon auf /login, also lass die Seite laden
            setLoading(false); 
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Fehler im Türsteher:", err);
        
        // Auch beim Catch-Fehler die Endlosschleife verhindern
        if (router.pathname !== "/login") {
          router.push("/login");
        } else {
          setLoading(false);
        }
      }
    };

    checkUserClaims();
  }, [router.pathname]); // <-- Hier router.pathname reinpacken

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        Prüfe Berechtigung...
      </div>
    );
  }

  // Wenn wir auf der Login-Seite sind, zeige NUR den Inhalt (ohne Logout-Button)
  if (router.pathname === "/login") {
    return <>{children}</>;
  }

  // Wenn wir eingeloggt sind (auf /aenderung etc.), render den Inhalt PLUS den Button
  return (
    <>
      {children}
      <LogoutButton />
    </>
  );
}