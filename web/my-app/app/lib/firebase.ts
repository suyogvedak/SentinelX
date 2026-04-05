import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKNINgpZceZXrPKCTIA7Ocehe3uaoImis",
  authDomain: "sentinelx-7dcb5.firebaseapp.com",
  projectId: "sentinelx-7dcb5",
  storageBucket: "sentinelx-7dcb5.firebasestorage.app",
  messagingSenderId: "159101125498",
  appId: "1:159101125498:web:79accca5f3981792bbccc3",
  measurementId: "G-JE6CR76LXM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
