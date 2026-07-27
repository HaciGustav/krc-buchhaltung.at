import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useFormPrefill(setFormData) {
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // 1. Session mit JWT-Token abrufen
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.log("Keine aktive Session gefunden.");
          return;
        }

        const token = session.access_token;

        // 2. Daten über die API-Route abfragen und JWT-Token mitschicken
        const response = await fetch('/api/get-user-data', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Fehler beim Laden der Firmendaten:", result.error);
          return;
        }

        if (result.user) {
          setFormData((prev) => ({
            ...prev,
            employer: result.user.employer || "",        
            workAddress: result.user.work_address || "",
            email: result.user.company_mail || "",      
          }));
        }
      } catch (err) {
        console.error("Unerwarteter Fehler beim Formular-Prefill:", err);
      }
    };

    fetchCompanyData();
  }, [setFormData]);
}