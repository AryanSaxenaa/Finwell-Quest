// server.js
// Simple Express backend for email OTP 2FA using SendGrid

const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || process.env.SENDGRID_KEY || process.env.SENDGRID_SECRET;
const OTP_EXPIRY_MINUTES = 10;

sgMail.setApiKey(SENDGRID_API_KEY);

// In-memory store for OTPs (use Redis/DB for production)
const otps = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const otp = generateOTP();
  otps[email] = { otp, expires: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000 };
  try {
    await sgMail.send({
      to: email,
      from: 'no-reply@yourapp.com',
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otps[email];
  if (!record) return res.status(400).json({ error: 'No OTP sent' });
  if (Date.now() > record.expires) return res.status(400).json({ error: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  delete otps[email];
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`2FA backend running on port ${PORT}`));
