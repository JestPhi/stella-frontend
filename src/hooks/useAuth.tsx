import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut as signOutAuth,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjax-slr22hK8fhz4UH8TPdwPFBspnCos",
  authDomain: "stella-f5652.firebaseapp.com",
  projectId: "stella-f5652",
  storageBucket: "stella-f5652.firebasestorage.app",
  messagingSenderId: "656826535955",
  appId: "1:656826535955:web:109ac457f30f132395efe6",
  measurementId: "G-27DBFQ4ES0",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const signOut = () => {
  signOutAuth(auth)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

const signIn = async () => {
  const signInData = await signInWithPopup(auth, provider);

  try {
    return signInData;
  } catch (error) {
    return error;
  }
};

const useAuth = () => {
  const [firebaseIdState, setFirebaseIdState] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseIdState(user.uid);
      } else {
        setFirebaseIdState(null);
      }
    });
  }, []);

  return { firebaseId: firebaseIdState, signIn, signOut };
};

export default useAuth;
