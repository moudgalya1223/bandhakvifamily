import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyDKSjxynGd6qRVFHFgMu8lawUt5ut41fV8",
  authDomain: "familytree-3a3d0.firebaseapp.com",
  projectId: "familytree-3a3d0",
  storageBucket: "familytree-3a3d0.firebasestorage.app",
  messagingSenderId: "931137663426",
  appId: "1:931137663426:web:6aaf43085d4e1d1751265b",
  measurementId: "G-4X5SY950EZ"
};

// Initialize Firebase app singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_EMAIL = "dattu99amm@gmail.com";
export default app;
