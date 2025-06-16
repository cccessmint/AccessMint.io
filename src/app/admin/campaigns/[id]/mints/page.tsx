import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { redirect } from 'next/navigation';

interface Params {
  params: { id: string };
}

export default async function CampaignMintsPage({ params }: Params) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: mints, error } = await supabase
    .from('mints')
    .select('*')
    .eq('campaign_id', params.id)
    .order('minted_at', { ascending: false });

  if (error) {
    return <div>Error loading mints: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">Mint History (with Metadata)</h1>

      {mints.length === 0 ? (
        <p>No mints for this campaign yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Wallet Address</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Tx Hash</th>
              <th className="p-2 border">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {mints.map((mint: any) => (
              <tr key={mint.id} className="border-b">
                <td className="p-2 border">{mint.wallet_address}</td>
                <td className="p-2 border">{new Date(mint.minted_at).toLocaleString()}</td>
                <td className="p-2 border">
                  <a
                    href={`https://polygonscan.com/tx/${mint.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Tx
                  </a>
                </td>
                <td className="p-2 border">
                  {mint.metadata_uri ? (
                    <div className="flex flex-col">
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${mint.metadata_uri.replace('ipfs://', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        IPFS Metadata
                      </a>
                      <a
                        href={`https://opensea.io/assets/matic/${mint.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline"
                      >
                        View on OpenSea
                      </a>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

