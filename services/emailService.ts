import emailjs from "emailjs-com";

let generatedOtp: string | null = null;

export const sendEmailOtp = async (email: string): Promise<boolean> => {
  // generate random 6-digit OTP
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await emailjs.send(
      "service_8m1o19s",      // replace
      "template_c2craqk",     // replace
      {
        to_email: email,
        otp_code: generatedOtp, // matches your EmailJS template var
      },
      "y1LRkyhLtsvEU3I68"       // replace
    );
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

export const verifyEmailOtp = async (email: string, otp: string): Promise<boolean> => {
  if (otp === generatedOtp) {
    generatedOtp = null; // clear after success
    return true;
  }
  return false;
};
