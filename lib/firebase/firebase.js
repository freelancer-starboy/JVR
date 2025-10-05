// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhtlYuBT79yejhSGMdij04F5Rk0CvdpYw",
  authDomain: "team-jvr.firebaseapp.com",
  projectId: "team-jvr",
  storageBucket: "team-jvr.firebasestorage.app",
  messagingSenderId: "536885741387",
  appId: "1:536885741387:web:016e2e16d8b9567f76cace",
  measurementId: "G-6W3L1DNW9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);