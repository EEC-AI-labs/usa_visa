import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";





export const checkUserExists = async (phone: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("phone", "==", phone));
  const snap = await getDocs(q);
  return !snap.empty;
};


export const registerUser = async (userData: any) => {
  try {
    const usersRef = collection(db, "users");

    // 1️⃣ CHECK IF USER ALREADY EXISTS
    const q = query(usersRef, where("email", "==", userData.email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return "EXISTS"; // user already has an account
    }

    // 2️⃣ CREATE NEW USER
    await addDoc(usersRef, {
      ...userData,
      isVerified: true,
      createdAt: serverTimestamp(),
    });

    return "CREATED"; // new user created successfully

  } catch (error) {
    console.error("Error saving user:", error);
    return "ERROR";
  }
};
