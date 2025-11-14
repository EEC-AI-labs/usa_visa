// firebaseConfig.ts
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyD9JzIQbPCj9_ff1Ye6bO9dOAnbD6_6jCo",
    authDomain: "eec-database-c8c39.firebaseapp.com",
    databaseURL: "https://eec-database-c8c39-default-rtdb.firebaseio.com",
    projectId: "eec-database-c8c39",
    storageBucket: "eec-database-c8c39.firebasestorage.app",
    messagingSenderId: "180240510261",
    appId: "1:180240510261:web:2e6e2defd91f3f270ef07c",
    measurementId: "G-QJSSNJTWKR"
  };

export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// Export Firestore DB instance
export const db = getFirestore(app);
export const auth = getAuth(app);

