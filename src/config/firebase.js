// Import the functions you need from the SDKs you need
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
  apiKey: "AIzaSyDMurNlDUZIE_Q2oa5qHFBSZ1jTUsKO67g",
  authDomain: "gistcampus-69883.firebaseapp.com",
  projectId: "gistcampus-69883",
  storageBucket: "gistcampus-69883.firebasestorage.app",
  messagingSenderId: "100464245270",
  appId: "1:100464245270:web:5beb9a139bcca44d995337",
  measurementId: "G-PQLBCY0T5J"
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