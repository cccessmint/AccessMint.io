'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { polygon } from 'viem/chains';
import AccessMintDynamicMultiAbi from '@/lib/abis/AccessMintDynamicMulti.json';
import { ACCESS_MINT_DYNAMIC_MULTI_ADDRESS } from '@/lib/contractConfig';

export default function MintTicket() {
  const supabase = createClientComponentClient();
  const { address } = useAccount();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const { data: txHash, writeContract } = useWriteContract();
  const { isPending, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    async function fetchTickets() {
      const { data, error } = await supabase.from('ticket_types').select('*');
      if (!error && data) setTickets(data);
    }
    fetchTickets();
  }, [supabase]);

  const handleMint = async () => {
    if (!selectedTicket) return;
    const ticketTypeId = tickets.findIndex(t => t.id === selectedTicket.id) + 1; // važna konverzija indexa
    await writeContract({
      address: ACCESS_MINT_DYNAMIC_MULTI_ADDRESS,
      abi: AccessMintDynamicMultiAbi,
      functionName: 'mint',
      args: [BigInt(ticketTypeId)],
      value: BigInt(selectedTicket.price * 1e18),
      chainId: polygon.id,
    });
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl mb-4">Mint Ticket</h2>

      <div className="mb-3">
        <select
          className="border p-2 w-full"
          onChange={(e) => {
            const ticket = tickets.find(t => t.id === e.target.value);
            setSelectedTicket(ticket);
          }}
        >
          <option value="">Select Ticket Type</option>
          {tickets.map(t => (
            <option key={t.id} value={t.id}>
              {t.type_name} — {t.price} MATIC
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleMint}
        className="bg-green-600 text-white p-2 rounded w-full"
        disabled={!selectedTicket || isPending}
      >
        {isPending ? 'Minting...' : 'Mint Ticket'}
      </button>

      {isSuccess && <p className="mt-4 text-green-600">✅ Mint successful!</p>}
    </div>
  );
}

