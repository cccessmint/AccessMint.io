import AddTicketTypeForm from '@/components/AddTicketTypeForm';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import MintFromCampaign from '@/components/MintFromCampaign';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface Params {
  params: { id: string };
}

export default async function CampaignPage({ params }: Params) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !campaign) {
    return <div>Campaign not found.</div>;
  }

  return (
  <AddTicketTypeForm campaignId={campaign.id} />
    <div className="p-4">
      <h1 className="text-2xl mb-4">{campaign.name}</h1>
      <p className="mb-2">{campaign.description}</p>
      <p className="mb-2">Mint Price: {campaign.mint_price} MATIC</p>

      <MintFromCampaign mintPrice={campaign.mint_price} />

      <p className="mt-4">
        <Link
          href={`/admin/campaigns/${params.id}/mints`}
          className="text-blue-600 underline"
        >
          View Mint History
        </Link>
      </p>
    </div>
  );
}

