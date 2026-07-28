import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, companyMail, password, employer, workAddress, description } = req.body;

  const supabaseUrl = process.env.NEXT_PUBLIC_supaBase_public_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Environment variables missing' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const ADMIN_EMAIL = "office@krc-buchhaltung.at";

  // --- 1. KUNDE ANLEGEN ---
  if (action === 'create') {
    if (!companyMail || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind Pflichtfelder.' });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: companyMail,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    const { error: tableError } = await supabaseAdmin
      .from('USER')
      .insert([{ 
        company_mail: companyMail, 
        employer: employer, 
        work_address: workAddress,
        password: password,
        description: description
      }]);

    if (tableError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: "Fehler beim Speichern in der Tabelle: " + tableError.message });
    }

    return res.status(200).json({ message: 'Kunde erfolgreich angelegt!' });
  }

  // --- 2. KUNDE BEARBEITEN ---
  if (action === 'update') {
    if (!companyMail) {
      return res.status(400).json({ error: 'E-Mail ist erforderlich.' });
    }

    const updateData = {};
    if (employer) updateData.employer = employer;
    if (workAddress) updateData.work_address = workAddress;
    if (description !== undefined) updateData.description = description;

    if (password && password.trim() !== "") {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const targetUser = listData?.users.find(u => u.email === companyMail);
      
      if (targetUser) {
        await supabaseAdmin.auth.admin.updateUserById(targetUser.id, { password: password });
      }
      
      updateData.password = password;
    }

    // Tabellendaten aktualisieren UND MITZÄHLEN
    const { error: updateError, count } = await supabaseAdmin
      .from('USER')
      .update(updateData, { count: 'exact' }) // <-- Zählt mit, ob Zeilen gefunden wurden
      .eq('company_mail', companyMail);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Wenn 0 Zeilen aktualisiert wurden, existiert der Kunde nicht!
    if (count === 0) {
      return res.status(404).json({ error: 'Fehler: Ein Kunde mit dieser E-Mail-Adresse existiert nicht!' });
    }

    return res.status(200).json({ message: 'Kunde erfolgreich aktualisiert!' });
  }

  // --- 3. KUNDE VOLLSTÄNDIG LÖSCHEN ---
  if (action === 'delete') {
    if (!companyMail) {
      return res.status(400).json({ error: 'E-Mail ist erforderlich.' });
    }

    // Sicherheitsprüfung: Admin darf nicht gelöscht werden
    if (companyMail.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ error: 'Der Admin-Account kann hier nicht gelöscht werden!' });
    }

    // A) Aus der USER-Tabelle löschen UND MITZÄHLEN
    const { error: tableDeleteError, count } = await supabaseAdmin
      .from('USER')
      .delete({ count: 'exact' })
      .eq('company_mail', companyMail);

    if (tableDeleteError) {
      return res.status(400).json({ error: tableDeleteError.message });
    }

    if (count === 0) {
      return res.status(404).json({ error: 'Fehler: Dieser Kunde existiert nicht oder wurde bereits gelöscht!' });
    }

    // B) Aus Auth-System löschen
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      return res.status(400).json({ error: listError.message });
    }

    const targetUser = listData?.users.find(u => u.email === companyMail);

    if (targetUser) {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUser.id);
      if (authDeleteError) {
        return res.status(400).json({ error: authDeleteError.message });
      }
    }

    return res.status(200).json({ message: 'Kunde wurde gelöscht!' });
  }

  return res.status(400).json({ error: 'Ungültige Aktion.' });
}