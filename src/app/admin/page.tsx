import AdminCreateCampaignForm from '@/components/AdminCreateCampaignForm';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import CreateCampaignForm from '@/components/CreateCampaignForm';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Dohvat kampanja:
  const { data: campaigns = [] } = await supabaseAdmin.from('campaigns').select('*');

  return (
  <AdminCreateCampaignForm />
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <CreateCampaignForm />

      <h2 className="text-lg mb-2">Existing Campaigns:</h2>
      <ul>
        {campaigns.map(c => (
          <li key={c.id} className="border p-2 mb-2">
            <strong>{c.name}</strong> — {c.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

