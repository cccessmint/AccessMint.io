'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MintTicket from '@/components/MintTicket';

export default function MintPage() {
  const supabase = createClientComponentClient();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      const { data, error } = await supabase.from('campaigns').select('*');
      if (!error && data) setCampaigns(data);
    }
    fetchCampaigns();
  }, [supabase]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Available Campaigns for Mint</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns?.map((campaign) => (
          <div key={campaign.id} className="border rounded p-4 shadow">
            <h3 className="text-lg mb-2">{campaign.name}</h3>
            <MintTicket />
          </div>
        ))}
      </div>
    </div>
  );
}

