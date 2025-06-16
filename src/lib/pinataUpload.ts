import axios from 'axios';

export async function uploadMetadataToIPFS(metadata: any) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const res = await axios.post(url, metadata, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: process.env.PINATA_API_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
    },
  });

  const IpfsHash = res.data.IpfsHash;
  console.log('✅ Metadata pinned at IPFS hash:', IpfsHash);
  return `ipfs://${IpfsHash}`;
}

