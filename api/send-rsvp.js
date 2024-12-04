// /api/send-rsvp.js
import { sendEmail } from "../sendEmail";


export default async function handler(req, res) {
  // Set CORS headers to allow requests from localhost and other origins
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (use specific origins for more security)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  if (req.method === 'OPTIONS') {
    // Preflight request: respond quickly to OPTIONS requests
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, guestNames, cantMakeIt, wellWishingMessage } = req.body;

  try {
    await sendEmail({ email, guestNames, cantMakeIt, wellWishingMessage });
    res.status(200).json({ success: true, message: 'RSVP submitted and email sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit RSVP.' });
  }
}
