import React, { useState, useEffect, useRef } from 'react';
import { sendEmailOtp, verifyEmailOtp } from '../services/emailService';
import { STATES } from '../data/states';
import { CITIES } from '../data/cities';
import { registerUser } from "../services/userService";
import { sendOtpMSG91, verifyOtpMSG91 } from '../services/messageService';


interface LoginSignupModalProps {
  onAuthSuccess: () => void;
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const Spinner: React.FC<{className?: string}> = ({ className = "h-5 w-5 text-white" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LoginSignupModal: React.FC<LoginSignupModalProps> = ({ onAuthSuccess, onSwitchToLogin, onClose }) => {

  // Email verification
  const [emailVerificationStep, setEmailVerificationStep] = useState<'idle' | 'pending' | 'verified'>('idle');

  // Phone verification
  const [phoneStep, setPhoneStep] = useState<'idle' | 'pending' | 'verified'>('idle');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
  });

  const [otp, setOtp] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);



  // ----------------------------
  // PHONE: SEND OTP
  // ----------------------------
  const handleSendPhoneOtp = async () => {
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const fullPhone = "+91" + formData.phone;
    setError(null);
    setPhoneOtpError(null);
    setIsSendingPhoneOtp(true);

    try {
      const result = await sendOtpMSG91(fullPhone);

      if (result) {
        setPhoneStep("pending");
        setCountdown(60);
      } else {
        setError("Failed to send phone OTP. Try again.");
      }
    } catch (err) {
      setError("Unable to send phone OTP. Try again.");
    }

    setIsSendingPhoneOtp(false);
  };

