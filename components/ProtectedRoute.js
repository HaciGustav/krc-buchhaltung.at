import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Session prüfen beim Laden
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    };
    checkAuth();

    // 2. 10 Minuten Inaktivitäts-Timer (10 Min * 60 Sek * 1000 Ms = 600.000 ms)
    let timeoutId;

    const logoutUser = async () => {
      await supabase.auth.signOut();
      router.replace("/login?timeout=true");
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutUser, 10 * 60 * 1000);
    };

    // User-Aktivitäten, die den Timer zurücksetzen
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Timer initial starten
    resetTimer();

    // Cleanup beim Verlassen der Seite
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [router]);

  if (!authorized) {
    return null;
  }

  return children;
}