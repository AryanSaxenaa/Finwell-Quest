// src/services/twoFactorService.js
// Service for 2FA API calls from React Native app
import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Change to your backend URL if needed

export async function sendOTP(email) {
  try {
    const res = await axios.post(`${BASE_URL}/send-otp`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || 'Failed to send OTP';
  }
}

export async function verifyOTP(email, otp) {
  try {
    const res = await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || 'Failed to verify OTP';
  }
}
