'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useState, useEffect } from 'react';

export default function WalletConnect() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (isConnected && address && !synced) {
      saveWalletAddress(address);
    }
  }, [isConnected, address, synced]);

  const saveWalletAddress = async (walletAddress: string) => {
    await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
    setSynced(true);
  };

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="text-xl mb-4">Wallet Connection</h2>

      {isConnected ? (
        <div>
          <p className="mb-2">Connected: {address}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-600 text-white p-2 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect()}
          className="bg-green-600 text-white p-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

