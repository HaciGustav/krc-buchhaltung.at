import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Kein gültiger Token gefunden' });
  }

  const token = authHeader.split(' ')[1];

  const supabaseUrl = process.env.NEXT_PUBLIC_supaBase_public_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Environment variables missing' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // JWT-Token über Supabase Auth auf Serverseite verifizieren
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token' });
  }

  // Daten für den verifizierten User aus der USER-Tabelle holen
  const { data, error } = await supabaseAdmin
    .from('USER')
    .select('employer, work_address, company_mail')
    .eq('company_mail', user.email.toLowerCase())
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ user: data });
}