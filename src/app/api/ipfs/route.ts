import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cid = searchParams.get('cid');

  if (!cid) {
    return NextResponse.json({ error: 'CID is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`${FALLBACK_GATEWAY}${cid}`, {
      headers: {
        Accept: 'application/json',
      },
      // CORS-safe for edge
      cache: 'no-store',
    });

    const contentType = res.headers.get('content-type') || 'application/json';
    const data = await res.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch from IPFS', detail: err },
      { status: 500 }
    );
  }
}

