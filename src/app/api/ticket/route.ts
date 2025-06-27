import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import puppeteer from 'puppeteer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')
  const campaign = searchParams.get('campaign')

  if (!wallet || !campaign) {
    return NextResponse.json({ error: 'Missing wallet or campaign' }, { status: 400 })
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(
      `https://accessmint.io/mint?wallet=${wallet}&campaign=${campaign}`
    )

    const html = `
      <html>
        <body style="width: 600px; height: 400px; padding: 20px; font-family: sans-serif; background: #fff;">
          <h1 style="margin: 0 0 10px;">🎟️ Access Pass</h1>
          <p style="margin: 4px 0;"><strong>Campaign:</strong> ${campaign}</p>
          <p style="margin: 4px 0;"><strong>Wallet:</strong> ${wallet}</p>
          <img src="${qrDataUrl}" style="width: 140px; height: 140px; margin-top: 20px;" />
        </body>
      </html>
    `

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(html)
    const buffer = await page.screenshot({ type: 'png' })
    await browser.close()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (err) {
    console.error('Image generation failed:', err)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}

