'use client';

import { useWriteContract } from 'wagmi';
import { ACCESS_PASS_ADDRESS, ACCESS_PASS_ABI } from '@/lib/contractConfig';

const MintButton = () => {
  const { writeContract, isPending } = useWriteContract();

  const handleMint = () => {
    writeContract({
      address: ACCESS_PASS_ADDRESS as `0x${string}`,
      abi: ACCESS_PASS_ABI,
      functionName: 'mint',
    });
  };

  return (
    <button onClick={handleMint} disabled={isPending} className="btn btn-primary">
      {isPending ? 'Minting...' : 'Mint'}
    </button>
  );
};

export default MintButton;

