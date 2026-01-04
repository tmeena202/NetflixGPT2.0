// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnG4GYwFMMlR_2EWhwoE5xYOMAk7fL1mE",
  authDomain: "netflixgpt-d1f04.firebaseapp.com",
  projectId: "netflixgpt-d1f04",
  storageBucket: "netflixgpt-d1f04.firebasestorage.app",
  messagingSenderId: "655898698346",
  appId: "1:655898698346:web:28a776d13da775ed5f6013",
  measurementId: "G-0006K68P3L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
