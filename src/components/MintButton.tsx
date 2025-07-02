// src/components/MintButton.tsx

"use client";

import { parseAbi } from "viem";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { writeContract } from "@wagmi/core";
import { createClient } from "@supabase/supabase-js";

const contractAddress = "0x453e51a953Fa5178bE4f043adf80409Bd3dCDDef";

const contractAbi = parseAbi([
  "function mint() payable"
]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TicketType = {
  id: string;
  name: string;
  metadata_uri: string;
  price: number;
};

export default function MintButton() {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from("ticket_types")
        .select("id, name, metadata_uri, price")
        .eq("is_active", true);

      if (error) {
        console.error("Failed to fetch ticket types:", error);
      } else {
        setTicketTypes(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      }
    };

    fetchTypes();
  }, []);

  const mint = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet before minting.");
      return;
    }

    const selected = ticketTypes.find((t) => t.id === selectedId);
    if (!selected) {
      alert("Please select a ticket type.");
      return;
    }

    if (typeof selected.price !== "number") {
      alert("Ticket type data is incomplete.");
      return;
    }

    const valueInWei = BigInt(Math.round(selected.price * 1e18));

    console.log("Selected:", selected);
    console.log("value (wei):", valueInWei.toString());

    setLoading(true);
    try {
      const tx = await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "mint",
        value: valueInWei,
      });

      console.log("✅ Transaction sent:", tx.hash);
      alert("Minting transaction sent!");
    } catch (error) {
      console.error("❌ Minting failed:", error);
      alert("Minting failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <select
        onChange={(e) => {
          const id = e.target.value;
          if (id) setSelectedId(id);
        }}
        className="border border-gray-300 rounded p-2 w-full"
        value={selectedId ?? ""}
      >
        {ticketTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name} – {type.price} MATIC
          </option>
        ))}
      </select>

      <button
        onClick={mint}
        disabled={loading || selectedId === null}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}

