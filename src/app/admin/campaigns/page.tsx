import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/getUserRole';

export default async function CampaignsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const role = await getUserRole(user.id);

  const query = supabase.from('campaigns').select(
    'id, name, contract_address, mint_price, max_supply, created_at, deploy_status, created_by'
  ).order('created_at', { ascending: false });

  if (role !== 'superadmin') {
    query.eq('created_by', user.id);
  }

  const { data: campaigns, error } = await query;

  if (error) {
    return <div>Error loading campaigns: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">Deployed Campaigns ({role})</h1>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Contract</th>
              <th className="p-2 border">Price (MATIC)</th>
              <th className="p-2 border">Max Supply</th>
              <th className="p-2 border">Deploy Status</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c: any) => (
              <tr key={c.id} className="border-b">
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">
                  <a href={`https://polygonscan.com/address/${c.contract_address}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {c.contract_address.slice(0, 6)}...{c.contract_address.slice(-4)}
                  </a>
                </td>
                <td className="p-2 border">{c.mint_price}</td>
                <td className="p-2 border">{c.max_supply}</td>
                <td className="p-2 border">{c.deploy_status ?? 'pending'}</td>
                <td className="p-2 border">{c.created_by}</td>
                <td className="p-2 border">{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

