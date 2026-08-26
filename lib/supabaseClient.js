import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://hxuwqhztgurhbaxhvupb.supabase.co"; //process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = "sb_publishable_5c3mfxgWkF_XDzIqCWtKxw_JJgaxKPJ"; //process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
