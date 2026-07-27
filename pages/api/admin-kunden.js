import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_supaBase_public_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({ error: 'Environment variables missing' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { action, companyMail, password, employer, workAddress } = req.body;

    if (!companyMail) {
      return res.status(400).json({ error: 'Firmen E-Mail ist erforderlich.' });
    }

    const cleanEmail = companyMail.trim().toLowerCase();

    const findAuthUserByEmail = async (email) => {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      return users.find(u => u.email.toLowerCase() === email);
    };

    // --- 1. KUNDE ANLEGEN ---
    if (action === 'create') {
      if (!password) {
        return res.status(400).json({ error: 'Passwort ist beim Anlegen erforderlich.' });
      }

      const { error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true 
      });

      if (authError) return res.status(400).json({ error: authError.message });

      // In USER Tabelle speichern (inklusive Passwort für die Übersicht)
      const { error: dbError } = await supabaseAdmin.from('USER').insert([
        { 
          company_mail: cleanEmail, 
          employer: employer || '', 
          work_address: workAddress || '',
          password: password 
        }
      ]);

      if (dbError) return res.status(400).json({ error: dbError.message });

      return res.status(200).json({ message: 'Kunde erfolgreich angelegt!' });
    }

    // --- 2. KUNDE BEARBEITEN (UPDATE) ---
    if (action === 'update') {
      const updateData = {};
      if (employer !== undefined && employer !== '') updateData.employer = employer;
      if (workAddress !== undefined && workAddress !== '') updateData.work_address = workAddress;

      if (password && password.trim() !== '') {
        updateData.password = password; // Passwort auch in der Tabelle aktualisieren
        const user = await findAuthUserByEmail(cleanEmail);
        if (user) {
          await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
        }
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from('USER')
          .update(updateData)
          .eq('company_mail', cleanEmail);

        if (updateError) return res.status(400).json({ error: updateError.message });
      }

      return res.status(200).json({ message: 'Kunde erfolgreich geupdatet!' });
    }

    // --- 3. KUNDE LÖSCHEN (DELETE) ---
    if (action === 'delete') {
      const user = await findAuthUserByEmail(cleanEmail);
      if (user) {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
      }

      const { error: delDbError } = await supabaseAdmin
        .from('USER')
        .delete()
        .eq('company_mail', cleanEmail);

      if (delDbError) return res.status(400).json({ error: delDbError.message });

      return res.status(200).json({ message: 'Kunde erfolgreich gelöscht!' });
    }

    return res.status(400).json({ error: 'Unbekannte Aktion' });

  } catch (error) {
    return res.status(500).json({ error: 'Server-Fehler: ' + error.message });
  }
}