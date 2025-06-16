import axios from 'axios';
import FormData from 'form-data';

// Upload slike na IPFS
export async function uploadImageToIPFS(buffer: Buffer, fileName: string) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append('file', buffer, fileName);

  const res = await axios.post(url, formData, {
    maxContentLength: Infinity,
    headers: {
      ...formData.getHeaders(),
      pinata_api_key: process.env.PINATA_API_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
    },
  });

  const IpfsHash = res.data.IpfsHash;
  console.log('✅ Image pinned at IPFS hash:', IpfsHash);
  return `ipfs://${IpfsHash}`;
}

// Upload PDF na IPFS (FAZA 8 - KORAK 3)
export async function uploadPdfToIPFS(buffer: Buffer, fileName: string) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append('file', buffer, fileName);

  const res = await axios.post(url, formData, {
    maxContentLength: Infinity,
    headers: {
      ...formData.getHeaders(),
      pinata_api_key: process.env.PINATA_API_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
    },
  });

  const IpfsHash = res.data.IpfsHash;
  console.log('✅ PDF pinned at IPFS hash:', IpfsHash);
  return `ipfs://${IpfsHash}`;
}

