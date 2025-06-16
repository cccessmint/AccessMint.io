import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';
import axios from 'axios';

export async function generateTicketImage({
  typeName,
  eventName,
  price,
  qrData
}: {
  typeName: string;
  eventName: string;
  price: number;
  qrData: string;
}) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(eventName, 50, 60);

  // Ticket Type
  ctx.font = '28px Arial';
  ctx.fillText(`Type: ${typeName}`, 50, 130);

  // Price
  ctx.fillText(`Price: ${price} MATIC`, 50, 190);

  // QR Code
  const qrImageDataUrl = await QRCode.toDataURL(qrData);
  const qrImage = await loadImage(qrImageDataUrl);
  ctx.drawImage(qrImage, width - 220, 80, 150, 150);

  return canvas.toBuffer('image/png');
}

