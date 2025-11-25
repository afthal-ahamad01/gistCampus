// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDMurNlDUZIE_Q2oa5qHFBSZ1jTUsKO67g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gistcampus-69883.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gistcampus-69883",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gistcampus-69883.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "100464245270",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:100464245270:web:5beb9a139bcca44d995337",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PQLBCY0T5J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const auth = getAuth(app);

let analytics;

if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Analytics not initialized:", err);
    });
}

export { app, db, storage, functions, analytics, auth, firebaseConfig };