// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUeoo-u_70LyKIk724HKNEJ8nBlChbQ2Y",
  authDomain: "my-portfolio-a6128.firebaseapp.com",
  projectId: "my-portfolio-a6128",
  storageBucket: "my-portfolio-a6128.firebasestorage.app",
  messagingSenderId: "997703727257",
  appId: "1:997703727257:web:26530e7f6eed90ef80a008",
  measurementId: "G-M9RPJC7VZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);