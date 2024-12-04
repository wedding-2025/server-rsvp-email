// backend/server2.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sendEmail } from './sendEmail.js';

const app = express();
const PORT = 3500;
app.use(bodyParser.json());
app.use(cors())

app.post('/send-rsvp', async (req, res) => {
  const { email, guestNames, cantMakeIt, wellWishingMessage } = req.body;

  try {
    await sendEmail({
      email,
      wellWishingMessage,
      guestNames,
      cantMakeIt,
    });
    res.status(200).json({ success: true, message: "RSVP submitted and email sent successfully!" });
  } catch (error) {
    console.error("Error sending RSVP email:", error);
    res.status(500).json({ success: false, message: "There was a problem submitting your RSVP. Please try again later." });
  }
});

app.listen(3500, () => {
  console.log(`Server running on ${PORT}`);
});
