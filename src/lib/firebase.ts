import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVdlwmFyX-FaN0tgq6erqYM28EClxD6ow",
  authDomain: "musicfy-com.firebaseapp.com",
  projectId: "musicfy-com",
  storageBucket: "musicfy-com.firebasestorage.app",
  messagingSenderId: "988159353839",
  appId: "1:988159353839:web:5a758381d4a8b9136d0c1a",
  measurementId: "G-GP01L43CW5",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
