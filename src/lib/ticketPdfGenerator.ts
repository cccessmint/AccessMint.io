import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateTicketPDF({
  eventName,
  typeName,
  price,
  qrData
}: {
  eventName: string;
  typeName: string;
  price: number;
  qrData: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Background
  page.drawRectangle({
    x: 0, y: 0, width: 600, height: 400,
    color: rgb(1, 1, 1)
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 24;

  page.drawText(eventName, { x: 50, y: 350, size: fontSize, font, color: rgb(1, 1, 0) });
  page.drawText(`Type: ${typeName}`, { x: 50, y: 300, size: 20, font, color: rgb(1, 1, 1) });
  page.drawText(`Price: ${price} MATIC`, { x: 50, y: 260, size: 20, font, color: rgb(1, 1, 1) });

  // Embedamo QR kao tekstualni kod (za sada jednostavno)
  page.drawText(`QR: ${qrData}`, { x: 50, y: 220, size: 12, font, color: rgb(0.9, 0.9, 0.9) });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

