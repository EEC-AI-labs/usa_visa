import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import axios from "axios";
import * as dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

// ----------------------------------
// Firebase Admin Initialization
// ----------------------------------
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ----------------------------------
// ENV
// ----------------------------------
const MSG91_KEY_USA = process.env.MSG91_KEY_DEMO;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID_DEMO;

// ----------------------------------
// CORS Helper
// ----------------------------------
const setCors = (res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
};

/* =====================================================
   SEND OTP
   ===================================================== */
export const sendOtpUSA = onRequest(async (req: Request, res: Response) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const phone =
    req.query.mobile?.toString() ||
    req.body?.phone ||
    req.body?.mobile;

  const template =
    req.query.template_id?.toString() || MSG91_TEMPLATE_ID;

  const expiry =
    req.query.otp_expiry?.toString() || "3";

  if (!phone) {
    res.status(400).send({ error: "Phone number is required" });
    return;
  }

  try {
    const payload = {
      mobile: phone,
      otp_length: 6,
      otp_expiry: Number(expiry),
      template_id: template,
    };

    const headers = {
      authkey: MSG91_KEY_USA,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      payload,
      { headers }
    );

    res.send(response.data);
  } catch (error: any) {
    console.error("❌ MSG91 Send OTP Error:", error.response?.data || error);
    res.status(500).send({ error: "OTP send failed" });
  }
});

/* =====================================================
   VERIFY OTP
   ===================================================== */
export const verifyOtpUSA = onRequest(async (req: Request, res: Response) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  const phone =
    req.query.mobile?.toString() ||
    req.body?.phone ||
    req.body?.mobile;

  const otp =
    req.query.otp?.toString() ||
    req.body?.otp;

  if (!phone || !otp) {
    res.status(400).send({ error: "Phone and OTP required" });
    return;
  }

  try {
    const url = `https://control.msg91.com/api/v5/otp/verify?mobile=${phone}&otp=${otp}`;

    const response = await axios.get(url, {
      headers: { authkey: MSG91_KEY_USA },
    });

    res.send(response.data);
  } catch (error: any) {
    console.error("❌ MSG91 Verify OTP Error:", error.response?.data || error);
    res.status(500).send({ error: "OTP verification failed" });
  }
});

/* =====================================================
   ⭐ NEW FEATURE: Increment Prep Plan Count
   Firebase Callable Function (No CORS Needed)
   ===================================================== */
export const incrementPrepCount = onCall(async (request) => {
  try {
    const uid = request.auth?.uid;

    if (!uid) {
      throw new HttpsError(
        "unauthenticated",
        "User must be logged in to increment prep plan count."
      );
    }

    const userRef = db.collection("users").doc(uid);

    await userRef.set(
      {
        prepPlanCount: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };

  } catch (err: any) {
    console.error("🔥 incrementPrepCount Error:", err);

    throw new HttpsError(
      "internal",
      err?.message || "Failed to update prep plan count"
    );
  }
});
