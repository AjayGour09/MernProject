// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewai-84ae5.firebaseapp.com",
  projectId: "interviewai-84ae5",
  storageBucket: "interviewai-84ae5.firebasestorage.app",
  messagingSenderId: "873109629585",
  appId: "1:873109629585:web:410a79f6d854e5c086ed30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth , provider} 