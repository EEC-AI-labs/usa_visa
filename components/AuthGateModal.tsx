import React, { useState, useEffect, useRef } from "react";
import { sendOtpMSG91, verifyOtpMSG91 } from "../services/messageService";
import { checkUserExists } from "../services/userService";

interface Props {
  onAuthSuccess: () => void;
  onSwitchToSignup: () => void;
  onClose: () => void;
}

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0..." />
  </svg>
);

const AuthGateModal: React.FC<Props> = ({
  onAuthSuccess,
  onSwitchToSignup,
  onClose
}) => {

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const ref = useRef<any>();

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      ref.current = setInterval(() => setCountdown(x => x - 1), 1000);
    }
    return () => clearInterval(ref.current);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullPhone = "+91" + phoneNumber;
    const plainPhone = phoneNumber;          // for Firestore


    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Enter a valid 10-digit number.");
      return;
    }

    setIsLoading(true);

    try {
      // Check Firestore first
      console.log("Checking user:", plainPhone);

      console.log(fullPhone, " -======")
      const exists = await checkUserExists(plainPhone);

      if (!exists) {
        setError("Phone not registered. Please sign up first.");
        setIsLoading(false);
        return;
      }

      // Send OTP through MSG91
      await sendOtpMSG91(fullPhone);

      setStep("otp");
      setCountdown(60);

    } catch (err) {
      console.error(err);
      setError("Unable to send OTP. Try again.");
    }

    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const fullPhone = "+91" + phoneNumber;

    try {
      const result = await verifyOtpMSG91(fullPhone, otp);

      if (result.type === "success") {
        onAuthSuccess();
      } else {
        setError("Invalid OTP.");
      }

    } catch (err) {
      setError("OTP verification failed.");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md relative shadow-xl animate-fadeIn">
  
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
        >
          ✕
        </button>
  
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">
          Sign In
        </h2>
  
        {/* PHONE INPUT */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
            
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">+91</span>
  
              <input
                className="w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-14 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="98765 43210"
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
            >
              {isLoading ? <Spinner /> : "Send OTP"}
            </button>
  
          </form>
        )}
  
        {/* OTP INPUT */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
  
            <input
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg text-center tracking-[1em] py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              placeholder="______"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
            />
  
            <button
              type="submit"
              disabled={otp.length !== 6 || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
            >
              {isLoading ? <Spinner /> : "Verify & Continue"}
            </button>
  
            <button
              type="button"
              disabled={countdown > 0}
              className="text-indigo-600 disabled:text-slate-400"
              onClick={() => {
                setOtp("");
                setStep("phone");
                setCountdown(0);
              }}
            >
              Change number {countdown > 0 && `(${countdown}s)`}
            </button>
  
          </form>
        )}
  
        {/* Error message */}
        {error && (
          <p className="text-center text-red-600 dark:text-red-400 mt-4">
            {error}
          </p>
        )}
  
        {/* Footer */}
        <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
          Don’t have an account?
          <button className="text-indigo-600 ml-1 font-medium" onClick={onSwitchToSignup}>
            Sign up
          </button>
        </p>
  
      </div>
    </div>
  );
  
};

export default AuthGateModal;
