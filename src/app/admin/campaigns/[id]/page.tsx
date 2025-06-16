import { createClient } from '@supabase/supabase-js';
import AddTicketTypeForm from '@/components/AddTicketTypeForm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function AdminCampaignPage({ params }: { params: { id: string } }) {
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!campaign) return <div>Campaign not found</div>;

  return (
    <>
      <AddTicketTypeForm campaignId={campaign.id} />
      <div className="p-4">
        <h1 className="text-2xl mb-4">{campaign.name}</h1>
        <p className="mb-2">{campaign.description}</p>
        <p className="mb-2">Mint Price: {campaign.mint_price} MATIC</p>
      </div>
    </>
  );
}

