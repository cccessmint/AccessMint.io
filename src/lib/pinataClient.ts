import PinataClient from '@pinata/sdk';

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY!,
});

export default pinata;

