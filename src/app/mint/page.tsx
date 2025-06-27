import TicketList from './components/TicketList';

export default function MintPage({
  searchParams,
}: {
  searchParams: { campaign?: string };
}) {
  const campaignId = searchParams.campaign;

  if (!campaignId) {
    return <div className="p-6">Nema kampanje odabrane.</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dostupne karte za mintanje</h1>
      <TicketList campaignId={campaignId} />
    </main>
  );
}

