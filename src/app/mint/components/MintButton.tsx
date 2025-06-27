'use client';

import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { useState } from 'react';
import { createClient } from '../../../lib/supabaseClient';
import abi from '../../../abi/AccessMintDynamicMulti.json';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../../../lib/wagmiClient';

export default function MintButton({
  ticketType,
  disabled,
}: {
  ticketType: {
    id: string;
    price: number;
    metadata_uri: string;
    campaign_id: string;
  };
  disabled?: boolean;
}) {
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleMint = async () => {
    setLoading(true);
    try {
      const txHash = await writeContractAsync({
        abi,
        address: '0xC33d351C12322a8762739D49E3E9b6a40590B001',
        functionName: 'mint',
        args: [BigInt(ticketType.id)],
        value: parseEther(ticketType.price.toString()),
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });

      const wallet = receipt.from;
      const tokenId = BigInt(receipt.logs[0].topics[3]).toString();

      await supabase.from('mints').insert({
        campaign_id: ticketType.campaign_id,
        ticket_type_id: ticketType.id,
        uri: ticketType.metadata_uri,
        wallet,
        token_id: tokenId,
        tx: txHash,
      });
    } catch (err) {
      console.error('Mint failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading || disabled}
      onClick={handleMint}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Mintanje...' : 'Mintaj'}
    </button>
  );
}

