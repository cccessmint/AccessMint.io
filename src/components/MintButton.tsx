"use client";

import { useState } from "react";
import { parseEther } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi, contractAddress } from "@/contractConfig";
import { saveMint } from "@/lib/supabase/api";
import { useToast } from "@/components/ui/use-toast";
import { TicketType } from "@/types";

export default function MintButton({
  selectedTicketType,
}: {
  selectedTicketType: TicketType | null;
}) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    onSuccess: async (receipt) => {
      toast({
        title: "✅ Mint successful!",
        description: `Tx hash: ${receipt.transactionHash}`,
      });

      if (address && selectedTicketType) {
        try {
          await saveMint({
            wallet: address,
            campaign_id: selectedTicketType.campaign_id,
            token_id: 0, // Optional: update if real token_id is available
            uri: selectedTicketType.metadata_uri,
            tx: receipt.transactionHash,
          });
        } catch (err) {
          console.error("⚠️ Failed to save mint in DB:", err);
          toast({
            title: "⚠️ Mint saved, but DB insert failed",
            description: "Check console for error details.",
          });
        }
      }

      setIsLoading(false);
    },
  });

  const mint = async () => {
    if (!selectedTicketType) {
      toast({ title: "⚠️ Please select a ticket type." });
      return;
    }

    if (!address) {
      toast({ title: "❌ Wallet not connected." });
      return;
    }

    try {
      const valueInWei = parseEther(selectedTicketType.price.toString());
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "mint",
        value: valueInWei,
      });

      setHash(txHash);
      setIsLoading(true);
    } catch (err: any) {
      console.error("❌ Mint error:", err);
      toast({
        title: "❌ Mint failed",
        description: err.message || "Unknown error",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <button
        onClick={mint}
        disabled={isLoading || isConfirming}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading || isConfirming ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}

