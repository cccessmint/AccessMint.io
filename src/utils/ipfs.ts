// src/utils/ipfs.ts

/**
 * Converts an IPFS URI (e.g. ipfs://CID/path) into a full HTTP URL using Pinata gateway.
 * Falls back to raw CID if the URI is malformed.
 */
export function resolveIpfsUri(ipfsUri: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

  if (!gateway) {
    console.warn("Pinata gateway is not defined in environment variables.");
    return ipfsUri;
  }

  if (ipfsUri.startsWith("ipfs://")) {
    const stripped = ipfsUri.replace("ipfs://", "");
    return `${gateway}/${stripped}`;
  }

  return ipfsUri;
}

