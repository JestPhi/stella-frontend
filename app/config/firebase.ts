import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDaa-a7VU1rnnv3lMHfZoKdVC4HdvMiA2I",
  authDomain: "stella-ac7b9.firebaseapp.com",
  projectId: "stella-ac7b9",
  storageBucket: "stella-ac7b9.firebasestorage.app",
  messagingSenderId: "1054908537886",
  appId: "1:1054908537886:web:e7df8176786c29a520220f",
  measurementId: "G-ZQHXBXP96J",
};

// Initialize Firebase app (singleton pattern)
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (singleton pattern)
export const auth = getAuth(app);

// Export config for any edge cases that need it
export { firebaseConfig };