  // ----------------------------
  // PHONE: VERIFY OTP
  // ----------------------------
  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      setPhoneOtpError("Enter the 6-digit OTP.");
      return;
    }

    setPhoneOtpError(null);
    setIsVerifyingPhoneOtp(true);

    const fullPhone = "+91" + formData.phone;

    try {
      const result = await verifyOtpMSG91(fullPhone, phoneOtp);

      if (result.type === "success" || result.message?.toLowerCase().includes("verified")) {
        setPhoneStep("verified");
      } else {
        setPhoneOtpError("Invalid OTP.");
        setPhoneOtp("");
      }
    } catch (err) {
      setPhoneOtpError("Failed to verify OTP. Try again.");
    }

    setIsVerifyingPhoneOtp(false);
  };



  // Countdown timer (shared for both)
  useEffect(() => {
    if (countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [countdown]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }

    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, city: '' }));
      setCities(CITIES[value] || []);

    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };



  // Email OTP
  const handleSendEmailOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setOtpError(null);
    setIsSendingOtp(true);
    try {
      const success = await sendEmailOtp(formData.email);
      if (success) {
        setEmailVerificationStep('pending');
        setCountdown(60);
      } else {
        setError('Failed to send OTP. Please check your email and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }
    setOtpError(null);
    setError(null);
    setIsVerifyingOtp(true);
    try {
      const success = await verifyEmailOtp(formData.email, otp);
      if (success) {
        setEmailVerificationStep('verified');
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setOtp('');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };



  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError(null);

    try {
      const result = await registerUser(formData);

      if (result === "EXISTS") {
        setError("An account with this email already exists. Please sign in.");
        onSwitchToLogin();
        return;
      }

      if (result === "ERROR") {
        setError("Something went wrong. Please try again.");
        return;
      }

      onAuthSuccess();

    } finally {
      setIsRegistering(false);
    }
  };



  const inputClass =
    "w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition bg-white dark:bg-slate-900 dark:text-slate-100";
  const labelClass =
    "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  const isFormDisabled = emailVerificationStep === 'pending';



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <img src="https://ai.eecglobal.com/assets/eeclogo.svg" alt="EEC" className="mx-auto h-10" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome!
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Create an account or{" "}
            <button onClick={onSwitchToLogin} className="text-indigo-600">
              Sign In
            </button>
          </p>
        </div>



        {/* FORM */}
        <form onSubmit={handleRegister} className="mt-8 space-y-4">



          {/* FULL NAME */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" name="name" required value={formData.name}
              onChange={handleInputChange} className={inputClass} />
          </div>



          {/* EMAIL + VERIFY BUTTON */}
          <div>
            <label className={labelClass}>Email</label>
            <div className="flex items-center gap-2">

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                disabled={emailVerificationStep !== "idle"}
              />

              {emailVerificationStep === "idle" && (
                <button type="button"
                  onClick={handleSendEmailOtp}
                  disabled={isSendingOtp || !formData.email.includes("@")}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg">
                  {isSendingOtp ? <Spinner /> : "Verify"}
                </button>
              )}

              {emailVerificationStep === "verified" && (
                <span className="text-green-600 font-semibold">✔ Verified</span>
              )}

            </div>
          </div>



          {/* EMAIL OTP BOX */}
          {emailVerificationStep === "pending" && (
            <div className="p-4 bg-indigo-50 rounded-lg space-y-3">

              <p className="text-sm text-center">
                Enter the 6-digit code sent to <strong>{formData.email}</strong>
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className={`${inputClass} text-center tracking-[0.5em]`}
                  maxLength={6}
                />

                <button
                  type="button"
                  onClick={handleVerifyEmailOtp}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg">
                  {isVerifyingOtp ? <Spinner /> : "Confirm"}
                </button>
              </div>

              {otpError && (
                <p className="text-center text-xs text-red-600">{otpError}</p>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={countdown > 0}
                  className="text-indigo-600">
                  Resend OTP {countdown > 0 ? `(${countdown}s)` : ""}
                </button>
              </div>

            </div>
          )}



          {/* PHONE NUMBER + VERIFY BUTTON */}
          <div>
            <label className={labelClass}>Phone Number</label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-3 text-slate-500">+91</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${inputClass} pl-12`}
                  disabled={phoneStep !== "idle"}
                />
              </div>

              {phoneStep === "idle" && (
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={isSendingPhoneOtp || formData.phone.length !== 10}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg"
                >
                  {isSendingPhoneOtp ? <Spinner /> : "Verify"}
                </button>
              )}

              {phoneStep === "verified" && (
                <span className="text-green-600 font-semibold">✔ Verified</span>
              )}
            </div>
          </div>



          {/* PHONE OTP BOX */}
          {phoneStep === "pending" && (
            <div className="p-4 bg-indigo-50 rounded-lg space-y-3">

              <p className="text-sm text-center">
                Enter OTP sent to <strong>+91 {formData.phone}</strong>
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={phoneOtp}
                  onChange={(e) =>
                    setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className={`${inputClass} text-center tracking-[0.5em]`}
                  maxLength={6}
                />

                <button
                  type="button"
                  onClick={handleVerifyPhoneOtp}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg">
                  {isVerifyingPhoneOtp ? <Spinner /> : "Confirm"}
                </button>
              </div>

              {phoneOtpError && (
                <p className="text-center text-xs text-red-600">
                  {phoneOtpError}
                </p>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={countdown > 0}
                  className="text-indigo-600">
                  Resend OTP {countdown > 0 ? `(${countdown}s)` : ""}
                </button>
              </div>
            </div>
          )}




          {/* STATE + CITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>State</label>
              <select name="state" value={formData.state}
                onChange={handleInputChange}
                className={inputClass}
                disabled={phoneStep !== "verified"}>
                <option value="">Select State</option>
                {STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={inputClass}
                disabled={!formData.state || phoneStep !== "verified"}>
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>



          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={
              isRegistering ||
              emailVerificationStep !== "verified" ||
              phoneStep !== "verified"
            }
            className="w-full py-3 bg-indigo-600 text-white rounded-lg mt-6"
          >
            {isRegistering ? <Spinner /> : "Create Account & Get Started"}
          </button>

        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

      </div>
    </div>
  );
};

export default LoginSignupModal;

