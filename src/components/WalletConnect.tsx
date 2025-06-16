'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletConnect() {
  const { connect } = useConnect({
    connector: injected(),
  });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => connect()} className="px-4 py-2 bg-blue-500 text-white rounded">
      Connect Wallet
    </button>
  );
}

