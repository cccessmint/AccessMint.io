import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { redirect } from 'next/navigation';

interface MintStat {
  id: string;
  name: string;
  total_mints: number;
  total_revenue: number;
}

interface Campaign {
  id: string;
  name: string;
  mint_price: number;
}

interface Mint {
  campaign_id: string;
}

export default async function AnalyticsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: campaigns, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, name, mint_price');

  if (campaignError) {
    return <div>Error loading campaigns: {campaignError.message}</div>;
  }

  const { data: mints, error: mintsError } = await supabase
    .from('mints')
    .select('campaign_id');

  if (mintsError) {
    return <div>Error loading mints: {mintsError.message}</div>;
  }

  const stats: MintStat[] = (campaigns as Campaign[]).map((c) => {
    const mintCount = (mints as Mint[]).filter(m => m.campaign_id === c.id).length;
    const revenue = mintCount * (c.mint_price || 0);
    return {
      id: c.id,
      name: c.name,
      total_mints: mintCount,
      total_revenue: revenue,
    };
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">Campaign Analytics</h1>

      {stats.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Campaign</th>
              <th className="p-2 border">Total Mints</th>
              <th className="p-2 border">Revenue (MATIC)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(stat => (
              <tr key={stat.id} className="border-b">
                <td className="p-2 border">{stat.name}</td>
                <td className="p-2 border">{stat.total_mints}</td>
                <td className="p-2 border">{stat.total_revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

