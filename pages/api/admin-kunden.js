import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, companyMail, password, employer, workAddress } = req.body;

  const supabaseUrl = process.env.NEXT_PUBLIC_supaBase_public_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Environment variables missing' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // --- 1. KUNDE ANLEGEN ---
  if (action === 'create') {
    if (!companyMail || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind Pflichtfelder.' });
    }

    // A) Auth-User im System erstellen
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: companyMail,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // B) In USER-Tabelle eintragen (Mit den exakten Spaltennamen aus deinem Screenshot: company_mail und work_address)
    const { error: tableError } = await supabaseAdmin
      .from('USER')
      .insert([{ 
        company_mail: companyMail, 
        employer: employer, 
        work_address: workAddress 
      }]);

    if (tableError) {
      // Sicherheits-Cleanup: Wenn Tabelle fehlschlägt, Auth-User wieder löschen
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

    // Passwort im Auth-Bereich aktualisieren, falls eingegeben
    if (password && password.trim() !== "") {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const targetUser = listData?.users.find(u => u.email === companyMail);
      
      if (targetUser) {
        await supabaseAdmin.auth.admin.updateUserById(targetUser.id, { password: password });
      }
    }

    // Tabellendaten aktualisieren (Spaltennamen mit Unterstrich)
    const updateData = {};
    if (employer) updateData.employer = employer;
    if (workAddress) updateData.work_address = workAddress;

    const { error: updateError } = await supabaseAdmin
      .from('USER')
      .update(updateData)
      .eq('company_mail', companyMail);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({ message: 'Kunde erfolgreich aktualisiert!' });
  }

  // --- 3. KUNDE VOLLSTÄNDIG LÖSCHEN ---
  if (action === 'delete') {
    if (!companyMail) {
      return res.status(400).json({ error: 'E-Mail ist erforderlich.' });
    }

    // A) Aus Auth-System löschen
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

    // B) Aus der USER-Tabelle löschen (Spalte company_mail)
    const { error: tableDeleteError } = await supabaseAdmin
      .from('USER')
      .delete()
      .eq('company_mail', companyMail);

    if (tableDeleteError) {
      return res.status(400).json({ error: tableDeleteError.message });
    }

    return res.status(200).json({ message: 'Kunde wurde vollständig aus Auth und Datenbank gelöscht!' });
  }

  return res.status(400).json({ error: 'Ungültige Aktion.' });
}