'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletConnect() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  return (
    <div className="p-4 border rounded">
      {isConnected ? (
        <>
          <p className="mb-2">👛 Wallet: {address}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            🔌 Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={() => connect({ connector: injected() })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          🔐 Connect Wallet
        </button>
      )}
    </div>
  );
}

