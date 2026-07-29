// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration loaded with safe fallback values to prevent production crash
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDUeoo-u_70LyKIk724HKNEJ8nBlChbQ2Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-portfolio-a6128.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-portfolio-a6128",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-portfolio-a6128.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "997703727257",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:997703727257:web:26530e7f6eed90ef80a008",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-M9RPJC7VZL"
};

let app = null;
let db = null;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    try {
      getAnalytics(app);
    } catch (e) {
      // Analytics non-critical error swallowed
    }
  }
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning:", error);
}

export { db };