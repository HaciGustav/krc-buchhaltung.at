import { supabaseUrl } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  //const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Environment variables missing" });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // Alle Kunden aus der USER-Tabelle abrufen
  const { data, error } = await supabaseAdmin.from("USER").select("*");
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ users: data });
}
