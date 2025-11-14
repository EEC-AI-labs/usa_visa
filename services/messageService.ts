import axios from "axios";

// Your Cloud Function URLs (replace YOUR_PROJECT_ID)
const SEND_OTP_URL =
  "https://us-central1-eec-database-c8c39.cloudfunctions.net/sendOtpUSA";

const VERIFY_OTP_URL =
  "https://us-central1-eec-database-c8c39.cloudfunctions.net/verifyOtpUSA";

// -------------------------
// SEND OTP (via Firebase Function)
// -------------------------
export const sendOtpMSG91 = async (phone: string) => {
  try {
    const res = await axios.post(
      SEND_OTP_URL,
      { phone },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("🔥 sendOtpMSG91 ERROR", err.response?.data || err);
    throw err;
  }
};

// -------------------------
// VERIFY OTP (via Firebase Function)
// -------------------------
export const verifyOtpMSG91 = async (phone: string, otp: string) => {
  try {
    const res = await axios.post(
      VERIFY_OTP_URL,
      { phone, otp },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("🔥 verifyOtpMSG91 ERROR", err.response?.data || err);
    throw err;
  }
};
