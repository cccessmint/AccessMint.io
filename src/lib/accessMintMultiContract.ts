import { createPublicClient, createWalletClient, http } from 'viem';
import { polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import AccessMintDynamicMultiAbi from '@/lib/abis/AccessMintDynamicMulti.json';

// Tvoja produkcijska contract adresa:
export const ACCESS_MINT_MULTI_CONTRACT_ADDRESS = '0x453e51a953Fa5178bE4f043adf80409Bd3dCDDef';

// Client za čitanje:
export const publicClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL!),
});

// Client za pisanje:
export const walletClient = createWalletClient({
  chain: polygon,
  transport: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL!),
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
});

// Funkcija za poziv addTicketType()
export async function addTicketTypeOnChain({
  typeName,
  price,
  maxSupply,
  metadataURI
}: {
  typeName: string;
  price: number;
  maxSupply: number;
  metadataURI: string;
}) {
  const txHash = await walletClient.writeContract({
    address: ACCESS_MINT_MULTI_CONTRACT_ADDRESS,
    abi: AccessMintDynamicMultiAbi,
    functionName: 'addTicketType',
    args: [
      typeName,
      BigInt(price * 1e18), // konverzija MATIC → wei
      BigInt(maxSupply),
      metadataURI
    ]
  });

  console.log('✅ addTicketType() txHash:', txHash);
  return txHash;
}

