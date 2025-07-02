// src/components/MintButton.tsx

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { writeContract } from "@wagmi/core";

export default function MintButton() {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const mint = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet before minting.");
      return;
    }

    setLoading(true);
    try {
      // Ovdje dodaj logiku za mintanje, npr.:
      // const result = await writeContract({ ... });
      console.log("Minting NFT for address:", address);
      alert("Minting initiated.");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={mint}
      disabled={loading}
      className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? "Minting..." : "Mint NFT"}
    </button>
  );
}

