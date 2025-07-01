// src/app/mint/components/TicketList.tsx

"use client";

import { useEffect, useState } from "react";
import { resolveIpfsUri } from "@/utils/ipfs";
import Image from "next/image";

interface TicketType {
  id: string;
  name: string;
  price: number;
  max_supply: number;
  token_uri: string;
}

export default function TicketList() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/fetch-ticket-types");
        if (!res.ok) throw new Error("Failed to fetch ticket types");
        const data = await res.json();
        setTickets(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <div>Loading ticket types...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: TicketType }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(resolveIpfsUri(ticket.token_uri));
        if (!res.ok) throw new Error("Failed to fetch metadata");

        const metadata = await res.json();
        const image = resolveIpfsUri(metadata.image);
        setImageUrl(image);
      } catch {
        setImgError(true);
      }
    };

    fetchImage();
  }, [ticket.token_uri]);

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <div className="relative w-full h-48 mb-3">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={ticket.name}
            fill
            className="object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src="/placeholder.png"
            alt="Fallback"
            fill
            className="object-contain opacity-50"
          />
        )}
      </div>
      <h2 className="text-lg font-semibold">{ticket.name}</h2>
      <p className="text-sm text-gray-600">Price: {ticket.price} MATIC</p>
      <p className="text-sm text-gray-600">Max Supply: {ticket.max_supply}</p>
    </div>
  );
}

