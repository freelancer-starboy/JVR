// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2XpbEtNRSMrKEMorz3P9sBIAE6VhUBMs",
  authDomain: "jvr-auth.firebaseapp.com",
  projectId: "jvr-auth",
  storageBucket: "jvr-auth.firebasestorage.app",
  messagingSenderId: "617699436276",
  appId: "1:617699436276:web:24a7ed2783bb4d0e6260a1",
  measurementId: "G-K38LVNQNTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);