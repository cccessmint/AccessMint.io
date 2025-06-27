'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useSimulateContract } from 'wagmi';
import { readContract } from 'viem/actions';
import ABI from '../abi/AccessMintDynamicMulti.json';
import { useSearchParams } from 'next/navigation';

const CONTRACT_ADDRESS = '0x453e51a953Fa5178bE4f043adf80409Bd3dCDDef';

export default function MintButton() {
  const { address } = useAccount();
  const [ticketTypeId, setTicketTypeId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const campaignId = searchParams.get('campaign');

  const {
    data: simulationResult,
    isError: isSimulationError,
    isPending: isSimulating,
    error: simulationError,
  } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'mint',
    args: ticketTypeId !== null ? [BigInt(ticketTypeId)] : undefined,
    query: {
      enabled: ticketTypeId !== null,
    },
  });

  const {
    writeContract,
    isPending,
    isSuccess,
    error: writeError,
  } = useWriteContract();

  const handleMint = async () => {
    if (!campaignId) {
      console.error('Campaign ID is missing in URL');
      return;
    }

    try {
      // Hardkodirani ticket type ID (prvi koji postoji)
      const ticketId = 0;

      console.debug('[DEBUG] Trying to mint ticket type ID:', ticketId);

      setTicketTypeId(ticketId);

      // Simulacija mintanja
      if (!simulationResult) {
        console.error('Simulation failed or not ready');
        return;
      }

      writeContract(simulationResult.request);
    } catch (error) {
      console.error('❌ Mint failed:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log('✅ Mint successful!');
    }
  }, [isSuccess]);

  return (
    <div className="mt-4">
      <button
        onClick={handleMint}
        disabled={isPending || isSimulating || ticketTypeId === null}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending || isSimulating ? 'Minting...' : 'Mint Ticket'}
      </button>
      {writeError && (
        <p className="text-red-500 mt-2">Error: {writeError.message}</p>
      )}
      {isSimulationError && simulationError && (
        <p className="text-red-500 mt-2">
          Simulation Error: {simulationError.message}
        </p>
      )}
    </div>
  );
}

