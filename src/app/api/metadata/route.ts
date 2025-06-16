import pinata from '@/lib/pinataClient';

export async function POST(req: Request) {
  const { name, description, image, attributes } = await req.json();

  const metadata = {
    name,
    description,
    image,
    attributes,
  };

  try {
    const result = await pinata.pinJSONToIPFS(metadata);
    const ipfsHash = result.IpfsHash;

    return new Response(
      JSON.stringify({ success: true, ipfsHash, uri: `ipfs://${ipfsHash}` }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

