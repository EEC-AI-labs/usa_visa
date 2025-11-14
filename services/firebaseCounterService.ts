import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebaseConfig"; // your firebase initializer

export const incrementPrepCount = async () => {
  const functions = getFunctions(app);
  const callFn = httpsCallable(functions, "incrementPrepCount");
  return await callFn();
};
