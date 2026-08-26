import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

//console.log("Supabase URL:", supabaseUrl);

// Das ist unser zentraler "Schlüssel", den wir in anderen Dateien nutzen
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
