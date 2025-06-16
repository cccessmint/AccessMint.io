'use client';

import { useAccount } from 'wagmi';
import { useWriteContract, useSimulateContract } from 'wagmi';
import { ACCESS_PASS_ABI } from '@/lib/contractConfig';

export function useMintFromCampaign(mintPrice: number, campaignId: string, campaignName: string, contractAddress: string) {
  const { address } = useAccount();
  const priceInWei = BigInt(Math.floor(mintPrice * 1e18));

  const { data: simData, error: simError } = useSimulateContract({
    address: contractAddress,
    abi: ACCESS_PASS_ABI,
    functionName: 'mint',
    value: priceInWei,
  });

  const { writeContract, isPending, isSuccess, error, data: txData } = useWriteContract();

  async function mint() {
    if (simError) {
      console.error(simError);
      return;
    }

    const result = await writeContract(simData?.request);

    // 1️⃣ Backend insert minta
    const mintRes = await fetch('/api/mints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaignId,
        wallet_address: address,
        tx_hash: result?.transactionHash,
      }),
    });

    const mintData = await mintRes.json();
    const mintId = mintData?.mint_id;

    // 2️⃣ Generiraj metadata na IPFS
    const metadataRes = await fetch('/api/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `AccessMint NFT - ${campaignName}`,
        description: 'Your NFT from AccessMint platform.',
        image: 'https://your-default-image-or-ipfs.jpg',
        attributes: [
          { trait_type: 'Campaign', value: campaignName },
          { trait_type: 'Minted At', value: new Date().toISOString() }
        ]
      }),
    });

    const metadata = await metadataRes.json();

    // 3️⃣ Update metadata_uri u mints tablici
    await fetch('/api/mints/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mint_id: mintId,
        metadata_uri: `ipfs://${metadata.ipfsHash}`,
      }),
    });
  }

  return { mint, isPending, isSuccess, error };
}

