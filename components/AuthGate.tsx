// (window as any).FIREBASE_RECAPTCHA_ENTERPRISE_ENABLED = false;


// import React, { useState, useEffect, useRef } from "react";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   ConfirmationResult,
// } from "firebase/auth";
// import { auth } from "../services/firebaseConfig";

// interface AuthGateProps {
//   onAuthSuccess: () => void;
// }

// declare global {
//   interface Window {
//     recaptchaVerifier: RecaptchaVerifier;
//     confirmationResult: ConfirmationResult;
//   }
// }

// const Spinner: React.FC = () => (
//   <svg
//     className="animate-spin h-5 w-5 text-white"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     ></circle>
//     <path
//       className="opacity-75"
//       fill="currentColor"
//       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//     ></path>
//   </svg>
// );

// const AuthGate: React.FC<AuthGateProps> = ({ onAuthSuccess }) => {
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [countdown, setCountdown] = useState(0);
//   const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
//     null
//   );

//   // ⏳ Handle countdown
//   useEffect(() => {
//     if (countdown > 0) {
//       countdownIntervalRef.current = setInterval(() => {
//         setCountdown((prev) => prev - 1);
//       }, 1000);
//     } else if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//     }
//     return () => {
//       if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
//     };
//   }, [countdown]);

//   const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "");
//     if (value.length <= 10) setPhoneNumber(value);
//   };

//   // 🧱 Setup reCAPTCHA
//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth, // ✅ First argument should be the Auth instance
//         "recaptcha-container", // ✅ Second argument is container ID
//         {
//           size: "invisible",
//           callback: () => console.log("reCAPTCHA verified"),
//         }
//       );
//     }
//   };

//   // 📲 Send OTP via Firebase
//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (phoneNumber.length !== 10) {
//       setError("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       setupRecaptcha();
//       const appVerifier = window.recaptchaVerifier;
//       const fullPhone = `+91${phoneNumber}`;
//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         fullPhone,
//         appVerifier
//       );
//       window.confirmationResult = confirmationResult;
//       setStep("otp");
//       setCountdown(60);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to send OTP. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ Verify OTP
//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (otp.length !== 6) {
//       setError("Please enter the 6-digit OTP.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await window.confirmationResult.confirm(otp);
//       console.log("User verified:", result.user);
//       onAuthSuccess();
//     } catch (err) {
//       console.error(err);
//       setError("Invalid OTP. Please try again.");
//       setOtp("");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = () => {
//     setOtp("");
//     setError(null);
//     setStep("phone");
//   };

//   const maskedPhoneNumber = `+91 ******${phoneNumber.slice(-4)}`;

//   return (
//     <section className="max-w-xl mx-auto bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200/80 dark:border-slate-700/80 fade-in">
//       <div className="text-center">
//         <svg
//           className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth="1.5"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
//           />
//         </svg>
//         <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
//           Unlock Your Prep Plan
//         </h2>
//         <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
//           {step === "phone"
//             ? "To access your personalized content, please verify your phone number."
//             : `We've sent a 6-digit code to ${maskedPhoneNumber}.`}
//         </p>
//       </div>

//       {/* PHONE INPUT */}
//       {step === "phone" && (
//         <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
//           <div>
//             <label htmlFor="phone-number" className="sr-only">
//               Phone number
//             </label>
//             <div className="relative">
//               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                 <span className="text-slate-500 sm:text-sm">+91</span>
//               </div>
//               <input
//                 id="phone-number"
//                 name="phone-number"
//                 type="tel"
//                 autoComplete="tel"
//                 required
//                 value={phoneNumber}
//                 onChange={handlePhoneNumberChange}
//                 className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                 placeholder="98765 43210"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600"
//           >
//             {isLoading ? <Spinner /> : "Send OTP"}
//           </button>
//           <div id="recaptcha-container"></div>
//         </form>
//       )}

//       {/* OTP INPUT */}
//       {step === "otp" && (
//         <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
//           <div>
//             <label htmlFor="otp" className="sr-only">
//               OTP
//             </label>
//             <input
//               id="otp"
//               name="otp"
//               type="text"
//               inputMode="numeric"
//               autoComplete="one-time-code"
//               required
//               value={otp}
//               onChange={(e) =>
//                 setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//               }
//               className="w-full text-center tracking-[1em] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
//               placeholder="______"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600"
//           >
//             {isLoading ? <Spinner /> : "Verify & Continue"}
//           </button>
//           <div className="text-center text-sm">
//             <button
//               type="button"
//               onClick={handleResendOtp}
//               disabled={countdown > 0}
//               className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
//             >
//               Change Number{" "}
//               {countdown > 0 ? `(Try again in ${countdown}s)` : ""}
//             </button>
//           </div>
//         </form>
//       )}

//       {error && (
//         <p className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
//           {error}
//         </p>
//       )}
//     </section>
//   );
// };

// export default AuthGate;
