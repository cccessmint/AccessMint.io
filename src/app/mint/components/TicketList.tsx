'use client';

import React, { useEffect, useState } from 'react';
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type TicketType = Database['public']['Tables']['ticket_types']['Row'];

interface TicketWithMeta extends TicketType {
  name?: string;
  description?: string;
  image?: string;
}

export default function TicketList({ campaignId }: { campaignId: string }) {
  const [tickets, setTickets] = useState<TicketWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const gateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY ||
    'https://gateway.pinata.cloud/ipfs/';

  useEffect(() => {
    async function fetchTickets() {
      const supabase = createClientComponentClient<Database>();

      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('campaign_id', campaignId);

      if (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
        return;
      }

      const enriched = await Promise.all(
        data.map(async (ticket) => {
          if (!ticket.metadata_uri) return ticket;

          try {
            const metadataUrl = `${gateway}${ticket.metadata_uri}`;
            const res = await fetch(metadataUrl);
            const json = await res.json();

            return {
              ...ticket,
              name: json.name,
              description: json.description,
              image: json.image?.startsWith('ipfs://')
                ? `${gateway}${json.image.replace('ipfs://', '')}`
                : json.image,
            };
          } catch (err) {
            console.error(
              `Error loading metadata for ticket ${ticket.id}`,
              err
            );
            return ticket;
          }
        })
      );

      setTickets(enriched);
      setLoading(false);
    }

    fetchTickets();
  }, [campaignId, gateway]);

  if (loading) return <p>Loading...</p>;
  if (!tickets.length) return <p>Nema dostupnih karata za mintanje.</p>;

  return (
    <div>
      <h1>AccessMint</h1>
      <h2>Dostupne karte za mintanje</h2>
      {tickets.map((ticket) => (
        <div key={ticket.id} style={{ marginBottom: '2rem' }}>
          <h3>{ticket.name || 'Nepoznata karta'}</h3>
          <p>{ticket.description}</p>
          <p>
            Price: {ticket.price} MATIC
            <br />
            Minted: {ticket.minted_count} / {ticket.max_supply}
          </p>
          {ticket.image ? (
            <img
              src={ticket.image}
              alt={ticket.name || 'Karta'}
              style={{ maxWidth: '300px' }}
            />
          ) : (
            <em>Slika nije dostupna</em>
          )}
        </div>
      ))}
    </div>
  );
}

